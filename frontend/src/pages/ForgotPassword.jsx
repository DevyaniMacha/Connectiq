import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";    

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/forgot-password",
        { email }
      );

      setIsError(false);
      setMessage(res.data.message);
      setEmail(""); // clear input after success

    } catch (error) {
      setIsError(true);
      setMessage(
        error.response?.data?.message || "Something went wrong"
      );
    }

    setLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Forgot Password</h2>
        <p>Enter your registered email to receive a new password.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </button>
        </form>

        {/* ✅ Success / Error Message */}
        {message && (
          <p
            style={{
              marginTop: "15px",
              color: isError ? "red" : "green",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}

        {/* Back to Login */}
        <span className="auth-link">
          Remember your password? <Link to="/login">Login</Link>
        </span>
      </div>
    </div>
  );
}

export default ForgotPassword;