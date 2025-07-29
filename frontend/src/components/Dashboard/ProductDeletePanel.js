import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./ProductDeletePanel.css"; // ⬅️ Optional styling

const ProductDeletePanel = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Get token from Redux store
  const token = useSelector((state) => state.auth.user?.token);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/products`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Set token
          },
        }
      );
      setProducts(res.data.products);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products", err);
      setError("❌ Failed to load products.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [token]); // ⬅️ Depend on token

  const deleteHandler = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/product/${id}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Set token
          },
        }
      );
      alert("✅ Product deleted");
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="delete-panel">
      <h2>🗑️ Delete Products</h2>

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price (₹)</th>
              <th>Stock</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.Stock}</td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => deleteHandler(p._id)}
                  >
                    ❌ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductDeletePanel;

