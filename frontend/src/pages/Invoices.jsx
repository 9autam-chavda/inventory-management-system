import React, { useState, useEffect, useCallback } from "react";
import { FaTrash, FaPlus, FaSearch, FaFileInvoice, FaFilePdf } from "react-icons/fa";
import invoiceService from "../services/invoiceService";
import saleService from "../services/saleService";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import { generateInvoicePDF } from "../utils/pdfGenerator";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const Invoices = () => {
  // -------------------------------
  // State
  // -------------------------------
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [saleSearchTerm, setSaleSearchTerm] = useState("");
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [selectedSaleLabel, setSelectedSaleLabel] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // -------------------------------
  // Load Invoices & Sales
  // -------------------------------
  const loadInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const data = await invoiceService.getAll();
      setInvoices(data || []);
      setFilteredInvoices(data || []);
    } catch (error) {
      console.error("Failed to load invoices:", error);
      setInvoices([]);
      setFilteredInvoices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSales = useCallback(async () => {
    try {
      const data = await saleService.getAll();
      setSales(data || []);
    } catch (error) {
      console.error("Failed to load sales:", error);
      setSales([]);
    }
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  // -------------------------------
  // Search Invoices (real-time, client-side, case-insensitive)
  // -------------------------------
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      setFilteredInvoices(invoices);
      return;
    }

    const filtered = invoices.filter(
      (invoice) =>
        invoice.invoiceNumber?.toLowerCase().includes(term) ||
        invoice.customerName?.toLowerCase().includes(term) ||
        invoice.productName?.toLowerCase().includes(term)
    );

    setFilteredInvoices(filtered);
  }, [searchTerm, invoices]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // -------------------------------
  // Filtered Sales for Dropdown
  // -------------------------------
  const filteredSales = sales.filter((sale) => {
    const term = saleSearchTerm.trim().toLowerCase();
    if (term === "") return true;
    const label = `${sale.customerName || ""} - ${sale.productName || ""}`.toLowerCase();
    return label.includes(term);
  });

  // -------------------------------
  // Modal Handlers
  // -------------------------------
  const openGenerateModal = () => {
    setSelectedSaleId(null);
    setSelectedSaleLabel("");
    setSaleSearchTerm("");
    setFormErrors({});
    setShowModal(true);
    loadSales();
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedSaleId(null);
    setSelectedSaleLabel("");
    setSaleSearchTerm("");
    setFormErrors({});
    setSaving(false);
  };

  const handleSelectSale = (sale) => {
    setSelectedSaleId(sale.id);
    setSelectedSaleLabel(`${sale.customerName} - ${sale.productName}`);
    setSaleSearchTerm("");
    if (formErrors.saleId) {
      setFormErrors((prev) => ({ ...prev, saleId: "" }));
    }
  };

  // -------------------------------
  // Validation
  // -------------------------------
  const validateForm = () => {
    const errors = {};

    if (!selectedSaleId) {
      errors.saleId = "Please select a sale to generate an invoice from.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------
  // Generate Invoice
  // -------------------------------
  const generateInvoice = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await invoiceService.generate(selectedSaleId);
      await loadInvoices();
      closeModal();
    } catch (error) {
      console.error("Failed to generate invoice:", error);
      setFormErrors((prev) => ({
        ...prev,
        general: "Something went wrong while generating the invoice. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------
  // Delete
  // -------------------------------
  const deleteInvoice = async (invoice) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete invoice "${invoice.invoiceNumber}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await invoiceService.remove(invoice.id);
      await loadInvoices();
    } catch (error) {
      console.error("Failed to delete invoice:", error);
      alert("Failed to delete invoice. Please try again.");
    }
  };

  // -------------------------------
  // PDF Download
  // -------------------------------
  const handleDownloadPDF = (invoice) => {
    try {
      generateInvoicePDF(invoice);
    } catch (error) {
      console.error("Failed to generate invoice PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="container-fluid py-4">
      <PageHeader
        title="Invoices"
        subtitle="Generate and manage sales invoices"
      />

      <div className="card border-0 shadow-sm rounded-4 mt-4">
        <div className="card-body p-4">
          {/* Toolbar */}
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-stretch align-items-md-center gap-3 mb-4">
            <div className="position-relative" style={{ maxWidth: "350px", width: "100%" }}>
              <FaSearch
                className="position-absolute text-muted"
                style={{ top: "50%", left: "14px", transform: "translateY(-50%)" }}
              />
              <input
                type="text"
                className="form-control ps-5 rounded-pill"
                placeholder="Search invoices..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary rounded-pill px-4 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={openGenerateModal}
            >
              <FaPlus size={14} />
              <span>Generate Invoice</span>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr className="text-muted small text-uppercase">
                    <th style={{ width: "80px" }}>ID</th>
                    <th>Invoice Number</th>
                    <th>Customer Name</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Selling Price</th>
                    <th>Total Amount</th>
                    <th>Invoice Date</th>
                    <th className="text-end" style={{ width: "100px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInvoices.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="text-center text-muted py-5">
                        No Invoices Found
                      </td>
                    </tr>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="text-muted">{invoice.id}</td>
                        <td className="fw-medium">{invoice.invoiceNumber}</td>
                        <td>{invoice.customerName}</td>
                        <td>{invoice.productName}</td>
                        <td>{invoice.quantity}</td>
                        <td>{currencyFormatter.format(invoice.sellingPrice)}</td>
                        <td>{currencyFormatter.format(invoice.totalAmount)}</td>
                        <td>
                          {invoice.invoiceDate
                            ? new Date(invoice.invoiceDate).toLocaleDateString()
                            : ""}
                        </td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px" }}
                              title="Download PDF"
                              onClick={() => handleDownloadPDF(invoice)}
                            >
                              <FaFilePdf size={13} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px" }}
                              title="Delete"
                              onClick={() => deleteInvoice(invoice)}
                            >
                              <FaTrash size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Generate Invoice Modal */}
      {showModal && (
        <>
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            role="dialog"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow rounded-4">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-semibold d-flex align-items-center gap-2">
                    <FaFileInvoice className="text-primary" />
                    Generate Invoice
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={saving}
                  ></button>
                </div>

                <div className="modal-body pt-3">
                  {formErrors.general && (
                    <div className="alert alert-danger py-2 rounded-3">
                      {formErrors.general}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="saleSearch" className="form-label fw-medium">
                      Select Sale <span className="text-danger">*</span>
                    </label>

                    {selectedSaleId ? (
                      <div
                        className={`form-control rounded-3 d-flex align-items-center justify-content-between ${
                          formErrors.saleId ? "is-invalid" : ""
                        }`}
                      >
                        <span className="fw-medium">{selectedSaleLabel}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-link text-danger text-decoration-none p-0"
                          onClick={() => {
                            setSelectedSaleId(null);
                            setSelectedSaleLabel("");
                          }}
                        >
                          Change
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="position-relative">
                          <FaSearch
                            className="position-absolute text-muted"
                            style={{
                              top: "50%",
                              left: "14px",
                              transform: "translateY(-50%)",
                            }}
                          />
                          <input
                            id="saleSearch"
                            type="text"
                            className={`form-control ps-5 rounded-3 ${
                              formErrors.saleId ? "is-invalid" : ""
                            }`}
                            placeholder="Search by customer or product..."
                            value={saleSearchTerm}
                            onChange={(e) => setSaleSearchTerm(e.target.value)}
                            autoFocus
                          />
                        </div>

                        <div
                          className="list-group mt-2 rounded-3 shadow-sm"
                          style={{ maxHeight: "220px", overflowY: "auto" }}
                        >
                          {filteredSales.length === 0 ? (
                            <div className="text-center text-muted py-3 small">
                              No Sales Found
                            </div>
                          ) : (
                            filteredSales.map((sale) => (
                              <button
                                key={sale.id}
                                type="button"
                                className="list-group-item list-group-item-action"
                                onClick={() => handleSelectSale(sale)}
                              >
                                <span className="fw-medium">
                                  {sale.customerName}
                                </span>{" "}
                                <span className="text-muted">
                                  - {sale.productName}
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </>
                    )}

                    {formErrors.saleId && (
                      <div className="invalid-feedback d-block">
                        {formErrors.saleId}
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill px-4"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary rounded-pill px-4"
                    onClick={generateInvoice}
                    disabled={saving}
                  >
                    {saving ? "Generating..." : "Generate"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default Invoices;