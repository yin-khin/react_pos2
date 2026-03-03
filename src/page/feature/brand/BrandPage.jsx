import React, { useState, useEffect,useContext } from "react";
import request from "../../../utils/request";
import { showAlert, showConfirm } from "../../../utils/alert";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "../category/category.css";
import { AppContext } from "../../../context/AppContext";

const BrandPage = () => {
  // const { baseURL } = useContext(AppContext);
  const API_BASE_URL = "http://localhost:3000";
  const MAX_PHOTO_SIZE_MB = 2;
  const MAX_PHOTO_SIZE_BYTES = MAX_PHOTO_SIZE_MB * 1024 * 1024;
  const [brands, setBrands] = useState([]);
  const [filteredBrands, setFilteredBrands] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCode, setEditingCode] = useState(null);
  const [formData, setFormData] = useState({ code: "", desc: "", remark: "", category_id: "", photo: "" });
  const [selectedPhotoFile, setSelectedPhotoFile] = useState(null);
  const [categories, setCategories] = useState([]);

  const getPhotoUrl = (photo) => {
    if (!photo) return "";
    if (photo.startsWith("http://") || photo.startsWith("https://") || photo.startsWith("data:") || photo.startsWith("blob:")) {
      return photo;
    }
    return `${API_BASE_URL}${photo.startsWith("/") ? "" : "/"}${photo}`;
  };

  // Fetch all brands and categories
  useEffect(() => {
    fetchBrands();
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await request("api/category", "GET");
      if (response.success) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Filter brands based on search keyword
  useEffect(() => {
    if (searchKeyword.trim()) {
      const filtered = brands.filter(
        (brand) =>
          brand.code.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          (brand.desc &&
            brand.desc.toLowerCase().includes(searchKeyword.toLowerCase())),
      );
      setFilteredBrands(filtered);
    } else {
      setFilteredBrands(brands);
    }
    setCurrentPage(1);
  }, [searchKeyword, brands]);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await request("api/brand", "GET");
      if (response.success) {
        setBrands(response.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
      showAlert("error", "Error fetching brands");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBrand = () => {
    setFormData({ code: "", desc: "", remark: "", category_id: "", photo: "" });
    setSelectedPhotoFile(null);
    setEditingCode(null);
    setShowForm(true);
  };

  const handleEditBrand = (brand) => {
    setFormData({
      code: brand.code,
      desc: brand.desc || "",
      remark: brand.remark || "",
      category_id: brand.category_id || "",
      photo: brand.photo || "",
    });
    setSelectedPhotoFile(null);
    setEditingCode(brand.code);
    setShowForm(true);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      showAlert("warning", `Image too large. Please choose a file smaller than ${MAX_PHOTO_SIZE_MB}MB.`);
      event.target.value = "";
      return;
    }

    setSelectedPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result || "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteBrand = async (code) => {
    const result = await showConfirm(
      "Are you sure?",
      `Delete brand "${code}"? This action cannot be undone.`,
      "Yes, delete it!"
    );
    if (result.isConfirmed) {
      try {
        const response = await request(`api/brand/${code}`, "DELETE");
        if (response.success) {
          showAlert("success", "Brand deleted successfully");
          fetchBrands();
        } else {
          showAlert("error", response.message || "Error deleting brand");
        }
      } catch (error) {
        console.error("Error deleting brand:", error);
        showAlert("error", "Error deleting brand");
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!formData.code.trim()) {
      showAlert("warning", "Brand code is required");
      return;
    }

    try {
      const payload = new FormData();
      payload.append("desc", formData.desc || "");
      payload.append("remark", formData.remark || "");
      payload.append("category_id", formData.category_id || "");

      if (!editingCode) {
        payload.append("code", formData.code.trim());
      }

      if (selectedPhotoFile) {
        payload.append("photo", selectedPhotoFile);
      }

      const response = editingCode
        ? await request(`api/brand/${editingCode}`, "PUT", payload)
        : await request("api/brand", "POST", payload);

      if (response?.success) {
        showAlert("success", editingCode ? "Brand updated successfully" : "Brand created successfully");
        setShowForm(false);
        setSelectedPhotoFile(null);
        fetchBrands();
      } else {
        showAlert("error", response?.message || "Error saving brand");
      }
    } catch (error) {
      console.error("Error saving brand:", error);
      if (error?.response?.status === 413) {
        showAlert("error", "Photo is too large for upload. Please use a smaller image.");
        return;
      }
      showAlert("error", error?.response?.data?.message || "Error saving brand");
    }
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredBrands.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedBrands = filteredBrands.slice(startIndex, endIndex);

  return (
    <div className="category-container">
      <div className="category-header">
        <h1 className="category-title">Brand Management</h1>
        <button className="btn-add-category" onClick={handleAddBrand}>
          + Add New Brand
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
          <span>brands per page</span>
        </div>

        <div className="search-box">
          <label>Search brands:</label>
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
                <th>Category</th>
                <th>Remark</th>
                <th>Photo</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBrands.length > 0 ? (
                paginatedBrands.map((brand) => (
                  <tr key={brand.code}>
                    <td>{brand.code}</td>
                    <td>{brand.desc || "-"}</td>
                    <td>
                      {brand.category_id
                        ? (() => {
                            const cat = categories.find((c) => c.code === brand.category_id);
                            return cat ? `${cat.code}${cat.desc ? ` - ${cat.desc}` : ""}` : brand.category_id;
                          })()
                        : "-"}
                    </td>
                    <td>{brand.remark || "-"}</td>
                    <td>
                      {brand.photo ? (
                        <img src={getPhotoUrl(brand.photo)}  className="brand-photo" />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEditBrand(brand)}
                      >
                        ✎ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDeleteBrand(brand.code)}
                      >
                        🗑 Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">
                    No brands found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="pagination-info">
            Showing {startIndex + 1} to{" "}
            {Math.min(endIndex, filteredBrands.length)} of{" "}
            {filteredBrands.length} brands
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
              <h2>{editingCode ? "Edit Brand" : "Add New Brand"}</h2>
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
                  placeholder="Enter brand code"
                  required
                />
              </div>

              {/* select category (optional) */}
              <div className="form-group">
                <Box>
                  <FormControl fullWidth size="small">
                    <InputLabel id="category-select-label">Category</InputLabel>
                    <Select
                      labelId="category-select-label"
                      id="category-select"
                      value={formData.category_id}
                      label="Category"
                      onChange={(e) =>
                        setFormData({ ...formData, category_id: e.target.value })
                      }
                    >
                      <MenuItem value=""><em>-- Select Category --</em></MenuItem>
                      {categories.map((cat) => (
                        <MenuItem key={cat.code} value={cat.code}>
                          {cat.code}{cat.desc ? ` - ${cat.desc}` : ""}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
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
                <label>Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                />
                {formData.photo ? (
                  <img
                    src={getPhotoUrl(formData.photo)}
                    alt="Brand preview"
                    className="brand-photo-preview"
                  />
                ) : null}
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

export default BrandPage;
