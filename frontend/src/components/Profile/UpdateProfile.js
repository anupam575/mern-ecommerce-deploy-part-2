import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import "./profile.css";

function UpdateProfile() {
  const { user: loggedInUser, token } = useSelector((state) => ({
    user: state.auth.user,
    token: state.auth.token,
  }));

  const [name, setName] = useState(loggedInUser?.name || "");
  const [email, setEmail] = useState(loggedInUser?.email || "");
  const [avatar, setAvatar] = useState(""); // Base64 string for avatar
  const [preview, setPreview] = useState(loggedInUser?.avatar?.url || ""); // Preview image URL or base64

  const fileInputRef = useRef(null); // File input ref for manual clearing

  // Jab user data aaye ya update ho to input fields update kar do
  useEffect(() => {
    if (loggedInUser) {
      setName(loggedInUser.name || "");
      setEmail(loggedInUser.email || "");
      setPreview(loggedInUser.avatar?.url || "");
      setAvatar("");
      if (fileInputRef.current) {
        fileInputRef.current.value = null; // Reset file input on user change
      }
    }
  }, [loggedInUser]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result); // base64 string
      setPreview(reader.result); // preview bhi wahi
    };
    reader.readAsDataURL(file);
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      alert("Name aur Email dono bharna zaroori hai");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      };

      const payload = { name, email };
      if (avatar) payload.avatar = avatar;

      await axios.put(
        `${process.env.REACT_APP_API_URL}/api/v1/me/update`,
        payload,
        config
      );

      alert("✅ Profile successfully updated!");

      // Clear avatar and preview state
      setAvatar("");
      setPreview(loggedInUser?.avatar?.url || "");

      // Manually clear file input field
      if (fileInputRef.current) {
        fileInputRef.current.value = null;
      }

      // Agar chaho to yahan redux me user data update bhi kar sakte ho
      // dispatch(setUser({ ...loggedInUser, name, email, avatar: updatedAvatarData }));

    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "❌ Profile update failed");
    }
  };

  return (
    <form className="profile-form" onSubmit={updateProfile}>
      <h2>Update Profile</h2>

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef}
      />

      {preview && (
        <img
          src={preview}
          alt="Avatar Preview"
          style={{ width: "150px", marginTop: "10px", borderRadius: "50%" }}
        />
      )}

      <button type="submit" style={{ marginTop: "15px" }}>
        Update Profile
      </button>
    </form>
  );
}

export default UpdateProfile;
