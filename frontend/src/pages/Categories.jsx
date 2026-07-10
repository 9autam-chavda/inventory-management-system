import React, { useState, useEffect, useCallback } from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import categoryService from "../services/categoryService";
import PageHeader from "../components/PageHeader";
import LoadingSpinner from "../components/LoadingSpinner";

const Categories = () => {
  // -------------------------------
  // State
  // -------------------------------
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  // -------------------------------
  // Load Categories
  // -------------------------------
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const data = await categoryService.getAll();
      setCategories(data || []);
      setFilteredCategories(data || []);
    } catch (error) {
      console.error("Failed to load categories:", error);
      setCategories([]);
      setFilteredCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // -------------------------------
  // Search (real-time, client-side, case-insensitive)
  // -------------------------------
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();

    if (term === "") {
      setFilteredCategories(categories);
      return;
    }

    const filtered = categories.filter((category) =>
      category.name?.toLowerCase().includes(term)
    );

    setFilteredCategories(filtered);
  }, [searchTerm, categories]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // -------------------------------
  // Modal Handlers
  // -------------------------------
  const openAddModal = () => {
    setIsEditMode(false);
    setSelectedCategoryId(null);
    setCategoryName("");
    setFormError("");
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setIsEditMode(true);
    setSelectedCategoryId(category.id);
    setCategoryName(category.name);
    setFormError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditMode(false);
    setSelectedCategoryId(null);
    setCategoryName("");
    setFormError("");
    setSaving(false);
  };

  // -------------------------------
  // Save (Create / Update)
  // -------------------------------
  const saveCategory = async () => {
    const trimmedName = categoryName.trim();

    if (trimmedName === "") {
      setFormError("Category name is required.");
      return;
    }

    try {
      setSaving(true);

      if (isEditMode) {
        await categoryService.update(selectedCategoryId, { name: trimmedName });
      } else {
        await categoryService.create({ name: trimmedName });
      }

      await loadCategories();
      closeModal();
    } catch (error) {
      console.error("Failed to save category:", error);
      setFormError("Something went wrong while saving. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // -------------------------------
  // Delete
  // -------------------------------
  const deleteCategory = async (category) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${category.name}"? This action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await categoryService.remove(category.id);
      await loadCategories();
    } catch (error) {
      console.error("Failed to delete category:", error);
      alert("Failed to delete category. Please try again.");
    }
  };

  // -------------------------------
  // Render
  // -------------------------------
  return (
    <div className="container-fluid py-4">
      <PageHeader
        title="Categories"
        subtitle="Manage your inventory categories"
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
                placeholder="Search categories..."
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
              <span>Add Category</span>
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
                    <th>Category Name</th>
                    <th className="text-end" style={{ width: "150px" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-5">
                        No Categories Found
                      </td>
                    </tr>
                  ) : (
                    filteredCategories.map((category) => (
                      <tr key={category.id}>
                        <td className="text-muted">{category.id}</td>
                        <td className="fw-medium">{category.name}</td>
                        <td>
                          <div className="d-flex justify-content-end gap-2">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-primary rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px" }}
                              title="Edit"
                              onClick={() => openEditModal(category)}
                            >
                              <FaEdit size={13} />
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "34px", height: "34px" }}
                              title="Delete"
                              onClick={() => deleteCategory(category)}
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
                    {isEditMode ? "Edit Category" : "Add Category"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                    disabled={saving}
                  ></button>
                </div>

                <div className="modal-body pt-3">
                  <label htmlFor="categoryName" className="form-label fw-medium">
                    Category Name
                  </label>
                  <input
                    id="categoryName"
                    type="text"
                    className={`form-control rounded-3 ${formError ? "is-invalid" : ""}`}
                    placeholder="Enter category name"
                    value={categoryName}
                    onChange={(e) => {
                      setCategoryName(e.target.value);
                      if (formError) setFormError("");
                    }}
                    autoFocus
                  />
                  {formError && (
                    <div className="invalid-feedback d-block">{formError}</div>
                  )}
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
                    onClick={saveCategory}
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

export default Categories;