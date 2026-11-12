
import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X, Layers } from "lucide-react";
import "../styles/adminCategories.css";

const API = "http://localhost:7000/api/categories";

const emptyForm = {
  name: "",
  description: "",
  isActive: true,
};

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState(emptyForm);

  const getToken = () => localStorage.getItem("token");

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      setFetching(true);

      const response = await fetch(API);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load categories.");
      }

      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (error) {
      alert(error.message || "Unable to connect to the server.");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // Open add form
  const openAddForm = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setShowForm(true);
  };

  // Close form
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  // Open edit form
  const handleEdit = (category) => {
    setEditingId(category._id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      isActive: category.isActive ?? true,
    });

    setShowForm(true);
  };

  // Add or update category
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!getToken()) {
      alert("Please login again. Admin token not found.");
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `${API}/${editingId}`
        : API;

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description.trim(),
          isActive: form.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Category operation failed.");
      }

      alert(data.message || "Category saved successfully.");

      closeForm();
      await fetchCategories();
    } catch (error) {
      alert(error.message || "Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  // Delete category
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    if (!getToken()) {
      alert("Please login again. Admin token not found.");
      return;
    }

    try {
      const response = await fetch(`${API}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete category.");
      }

      alert(data.message || "Category deleted successfully.");

      await fetchCategories();
    } catch (error) {
      alert(error.message || "Delete operation failed.");
    }
  };

  // Search categories
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="admin-categories-page">

      {/* Page Header */}
      <div className="admin-categories-header">
        <div>
          <span className="ac-eyebrow">STORE MANAGEMENT</span>
          <h1>Categories Management</h1>
          <p>Organize and manage your NovaCart product categories.</p>
        </div>

        <button
          type="button"
          className="ac-add-button"
          onClick={openAddForm}
        >
          <Plus size={18} />
          Add Category
        </button>
      </div>

      {/* Category Summary */}
      <div className="ac-summary-card">
        <div className="ac-summary-icon">
          <Layers size={22} />
        </div>

        <div>
          <span>Total Categories</span>
          <h2>{categories.length}</h2>
        </div>
      </div>

      {/* Search */}
      <div className="ac-search-box">
        <Search size={19} />

        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="ac-form-overlay">
          <form
            className="ac-category-form"
            onSubmit={handleSubmit}
          >
            <div className="ac-form-heading">
              <div>
                <span className="ac-eyebrow">CATEGORY DETAILS</span>
                <h2>
                  {editingId ? "Edit Category" : "Add New Category"}
                </h2>
              </div>

              <button
                type="button"
                className="ac-close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={20} />
              </button>
            </div>

            <div className="ac-form-group">
              <label htmlFor="category-name">Category Name</label>

              <input
                id="category-name"
                type="text"
                name="name"
                placeholder="Enter category name"
                value={form.name}
                onChange={handleChange}
                required
                maxLength={60}
              />
            </div>

            <div className="ac-form-group">
              <label htmlFor="category-description">Description</label>

              <textarea
                id="category-description"
                name="description"
                placeholder="Enter category description"
                value={form.description}
                onChange={handleChange}
                rows={4}
              />
            </div>

            {editingId && (
              <div className="ac-form-group">
                <label htmlFor="category-status">Category Status</label>

                <select
                  id="category-status"
                  value={String(form.isActive)}
                  onChange={(e) =>
                    setForm((previousForm) => ({
                      ...previousForm,
                      isActive: e.target.value === "true",
                    }))
                  }
                >
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            )}

            <div className="ac-form-actions">
              <button
                type="button"
                className="ac-cancel-button"
                onClick={closeForm}
                disabled={loading}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="ac-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Category"
                  : "Save Category"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="ac-category-table-card">
        <div className="ac-table-heading">
          <div>
            <h2>All Categories</h2>
            <p>Manage your available store categories.</p>
          </div>

          <span className="ac-count">
            {filteredCategories.length} Categories
          </span>
        </div>

        <div className="ac-table-wrapper">
          <table className="ac-category-table">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Description</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {fetching ? (
                <tr>
                  <td colSpan="4" className="ac-empty-state">
                    Loading categories...
                  </td>
                </tr>
              ) : filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id}>
                    <td className="ac-category-name">
                      {category.name}
                    </td>

                    <td className="ac-description">
                      {category.description || "No description"}
                    </td>

                    <td>
                      <span
                        className={
                          category.isActive
                            ? "ac-status active"
                            : "ac-status inactive"
                        }
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td>
                      <div className="ac-action-buttons">
                        <button
                          type="button"
                          className="ac-action-button"
                          onClick={() => handleEdit(category)}
                          title="Edit Category"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="ac-action-button delete"
                          onClick={() => handleDelete(category._id)}
                          title="Delete Category"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="ac-empty-state">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AdminCategories;
