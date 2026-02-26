    import { useNavigate } from "react-router-dom";
    import "../styles/home.css";

    function Home() {
      const navigate = useNavigate();

      // ✅ Safe parsing
      const storedUser = localStorage.getItem("connectiq_user");
      const user = storedUser ? JSON.parse(storedUser) : null;

      // ✅ Use token instead of isLoggedIn
      const token = localStorage.getItem("token");
      const isLoggedIn = !!token;

      return (
        <div className="home-container">
          <div className="hero-section">
            <h1>
              Welcome to <span>ConnectIQ</span>
            </h1>
            <p>
              Connect. Share. Engage. A smarter way to connect with
              people and ideas.
            </p>

            <div className="home-buttons">
              {isLoggedIn && user ? (
                <>
                  <button
                    className="primary-btn"
                    onClick={() => navigate("/feed")}
                  >
                    Go to Feed
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() =>
                      navigate(`/profile/${user?.name}`)
                    }
                  >
                    View Profile
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="primary-btn"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>

                  <button
                    className="secondary-btn"
                    onClick={() => navigate("/register")}
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="features-section">
            <div className="feature-card">
              🌍 <h3>Public Feed</h3>
              <p>Share your thoughts and view posts.</p>
            </div>

            <div className="feature-card">
              ❤️ <h3>Like & Comment</h3>
              <p>Engage with posts in real time.</p>
            </div>

            <div className="feature-card">
              🔒 <h3>Secure Login</h3>
              <p>Your data stays protected.</p>
            </div>
          </div>

          <footer className="home-footer">
            © 2026 ConnectIQ · Internship Project
          </footer>
        </div>
      );
    }

    export default Home;
