import React from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../../redux/slices/authSlice";

function LogoutButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // ✅ Check env variable
      const apiUrl = process.env.REACT_APP_API_URL;
      console.log("🌐 API URL:", apiUrl);

      if (!apiUrl) {
        alert("❌ API URL is undefined. Please check your .env file.");
        return;
      }

      const logoutUrl = `${apiUrl}/api/v1/logout`;
      console.log("📤 Logout API Calling:", logoutUrl);

      // ✅ Call logout API
      const response = await axios.get(logoutUrl, {
        withCredentials: true, // important for cookies
      });

      console.log("✅ Logout Response:", response.data);

      // ✅ Clear redux + localStorage
      dispatch(clearUser());
      localStorage.removeItem("user");

      // ✅ Navigate to login page
      navigate("/auth");

      // ✅ Notify user
      alert("✅ Logged out successfully");

    } catch (error) {
      console.error("❌ Logout failed:", error);

      if (error.response) {
        console.error("📦 Server responded with:", error.response.data);
        alert(`❌ ${error.response.data.message || "Logout failed with 4xx/5xx error"}`);
      } else if (error.request) {
        console.error("📡 No response received:", error.request);
        alert("❌ No response from server. Is the backend running?");
      } else {
        console.error("⚠️ Error setting up request:", error.message);
        alert(`❌ Error: ${error.message}`);
      }
    }
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
}

export default LogoutButton;
