import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/auth.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/feed", { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email,
          password,
        }
      );

      // Save JWT token
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      // Save user ONLY if exists
      if (response.data.user) {
        localStorage.setItem(
          "connectiq_user",
          JSON.stringify(response.data.user)
        );
      }

      alert("Login Successful 🚀");

      navigate("/feed", { replace: true });

    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="auth-container login-page">
      <div className="auth-card">
        <h2>Login to ConnectIQ</h2>
        <p>Welcome back! Please login to your account.</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {/* ✅ Forgot Password Link */}
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <Link to="/forgot-password" className="forgot-link">
              Forgot Password?
            </Link>
          </div>

          <button type="submit">Login</button>
        </form>

        <span className="auth-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </span>
      </div>
    </div>
  );
}

export default Login;