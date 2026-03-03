import React, { useState, useEffect } from "react";
import request from "../../../utils/request";
import { showAlert, showConfirm } from "../../../utils/alert";
import "./category.css";

const CategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({ code: "", desc: "", remark: "" });

  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []);

  // Filter categories based on search keyword
  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = categories.filter(
        (cat) =>
          cat.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (cat.desc &&
            cat.desc.toLowerCase().includes(searchKeyword.toLowerCase())),
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(categories);
    }
    setCurrentPage(1);
  }, [searchKeyword, categories]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await request("api/category", "GET");
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      showAlert("error", "Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = () => {
    setFormData({ code: "", desc: "", remark: "" });
    setEditingCode(null);
    setShowForm(true);
  };

  const handleEditCategory = (category) => {
    setFormData({
      code: category.code,
      desc: category.desc || "",
      remark: category.remark || "",
    });
    setEditingCode(category.code);
    setShowForm(true);
  };

  const handleDeleteCategory = async (code) => {
    const result = await showConfirm(
      "Are you sure?",
      `Delete category "${code}"? This action cannot be undone.`,
      "Yes, delete it!"
    );

    if (result.isConfirmed) {
      try {
        const response = await request(`api/category/${code}`, "DELETE");
        if (response.success) {
          showAlert("success", "Category deleted successfully");
          fetchCategories();
        } else {
          showAlert("error", response.message || "Error deleting category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        showAlert("error", "Error deleting category");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      showAlert("warning", "Category code is required");
      return;
    }

    try {
      let response;
      if (editingCode) {
        // Update
        response = await request(`api/category/${editingCode}`, "PUT", {
          desc: formData.desc,
          remark: formData.remark,
        });
      } else {
        // Create
        response = await request("api/category", "POST", formData);
      }

      if (response.success) {
        showAlert("success", editingCode ? "Category updated successfully" : "Category created successfully");
        setShowForm(false);
        fetchCategories();
      } else {
        showAlert("error", response.message || "Error saving category");
      }
    } catch (error) {
      console.error("Error saving category:", error);
      showAlert("error", "Error saving category");
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);

  return (
    <div className="category-container">
      <div className="category-header">
        <h1 className="category-title">Category Management</h1>
        <button className="btn-add-category" onClick={handleAddCategory}>
          + Add New Category
        </button>
      </div>

      <div className="category-controls">
        <div className="items-per-page">
          <label>Show</label>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>categories per page</span>
        </div>

        <div className="search-box">
          <label>Search categories:</label>
          <input
            type="text"
            placeholder="Search by code or description..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : (
        <>
          <table className="category-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Description</th>
                <th>Remark</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.length > 0 ? (
                paginatedCategories.map((category) => (
                  <tr key={category.code}>
                    <td>{category.code}</td>
                    <td>{category.desc || "-"}</td>
                    <td>{category.remark || "-"}</td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditCategory(category)}
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteCategory(category.code)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="no-data">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-info">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredCategories.length)} of{" "}
            {filteredCategories.length} categories
          </div>

          <div className="pagination-controls">
            <button
              className="btn-pagination"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <div className="page-numbers">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  className={`page-number ${currentPage === i + 1 ? "active" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="btn-pagination"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCode ? "Edit Category" : "Add New Category"}</h2>
              <button className="btn-close" onClick={() => setShowForm(false)}>
                ×
              </button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Code *</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value })
                  }
                  disabled={!!editingCode}
                  placeholder="Enter category code"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  type="text"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  placeholder="Enter description"
                />
              </div>
              <div className="form-group">
                <label>Remark</label>
                <textarea
                  value={formData.remark}
                  onChange={(e) =>
                    setFormData({ ...formData, remark: e.target.value })
                  }
                  placeholder="Enter remark"
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-submit">
                  {editingCode ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
