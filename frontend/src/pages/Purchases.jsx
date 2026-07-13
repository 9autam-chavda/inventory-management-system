import { useState, useEffect, useCallback, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import purchaseService from "../services/purchaseService";
import productService from "../services/productService";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import { getErrorMessage } from "../utils/errorMessage";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const Purchases = () => {
  // -------------------------------
  // State
  // -------------------------------
  const [purchases, setPurchases] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedPurchaseId, setSelectedPurchaseId] = useState(null);
  const [formData, setFormData] = useState({
    supplierName: "",
    productId: "",
    quantity: "",
    purchasePrice: "",
    purchaseDate: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // -------------------------------
  // Load Purchases & Products
  // -------------------------------
  const loadPurchases = useCallback(async () => {
    try {
      setLoading(true);
      const data = await purchaseService.getAll();
      setPurchases(data || []);
    } catch (error) {
      console.error("Failed to load purchases:", error);
      setPurchases([]);
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
    loadPurchases();
    loadProducts();
  }, [loadPurchases, loadProducts]);

  // -------------------------------
  // Search (real-time, client-side, case-insensitive)
  // -------------------------------
  const filteredPurchases = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      return purchases;
    }

    return purchases.filter(
      (purchase) =>
        purchase.supplierName?.toLowerCase().includes(term) ||
        purchase.productName?.toLowerCase().includes(term)
    );
  }, [purchases, searchTerm]);

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
    setSelectedPurchaseId(null);
    setFormData({
      supplierName: "",
      productId: "",
      quantity: "",
      purchasePrice: "",
      purchaseDate: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (purchase) => {
    setIsEditMode(true);
    setSelectedPurchaseId(purchase.id);

    setFormData({
      supplierName: purchase.supplierName || "",
      productId: purchase.productId ?? "",
      quantity: purchase.quantity ?? "",
      purchasePrice: purchase.purchasePrice ?? "",
      purchaseDate: purchase.purchaseDate || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedPurchaseId(null);
    setFormData({
      supplierName: "",
      productId: "",
      quantity: "",
      purchasePrice: "",
      purchaseDate: "",
    });
    setFormErrors({});
    setSaving(false);
  };

  // -------------------------------
  // Validation
  // -------------------------------
  const validateForm = () => {
    const errors = {};
    const trimmedSupplierName = formData.supplierName.trim();
    const quantityValue = parseInt(formData.quantity, 10);
    const purchasePriceValue = parseFloat(formData.purchasePrice);

    if (trimmedSupplierName === "") {
      errors.supplierName = "Supplier name is required.";
    }

    if (!formData.productId) {
      errors.productId = "Product is required.";
    }

    if (
      formData.quantity === "" ||
      isNaN(quantityValue) ||
      quantityValue < 1
    ) {
      errors.quantity = "Quantity must be greater than 0.";
    }

    if (
      formData.purchasePrice === "" ||
      isNaN(purchasePriceValue) ||
      purchasePriceValue <= 0
    ) {
      errors.purchasePrice = "Purchase price must be greater than 0.";
    }

    if (!formData.purchaseDate) {
      errors.purchaseDate = "Purchase date is required.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------
  // Save (Create / Update)
  // -------------------------------
  const savePurchase = async () => {
    if (!validateForm()) return;

    const payload = {
      supplierName: formData.supplierName.trim(),
      productId: Number(formData.productId),
      quantity: parseInt(formData.quantity, 10),
      purchasePrice: parseFloat(formData.purchasePrice),
      purchaseDate: formData.purchaseDate,
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await purchaseService.update(selectedPurchaseId, payload);
      } else {
        await purchaseService.create(payload);
      }

      await loadPurchases();
      closeModal();
    } catch (error) {
      console.error("Failed to save purchase:", error);
      setFormErrors((prev) => ({
        ...prev,
        general: getErrorMessage(error, "Something went wrong while saving. Please try again."),
      }));
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------
  // Delete
  // -------------------------------
  const deletePurchase = async (purchase) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete this purchase from "${purchase.supplierName}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await purchaseService.remove(purchase.id);
      await loadPurchases();
    } catch (error) {
      console.error("Failed to delete purchase:", error);
      alert(getErrorMessage(error, "Failed to delete purchase. Please try again."));
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="container-fluid px-0">
      <PageHeader
        title="Purchases"
        subtitle="Manage your inventory purchases"
      />

      <div className="content-card">
        <div className="content-card-body">
          {/* Toolbar */}
          <div className="table-toolbar">
            <div className="search-box">
              <FaSearch className="input-icon" />
              <input
                type="text"
                className="form-control input-with-icon"
                placeholder="Search purchases..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>

            <button
              type="button"
              className="btn btn-primary btn-app d-flex align-items-center justify-content-center gap-2"
              onClick={openAddModal}
            >
              <FaPlus size={14} />
              <span>Add Purchase</span>
            </button>
          </div>

          {/* Content */}
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="table-shell">
              <table className="table table-hover align-middle mb-0">
                <thead>
                  <tr>
                    <th style={{ width: "80px" }}>ID</th>
                    <th>Supplier Name</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Purchase Price</th>
                    <th>Purchase Date</th>
                    <th className="text-end" style={{ width: "150px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPurchases.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="empty-state">
                        No Purchases Found
                      </td>
                    </tr>
                  ) : (
                    filteredPurchases.map((purchase) => (
                      <tr key={purchase.id}>
                        <td className="text-muted">{purchase.id}</td>
                        <td className="fw-medium">{purchase.supplierName}</td>
                        <td>{purchase.productName}</td>
                        <td>{purchase.quantity}</td>
                        <td>{currencyFormatter.format(purchase.purchasePrice)}</td>
                        <td>{purchase.purchaseDate}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary btn-edit btn-action"
                              title="Edit"
                              onClick={() => openEditModal(purchase)}
                            >
                              <FaEdit size={13} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger btn-action"
                              title="Delete"
                              onClick={() => deletePurchase(purchase)}
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
              <div className="modal-content border-0">
                <div className="modal-header border-0 pb-0">
                  <h5 className="modal-title fw-semibold">
                    {isEditMode ? "Edit Purchase" : "Add Purchase"}
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
                    <div className="alert alert-danger py-2">
                      {formErrors.general}
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="supplierName" className="form-label fw-medium">
                      Supplier Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="supplierName"
                      name="supplierName"
                      type="text"
                      className={`form-control ${
                        formErrors.supplierName ? "is-invalid" : ""
                      }`}
                      placeholder="Enter supplier name"
                      value={formData.supplierName}
                      onChange={handleChange}
                      autoFocus
                    />
                    {formErrors.supplierName && (
                      <div className="invalid-feedback d-block">
                        {formErrors.supplierName}
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
                      className={`form-select ${
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
                        className={`form-control ${
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
                      <label htmlFor="purchasePrice" className="form-label fw-medium">
                        Purchase Price <span className="text-danger">*</span>
                      </label>
                      <input
                        id="purchasePrice"
                        name="purchasePrice"
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-control ${
                          formErrors.purchasePrice ? "is-invalid" : ""
                        }`}
                        placeholder="0.00"
                        value={formData.purchasePrice}
                        onChange={handleChange}
                      />
                      {formErrors.purchasePrice && (
                        <div className="invalid-feedback d-block">
                          {formErrors.purchasePrice}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="purchaseDate" className="form-label fw-medium">
                      Purchase Date <span className="text-danger">*</span>
                    </label>
                    <input
                      id="purchaseDate"
                      name="purchaseDate"
                      type="date"
                      className={`form-control ${
                        formErrors.purchaseDate ? "is-invalid" : ""
                      }`}
                      value={formData.purchaseDate}
                      onChange={handleChange}
                    />
                    {formErrors.purchaseDate && (
                      <div className="invalid-feedback d-block">
                        {formErrors.purchaseDate}
                      </div>
                    )}
                  </div>
                </div>

                <div className="modal-footer border-0 pt-0">
                  <button
                    type="button"
                    className="btn btn-light btn-app"
                    onClick={closeModal}
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-app"
                    onClick={savePurchase}
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

export default Purchases;
