import { useState } from "react";
import "../styles/postcard.css";

function PostCard({ post, onLike, onComment, onShare }) {
  const [commentText, setCommentText] = useState("");

  const handleComment = () => {
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <div className="post-card">
      <h4>{post.author}</h4>

      {post.sharedBy && (
        <p className="shared-text">🔁 Shared by {post.sharedBy}</p>
      )}

      <p>{post.content}</p>

      {post.image && (
        <img src={post.image} alt="post" className="post-image" />
      )}

      <div className="post-actions">
        <button onClick={() => onLike(post.id)}>
          ❤️ {post.likes}
        </button>

        <button onClick={() => onShare(post.id)}>
          🔁 Share {post.shares}
        </button>
      </div>

      <div className="comment-section">
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button onClick={handleComment}>💬</button>
      </div>

      {post.comments.map((c, i) => (
        <p key={i}>• {c}</p>
      ))}
    </div>
  );
}

export default PostCard;
