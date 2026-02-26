  import { useEffect, useState } from "react";
  import "../styles/friends.css";

  function FriendRequests() {
    const [user, setUser] = useState(null);

    useEffect(() => {
      // ✅ Safe parsing
      const storedUserString = localStorage.getItem("connectiq_user");
      const storedUser = storedUserString
        ? JSON.parse(storedUserString)
        : null;

      if (!storedUser) {
        setUser(null);
        return;
      }

      // ✅ Ensure default arrays exist
      storedUser.requests = storedUser.requests || [];
      storedUser.friends = storedUser.friends || [];

      // Optional dummy data (only if empty)
      if (storedUser.requests.length === 0) {
        storedUser.requests = ["Vidya", "Sneha"];
        localStorage.setItem(
          "connectiq_user",
          JSON.stringify(storedUser)
        );
      }

      setUser(storedUser);
    }, []);

    const acceptRequest = (name) => {
      if (!user) return;

      const updatedUser = {
        ...user,
        friends: [...user.friends, name],
        requests: user.requests.filter((r) => r !== name),
      };

      localStorage.setItem(
        "connectiq_user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);
    };

    const rejectRequest = (name) => {
      if (!user) return;

      const updatedUser = {
        ...user,
        requests: user.requests.filter((r) => r !== name),
      };

      localStorage.setItem(
        "connectiq_user",
        JSON.stringify(updatedUser)
      );

      setUser(updatedUser);
    };

    if (!user) {
      return (
        <div className="friends-container">
          <h2>Friend Requests</h2>
          <p>Please login to see requests.</p>
        </div>
      );
    }

    return (
      <div className="friends-container">
        <h2>Friend Requests</h2>

        {user.requests.length === 0 && (
          <p>No pending requests</p>
        )}

        {user.requests.map((name, index) => (
          <div key={index} className="request-card">
            <span>{name}</span>

            <div>
              <button
                className="primary-btn"
                onClick={() => acceptRequest(name)}
              >
                ✅ Accept
              </button>

              <button
                className="danger-btn"
                onClick={() => rejectRequest(name)}
              >
                ❌ Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  export default FriendRequests;
