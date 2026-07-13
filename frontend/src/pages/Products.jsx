import { useState, useEffect, useCallback, useMemo } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import productService from "../services/productService";
import categoryService from "../services/categoryService";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import { getErrorMessage } from "../utils/errorMessage";

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
});

const Products = () => {
  // -------------------------------
  // State
  // -------------------------------
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
    categoryId: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);

  // -------------------------------
  // Load Products & Categories
  // -------------------------------
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data || []);
    } catch (error) {
      console.error("Failed to load products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadCategories = useCallback(async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  // -------------------------------
  // Search (real-time, client-side, case-insensitive)
  // -------------------------------
  const filteredProducts = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      return products;
    }

    return products.filter(
      (product) =>
        product.name?.toLowerCase().includes(term) ||
        product.categoryName?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

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
    setSelectedProductId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setSelectedProductId(product.id);
    setFormData({
      name: product.name || "",
      description: product.description || "",
      price: product.price ?? "",
      quantity: product.quantity ?? "",
      categoryId: product.categoryId ?? "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedProductId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      quantity: "",
      categoryId: "",
    });
    setFormErrors({});
    setSaving(false);
  };

  // -------------------------------
  // Validation
  // -------------------------------
  const validateForm = () => {
    const errors = {};
    const trimmedName = formData.name.trim();
    const priceValue = parseFloat(formData.price);
    const quantityValue = parseInt(formData.quantity, 10);

    if (trimmedName === "") {
      errors.name = "Product name is required.";
    }

    if (!formData.categoryId) {
      errors.categoryId = "Category is required.";
    }

    if (formData.price === "" || isNaN(priceValue) || priceValue <= 0) {
      errors.price = "Price must be greater than 0.";
    }

    if (
      formData.quantity === "" ||
      isNaN(quantityValue) ||
      quantityValue < 0
    ) {
      errors.quantity = "Quantity must be 0 or greater.";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // -------------------------------
  // Save (Create / Update)
  // -------------------------------
  const saveProduct = async () => {
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      categoryId: Number(formData.categoryId),
    };

    try {
      setSaving(true);

      if (isEditMode) {
        await productService.update(selectedProductId, payload);
      } else {
        await productService.create(payload);
      }

      await loadProducts();
      closeModal();
    } catch (error) {
      console.error("Failed to save product:", error);
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
  const deleteProduct = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await productService.remove(product.id);
      await loadProducts();
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert(getErrorMessage(error, "Failed to delete product. Please try again."));
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="container-fluid px-0">
      <PageHeader
        title="Products"
        subtitle="Manage your inventory products"
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
                placeholder="Search products..."
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
              <span>Add Product</span>
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
                    <th>Product Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th className="text-end" style={{ width: "150px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        No Products Found
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="text-muted">{product.id}</td>
                        <td className="fw-medium">{product.name}</td>
                        <td>{product.categoryName}</td>
                        <td>{currencyFormatter.format(product.price)}</td>
                        <td>{product.quantity}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary btn-edit btn-action"
                              title="Edit"
                              onClick={() => openEditModal(product)}
                            >
                              <FaEdit size={13} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger btn-action"
                              title="Delete"
                              onClick={() => deleteProduct(product)}
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
                    {isEditMode ? "Edit Product" : "Add Product"}
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
                    <label htmlFor="name" className="form-label fw-medium">
                      Product Name <span className="text-danger">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      className={`form-control ${
                        formErrors.name ? "is-invalid" : ""
                      }`}
                      placeholder="Enter product name"
                      value={formData.name}
                      onChange={handleChange}
                      autoFocus
                    />
                    {formErrors.name && (
                      <div className="invalid-feedback d-block">
                        {formErrors.name}
                      </div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="description"
                      className="form-label fw-medium"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      className="form-control"
                      placeholder="Enter product description"
                      rows="2"
                      value={formData.description}
                      onChange={handleChange}
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label
                      htmlFor="categoryId"
                      className="form-label fw-medium"
                    >
                      Category <span className="text-danger">*</span>
                    </label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      className={`form-select ${
                        formErrors.categoryId ? "is-invalid" : ""
                      }`}
                      value={formData.categoryId}
                      onChange={handleChange}
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.categoryId && (
                      <div className="invalid-feedback d-block">
                        {formErrors.categoryId}
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-6 mb-3">
                      <label htmlFor="price" className="form-label fw-medium">
                        Price <span className="text-danger">*</span>
                      </label>
                      <input
                        id="price"
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        className={`form-control ${
                          formErrors.price ? "is-invalid" : ""
                        }`}
                        placeholder="0.00"
                        value={formData.price}
                        onChange={handleChange}
                      />
                      {formErrors.price && (
                        <div className="invalid-feedback d-block">
                          {formErrors.price}
                        </div>
                      )}
                    </div>

                    <div className="col-6 mb-3">
                      <label
                        htmlFor="quantity"
                        className="form-label fw-medium"
                      >
                        Quantity <span className="text-danger">*</span>
                      </label>
                      <input
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="0"
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
                    onClick={saveProduct}
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

export default Products;
