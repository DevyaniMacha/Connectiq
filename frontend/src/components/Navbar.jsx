import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("connectiq_user");

    let user = null;

    try {
      if (storedUser && storedUser !== "undefined") {
        user = JSON.parse(storedUser);
      }
    } catch (error) {
      user = null;
    }

    if (user && token) {
      setCurrentUser(user);
    } else {
      setCurrentUser(null);
    }
  }, [location]);

  if (
    location.pathname === "/login" ||
    location.pathname === "/register"
  ) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("connectiq_user");
    setCurrentUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">ConnectIQ</div>

      <div className="navbar-links">
        <NavLink to="/" className="nav-link">
          Home
        </NavLink>

        {currentUser ? (
          <>
            <NavLink to="/feed" className="nav-link">
              Feed
            </NavLink>

            <NavLink to="/requests" className="nav-link">
              Requests
            </NavLink>

            <NavLink
              to={`/profile/${currentUser?.name}`}
              className="nav-link"
            >
              Profile
            </NavLink>

            <div className="nav-user">
              <div className="avatar">
                {currentUser?.name?.charAt(0)?.toUpperCase()}
              </div>
              <span>{currentUser?.name}</span>
            </div>

            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className="nav-link login-btn">
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}

export default Navbar;