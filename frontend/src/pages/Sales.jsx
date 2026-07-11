import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import saleService from "../services/saleService";
import productService from "../services/productService";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const Sales = () => {
  // -------------------------------
  // State
  // -------------------------------
  const [sales, setSales] = useState([]);
  const [filteredSales, setFilteredSales] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSaleId, setSelectedSaleId] = useState(null);
  const [formData, setFormData] = useState({
    customerName: "",
    productId: "",
    quantity: "",
    sellingPrice: "",
    saleDate: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // -------------------------------
  // Load Sales & Products
  // -------------------------------
  const loadSales = useCallback(async () => {
    try {
      setLoading(true);
      const data = await saleService.getAll();
      setSales(data || []);
      setFilteredSales(data || []);
    } catch (error) {
      console.error("Failed to load sales:", error);
      setSales([]);
      setFilteredSales([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadProducts = useCallback(async () => {
    try {
      const data = await productService.getAll();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    }
  }, []);

  useEffect(() => {
    loadSales();
    loadProducts();
  }, [loadSales, loadProducts]);

  // -------------------------------
  // Search (real-time, client-side, case-insensitive)
  // -------------------------------
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      setFilteredSales(sales);
      return;
    }

    const filtered = sales.filter(
      (sale) =>
        sale.customerName?.toLowerCase().includes(term) ||
        sale.productName?.toLowerCase().includes(term)
    );

    setFilteredSales(filtered);
  }, [searchTerm, sales]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // -------------------------------
  // Form Handlers
  // -------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // -------------------------------
  // Modal Handlers
  // -------------------------------
  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedSaleId(null);
    setFormData({
      customerName: "",
      productId: "",
      quantity: "",
      sellingPrice: "",
      saleDate: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (sale) => {
    setIsEditMode(true);
    setSelectedSaleId(sale.id);

    const matchedProduct = products.find(
      (product) => product.name === sale.productName
    );

    setFormData({
      customerName: sale.customerName || "",
      productId: sale.productId ?? matchedProduct?.id ?? "",
      quantity: sale.quantity ?? "",
      sellingPrice: sale.sellingPrice ?? "",
      saleDate: sale.saleDate || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedSaleId(null);
    setFormData({
      customerName: "",
      productId: "",
      quantity: "",
      sellingPrice: "",
      saleDate: "",
    });
    setFormErrors({});
    setSaving(false);
  };

  // -------------------------------
  // Validation
  // -------------------------------
  const validateForm = () => {
    const errors = {};
    const trimmedCustomerName = formData.customerName.trim();
    const quantityValue = parseInt(formData.quantity, 10);
    const sellingPriceValue = parseFloat(formData.sellingPrice);

    if (trimmedCustomerName === "") {
      errors.customerName = "Customer name is required.";
    }

    if (!formData.productId) {
      errors.productId = "Product is required.";
    }

    if (
      formData.quantity === "" ||
      isNaN(quantityValue) ||
      quantityValue <= 0
    ) {
      errors.quantity = "Quantity must be greater than 0.";
    }

    if (
      formData.sellingPrice === "" ||
      isNaN(sellingPriceValue) ||
      sellingPriceValue <= 0
    ) {
      errors.sellingPrice = "Selling price must be greater than 0.";
    }

    if (!formData.saleDate) {
      errors.saleDate = "Sale date is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------
  // Save (Create / Update)
  // -------------------------------
  const saveSale = async () => {
    if (!validateForm()) return;

    const payload = {
      customerName: formData.customerName.trim(),
      productId: Number(formData.productId),
      quantity: parseInt(formData.quantity, 10),
      sellingPrice: parseFloat(formData.sellingPrice),
      saleDate: formData.saleDate,
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await saleService.update(selectedSaleId, payload);
      } else {
        await saleService.create(payload);
      }

      await loadSales();
      closeModal();
    } catch (error) {
      console.error("Failed to save sale:", error);
      setFormErrors((prev) => ({
        ...prev,
        general: "Something went wrong while saving. Please try again.",
      }));
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------
  // Delete
  // -------------------------------
  const deleteSale = async (sale) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this sale to "${sale.customerName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await saleService.remove(sale.id);
      await loadSales();
    } catch (error) {
      console.error("Failed to delete sale:", error);
      alert("Failed to delete sale. Please try again.");
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="container-fluid py-4">
      <PageHeader
        title="Sales"
        subtitle="Manage your inventory sales"
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
                placeholder="Search sales..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary rounded-pill px-4 d-flex align-items-center justify-content-center gap-2 shadow-sm"
              onClick={openAddModal}
            >
              <FaPlus size={14} />
              <span>Add Sale</span>
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
                    <th>Customer Name</th>
                    <th>Product Name</th>
                    <th>Quantity</th>
                    <th>Selling Price</th>
                    <th>Sale Date</th>
                    <th className="text-end" style={{ width: "150px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSales.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-5">
                        No Sales Found
                      </td>
                    </tr>
                  ) : (
                    filteredSales.map((sale) => (
                      <tr key={sale.id}>
                        <td className="text-muted">{sale.id}</td>
                        <td className="fw-medium">{sale.customerName}</td>
                        <td>{sale.productName}</td>
                        <td>{sale.quantity}</td>
                        <td>{currencyFormatter.format(sale.sellingPrice)}</td>
                        <td>
                          {sale.saleDate
                            ? new Date(sale.saleDate).toLocaleDateString()
                            : ""}
                        </td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px" }}
                              title="Edit"
                              onClick={() => openEditModal(sale)}
                            >
                              <FaEdit size={13} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px" }}
                              title="Delete"
                              onClick={() => deleteSale(sale)}
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

      {/* Add / Edit Modal */}
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
                  <h5 className="modal-title fw-semibold">
                    {isEditMode ? "Edit Sale" : "Add Sale"}
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
                    <label htmlFor="customerName" className="form-label fw-medium">
                      Customer Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="customerName"
                      name="customerName"
                      type="text"
                      className={`form-control rounded-3 ${
                        formErrors.customerName ? "is-invalid" : ""
                      }`}
                      placeholder="Enter customer name"
                      value={formData.customerName}
                      onChange={handleChange}
                      autoFocus
                    />
                    {formErrors.customerName && (
                      <div className="invalid-feedback d-block">
                        {formErrors.customerName}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="productId" className="form-label fw-medium">
                      Product <span className="text-danger">*</span>
                    </label>
                    <select
                      id="productId"
                      name="productId"
                      className={`form-select rounded-3 ${
                        formErrors.productId ? "is-invalid" : ""
                      }`}
                      value={formData.productId}
                      onChange={handleChange}
                    >
                      <option value="">Select a product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.productId && (
                      <div className="invalid-feedback d-block">
                        {formErrors.productId}
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label htmlFor="quantity" className="form-label fw-medium">
                        Quantity <span className="text-danger">*</span>
                      </label>
                      <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        step="1"
                        className={`form-control rounded-3 ${
                          formErrors.quantity ? "is-invalid" : ""
                        }`}
                        placeholder="0"
                        value={formData.quantity}
                        onChange={handleChange}
                      />
                      {formErrors.quantity && (
                        <div className="invalid-feedback d-block">
                          {formErrors.quantity}
                        </div>
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <label htmlFor="sellingPrice" className="form-label fw-medium">
                        Selling Price <span className="text-danger">*</span>
                      </label>
                      <input
                        id="sellingPrice"
                        name="sellingPrice"
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-control rounded-3 ${
                          formErrors.sellingPrice ? "is-invalid" : ""
                        }`}
                        placeholder="0.00"
                        value={formData.sellingPrice}
                        onChange={handleChange}
                      />
                      {formErrors.sellingPrice && (
                        <div className="invalid-feedback d-block">
                          {formErrors.sellingPrice}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="saleDate" className="form-label fw-medium">
                      Sale Date <span className="text-danger">*</span>
                    </label>
                    <input
                      id="saleDate"
                      name="saleDate"
                      type="date"
                      className={`form-control rounded-3 ${
                        formErrors.saleDate ? "is-invalid" : ""
                      }`}
                      value={formData.saleDate}
                      onChange={handleChange}
                    />
                    {formErrors.saleDate && (
                      <div className="invalid-feedback d-block">
                        {formErrors.saleDate}
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
                    onClick={saveSale}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : isEditMode
                      ? "Update"
                      : "Save"}
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

export default Sales;