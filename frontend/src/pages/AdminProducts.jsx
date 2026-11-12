
import { useEffect, useState } from "react";
import { Plus, Search, Pencil, Trash2, X } from "lucide-react";
import "../styles/adminProducts.css";

const API = "http://localhost:7000/api/products";

function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const emptyForm = {
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    stock: "",
  };

  const [form, setForm] = useState(emptyForm);

  const getToken = () => localStorage.getItem("token");

  const fetchProducts = async () => {
    try {
      const response = await fetch(API);
      const data = await response.json();

      if (data.success) {
        setProducts(data.products);
      }
    } catch {
      alert("Unable to load products. Check backend server.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleEdit = (product) => {
    setEditingId(product._id);

    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      image: product.image || "",
      stock: product.stock,
    });

    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        editingId ? `${API}/${editingId}` : API,
        {
          method: editingId ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Product operation failed.");
        return;
      }

      alert(data.message);
      closeForm();
      await fetchProducts();
    } catch {
      alert("Server connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
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

      if (!response.ok) {
        alert(data.message || "Delete failed.");
        return;
      }

      alert(data.message);
      await fetchProducts();
    } catch {
      alert("Unable to delete product.");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-products-page">
      <div className="admin-products-header">
        <div>
          <h1>Products Management</h1>
          <p>Manage your NovaCart store products.</p>
        </div>

        <button
          className="ap-add-button"
          onClick={() => {
            setEditingId(null);
            setForm(emptyForm);
            setShowForm(true);
          }}
        >
          <Plus size={17} />
          Add Product
        </button>
      </div>

      <div className="ap-search-box">
        <Search size={18} />
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="ap-form-overlay">
          <form onSubmit={handleSubmit} className="ap-product-form">
            <div className="ap-form-heading">
              <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>

              <button
                type="button"
                className="ap-close-button"
                onClick={closeForm}
                aria-label="Close form"
              >
                <X size={18} />
              </button>
            </div>

            <div className="ap-form-grid">
              <div className="ap-form-group full">
                <label>Product Name</label>
                <input
                  name="name"
                  placeholder="Enter product name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ap-form-group full">
                <label>Description</label>
                <textarea
                  name="description"
                  placeholder="Enter product description"
                  value={form.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ap-form-group">
                <label>Price (Rs.)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ap-form-group">
                <label>Category</label>
                <input
                  name="category"
                  placeholder="Enter category"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="ap-form-group full">
                <label>Image URL (Optional)</label>
                <input
                  name="image"
                  placeholder="Paste image URL"
                  value={form.image}
                  onChange={handleChange}
                />
              </div>

              <div className="ap-form-group full">
                <label>Stock Quantity</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="Enter stock quantity"
                  value={form.stock}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="ap-form-actions">
              <button
                type="button"
                className="ap-cancel-button"
                onClick={closeForm}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="ap-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Product"
                  : "Save Product"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="ap-products-table-card">
        <div className="ap-table-wrapper">
          <table className="ap-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product._id}>
                  <td className="ap-product-name">{product.name}</td>
                  <td>{product.category}</td>
                  <td>Rs. {product.price}</td>
                  <td>
                    <span className="ap-stock">{product.stock}</span>
                  </td>
                  <td>
                    <div className="ap-action-buttons">
                      <button
                        className="ap-action-button"
                        onClick={() => handleEdit(product)}
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        className="ap-action-button delete"
                        onClick={() => handleDelete(product._id)}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan="5" className="ap-empty-state">
                    No products found.
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

export default AdminProducts;
