import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

// Optionally: set baseURL globally once in a setup file
// axios.defaults.baseURL = process.env.REACT_APP_API_URL + "/api/v1";

const OrderStatusUpdater = ({ orderId, currentStatus, onStatusChange }) => {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const token = useSelector((state) => state.auth.user?.token);

  const handleUpdate = async () => {
    if (!status || status === currentStatus) return;

    setLoading(true);
    try {
      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/order/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      alert("✅ Order status updated.");
      onStatusChange && onStatusChange(); // Optional callback
    } catch (error) {
      console.error("❌ Failed to update order:", error);
      alert("❌ Failed to update order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        disabled={currentStatus === "Delivered" || loading}
      >
        <option value="Processing">Processing</option>
        <option value="Shipped">Shipped</option>
        <option value="Delivered">Delivered</option>
      </select>
      <button
        onClick={handleUpdate}
        disabled={loading || status === currentStatus || currentStatus === "Delivered"}
      >
        {loading ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default OrderStatusUpdater;
