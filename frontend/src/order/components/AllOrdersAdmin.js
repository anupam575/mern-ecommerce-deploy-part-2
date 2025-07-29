import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./AllOrdersAdmin.css";

const AllOrdersAdmin = () => {
  const [orders, setOrders] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user: loggedInUser } = useSelector((state) => state.auth);
  const token = loggedInUser?.token;

  useEffect(() => {
    const fetchAllOrders = async () => {
      if (!token) {
        setError("Authorization token missing. Please login.");
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/admin/orders`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        setOrders(data.orders);
        setTotalAmount(data.totalAmount);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, [token]);

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div className="all-orders-container">
      <h2>Admin: All Orders</h2>
      <p className="total-revenue">
        <strong>Total Revenue:</strong> ₹{totalAmount}
      </p>
      <ul className="order-list">
        {orders.map((order) => (
          <li key={order._id} className="order-item">
            <strong>Order ID:</strong> {order._id} <br />
            <strong>Status:</strong> {order.orderStatus} <br />
            <strong>Total Price:</strong> ₹{order.totalPrice}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AllOrdersAdmin;
