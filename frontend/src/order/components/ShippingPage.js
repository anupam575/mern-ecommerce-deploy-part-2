import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import './ShippingPage.css';
import { useNavigate } from 'react-router-dom';
import { saveShippingInfo } from '../../redux/slices/shippingSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const ShippingPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);
  const token = useSelector((state) => state.auth.user?.token);

  const [shippingInfo, setShippingInfo] = useState({
    address: '',
    city: '',
    state: '',
    country: '',
    pinCode: '',
    phoneNo: '',
  });

  // Validate phone number: only digits and length 10 (customize as needed)
  const isPhoneValid = (phone) => /^\d{10}$/.test(phone);

  // Check if all fields filled and phone valid
  const isFormValid = () => {
    const { address, city, state, country, pinCode, phoneNo } = shippingInfo;
    return (
      address.trim() &&
      city.trim() &&
      state.trim() &&
      country.trim() &&
      pinCode.trim() &&
      phoneNo.trim() &&
      isPhoneValid(phoneNo)
    );
  };

  const handleChange = (e) => {
    // Optional: prevent non-digit input for phoneNo
    if (e.target.name === 'phoneNo') {
      const val = e.target.value;
      if (val === '' || /^\d*$/.test(val)) {
        setShippingInfo({ ...shippingInfo, [e.target.name]: val });
      }
    } else {
      setShippingInfo({ ...shippingInfo, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Please fill all fields correctly! Phone number must be 10 digits.');
      return;
    }

    dispatch(saveShippingInfo(shippingInfo));

    // Calculate prices again (for summary or later use)
    const itemsPrice = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
    const shippingPrice = itemsPrice > 500 ? 0 : 50;
    const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    // Build orderItems for later payment step
    const orderItems = cartItems.map((item) => ({
      name: item.title,
      quantity: item.quantity,
      image: item.img,
      price: item.price,
      product: item.id,
    }));

    // We do not create order here, it will be created after payment success in PaymentPage
    navigate('/payment');
  };

  return (
    <div className="shipping-container">
      <ToastContainer />

      <div className="shipping-left">
        <h2>Cart Summary</h2>
        {cartItems.length === 0 ? (
          <p>No items in cart.</p>
        ) : (
          <ul>
            {cartItems.map((item) => (
              <li key={item.id}>
                <div className="summary-item">
                  <img src={item.img} alt={item.title} />
                  <div>
                    <p>{item.title}</p>
                    <p>
                      ₹{item.price} × {item.quantity}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        <h3>
          Total: ₹
          {cartItems.reduce((total, item) => total + item.price * item.quantity, 0)}
        </h3>
      </div>

      <div className="shipping-right">
        <h2>Shipping Address</h2>
        <form onSubmit={handleSubmit} className="shipping-form" noValidate>
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={shippingInfo.address}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={shippingInfo.city}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={shippingInfo.state}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={shippingInfo.country}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="pinCode"
            placeholder="Pin Code"
            value={shippingInfo.pinCode}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phoneNo"
            placeholder="Phone Number (10 digits)"
            value={shippingInfo.phoneNo}
            onChange={handleChange}
            maxLength={10}
            required
          />
          <button
            type="submit"
            className="submit-btn"
            disabled={cartItems.length === 0 || !isFormValid()}
          >
            Proceed to Payment
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingPage;
