import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [friends, setFriends] = useState([]);

  useEffect(() => {
    // ✅ Check token first
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // ✅ Safe parsing
    const storedUserString = localStorage.getItem("connectiq_user");
    const storedUser = storedUserString
      ? JSON.parse(storedUserString)
      : null;

    if (!storedUser) {
      navigate("/login");
      return;
    }

    // Ensure friends array exists
    storedUser.friends = storedUser.friends || [];

    setUser(storedUser);
    setFriends(storedUser.friends);
  }, [navigate]);

  const handleRemoveFriend = (friendName) => {
    if (!user) return;

    const updatedFriends = friends.filter(
      (f) => f !== friendName
    );

    const updatedUser = {
      ...user,
      friends: updatedFriends,
    };

    setFriends(updatedFriends);
    setUser(updatedUser);

    localStorage.setItem(
      "connectiq_user",
      JSON.stringify(updatedUser)
    );
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <h2>{user?.name}</h2>
        <p>{user?.email}</p>

        <p>
          <strong>{friends.length}</strong> Friends
        </p>

        <button className="primary-btn">
          Edit Profile
        </button>
      </div>

      {/* Friends Section */}
      <div className="friends-section">
        <h3>Friends</h3>

        {friends.length === 0 ? (
          <p>No friends yet.</p>
        ) : (
          friends.map((friend, index) => (
            <div className="friend-item" key={index}>
              <span>{friend}</span>

              <button
                className="danger-btn"
                onClick={() =>
                  handleRemoveFriend(friend)
                }
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Profile;
