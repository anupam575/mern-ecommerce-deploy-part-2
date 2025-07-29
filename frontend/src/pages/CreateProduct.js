import React, { useState } from "react";
import axios from "axios";
import './style/CreateProduct.css';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CreateProduct = () => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    Stock: "",
  });

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);

  const navigate = useNavigate();

  // ✅ Get token from Redux or fallback to localStorage
  const reduxUser = useSelector((state) => state.auth.user);
  const token = reduxUser?.token || JSON.parse(localStorage.getItem("user"))?.token;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagesPreview([]);

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((prev) => [...prev, reader.result]);
          setImagesPreview((prev) => [...prev, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        images,
      };

      if (!token) {
        toast.error("❌ No token found. Please log in again.");
        return;
      }

      console.log("✅ Token used for request:", token);

      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/v1/admin/product/new`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true, // Optional
        }
      );

      toast.success("✅ Product created successfully!");
      console.log(response.data.product);

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      console.error("❌", error.response?.data?.message || error.message);
      toast.error(`❌ ${error.response?.data?.message || "Failed to create product"}`);
    }
  };

  return (
    <div className="create-product-modal">
      <ToastContainer />
      <h1>Create New Product</h1>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Product Description"
          required
        />
        <input
          type="number"
          name="price"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          type="text"
          name="category"
          value={form.category}
          onChange={handleChange}
          placeholder="Category"
          required
        />
        <input
          type="number"
          name="Stock"
          value={form.Stock}
          onChange={handleChange}
          placeholder="Stock"
          required
        />
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleImageChange}
        />

        <div className="preview-images">
          {imagesPreview.map((img, i) => (
            <img key={i} src={img} alt="preview" />
          ))}
        </div>

        <button type="submit">Create Product</button>
      </form>
    </div>
  );
};

export default CreateProduct;
