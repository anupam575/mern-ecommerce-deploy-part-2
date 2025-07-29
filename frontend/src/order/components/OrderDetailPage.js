import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './OrderDetailPage.css';

const OrderDetailPage = () => {
  const { id } = useParams();
  const token = useSelector((state) => state.auth.user?.token);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/order/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrder(res.data.order);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch order');
      } finally {
        setLoading(false);
      }
    };

    if (token && id) fetchOrder();
  }, [id, token]);

  if (loading) return <p>Loading order...</p>;
  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;
  if (!order) return <p>No order data found.</p>;

  return (
    <div className="order-detail-container">
      <h2>Order Details</h2>

      <section className="section">
        <h3>Shipping Info</h3>
        <p>
          <strong>Address:</strong>{' '}
          {order.shippingInfo?.address}, {order.shippingInfo?.city}, {order.shippingInfo?.state},{' '}
          {order.shippingInfo?.country} - {order.shippingInfo?.pinCode}
        </p>
        <p><strong>Phone:</strong> {order.shippingInfo?.phoneNo}</p>
      </section>

      <section className="section">
        <h3>User Info</h3>
        <p><strong>Name:</strong> {order.user?.name}</p>
        <p><strong>Email:</strong> {order.user?.email}</p>
      </section>

      <section className="section">
        <h3>Order Items</h3>
        <ul>
          {order.orderItems?.map((item, index) => (
            <li key={index}>
              {item.name} - ₹{item.price} × {item.quantity}
            </li>
          ))}
        </ul>
      </section>

      <section className="section">
        <h3>Payment Info</h3>
        <p><strong>Status:</strong> {order.paymentInfo?.status || "N/A"}</p>
        <p><strong>Paid At:</strong> {order.paidAt ? new Date(order.paidAt).toLocaleString() : "N/A"}</p>
      </section>

      <section className="section">
        <h3>Price Summary</h3>
        <p><strong>Items:</strong> ₹{order.itemsPrice}</p>
        <p><strong>Tax:</strong> ₹{order.taxPrice}</p>
        <p><strong>Shipping:</strong> ₹{order.shippingPrice}</p>
        <p><strong>Total:</strong> ₹{order.totalPrice}</p>
      </section>

      <section className="section">
        <h3>Order Status</h3>
        <p><strong>Status:</strong> {order.orderStatus}</p>
        {order.orderStatus === "Delivered" && order.deliveredAt && (
          <p><strong>Delivered At:</strong> {new Date(order.deliveredAt).toLocaleString()}</p>
        )}
      </section>
    </div>
  );
};

export default OrderDetailPage;
