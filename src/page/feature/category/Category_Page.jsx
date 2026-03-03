import React, { useState, useEffect } from "react";
import request from "../../../utils/request";
import "./category.css";
const Category_Page = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({ code: "", desc: "", remark: "" });
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  // Fetch all categories
  useEffect(() => {
    fetchCategories();
  }, []); // Refetch when categories length changes


  // Filter categories based on search keyword
  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = categories.filter(
        (cat) =>
          cat.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (cat.desc &&
            cat.desc.toLowerCase().includes(searchKeyword.toLowerCase()) || 
            (cat.remark &&
              cat.remark.toLowerCase().includes(searchKeyword.toLowerCase()))),
      );
      setFilteredCategories(filtered);
     
    } else {
      setFilteredCategories(categories);
    }
    setCurrentPage(1);
    
  }, [searchKeyword , categories]);

  
  //handle add category
  const handleAddCategory = () => {
    setFormData({ code: "", desc: "", remark: "" });
    setEditingCode(null);
    setShowForm(true);
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await request("api/category", "GET");
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      alert("Error fetching categories");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
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
    setCategories(filteredCategories);
  }

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
    if (window.confirm(`Are you sure you want to delete category ${code}?`)) {
      try {
        const response = await request(`api/category/${code}`, "DELETE");
        if (response.success) {
          alert("Category deleted successfully");
          fetchCategories();
        } else {
          alert(response.message || "Error deleting category");
        }
      } catch (error) {
        console.error("Error deleting category:", error);
        alert("Error deleting category");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      alert("Category code is required");
      return;
    }

    //  try {
      let response;
      if (editingCode) {
        // Update
        response = await request(`api/category`, "PUT", {
          code: formData.code,
          desc: formData.desc,
          remark: formData.remark,
        });
      } else {
        // Create
        response = await request("api/category", "POST", formData);
       }

      if (response.success) {
        alert(
          editingCode
            ? "Category updated successfully"
            : "Category created successfully",
        );
        setShowForm(false);
        fetchCategories();
      }
    //   } else {
    //     alert(response.message || "Error saving category");
    //   }
    // } catch (error) {
    //   console.error("Error saving category:", error);
    //   alert("Error saving category");
    // }
  };
 
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedCategories = filteredCategories.slice(startIndex, endIndex);
  return (
    <div className="category-container">
      {/* header  */}
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
           {/* <button
            type="button"
            className="btn-cancel"
            onClick={() => handleSearch()}
          >
            Search
          </button> */}
        </div>
      </div>
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
          {loading ? (
            <tr>
              <td colSpan="4">Loading...</td>
            </tr>
          ) : (
            paginatedCategories.map((item) => (
              <tr key={item.code}>
                <td>{item.code}</td>
                <td>{item.desc}</td>
                <td>{item.remark}</td>
                <td className="actions">
                  <button
                    className="btn-edit"
                    onClick={() => handleEditCategory(item)}
                  >
                    ✎ Edit
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeleteCategory(item.code)}
                  >
                    🗑 Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

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

export default Category_Page;
