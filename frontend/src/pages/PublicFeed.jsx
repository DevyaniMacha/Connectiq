import { useEffect, useState } from "react";
import PostCard from "../components/PostCard";
import "../styles/feed.css";

function PublicFeed() {
  const [posts, setPosts] = useState([]);
  const [postText, setPostText] = useState("");
  const [postImage, setPostImage] = useState(null);

  // ✅ Safe user parsing (prevents JSON error)
  const user = JSON.parse(localStorage.getItem("connectiq_user") || "null");

  useEffect(() => {
    const dummyPosts = [
      {
        id: 1,
        author: "Vidya",
        content: "Hello ConnectIQ 👋",
        image: null,
        likes: 0,
        shares: 0,
        comments: [],
      },
    ];
    setPosts(dummyPosts);
  }, []);

  // 📝 CREATE POST
  const handleCreatePost = () => {
    if (!postText && !postImage) return;

    const newPost = {
      id: Date.now(),
      author: user?.name || "Unknown User",   // ✅ Safe access
      content: postText,
      image: postImage,
      likes: 0,
      shares: 0,
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setPostText("");
    setPostImage(null);
  };

  // 📂 IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPostImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ❤️ LIKE
  const handleLike = (id) => {
    setPosts(posts.map(p =>
      p.id === id ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  // 💬 COMMENT
  const handleComment = (id, text) => {
    setPosts(posts.map(p =>
      p.id === id
        ? { ...p, comments: [...p.comments, text] }
        : p
    ));
  };

  // 🔁 SHARE
  const handleShare = (id) => {
    const originalPost = posts.find(p => p.id === id);

    if (!originalPost) return;

    const sharedPost = {
      ...originalPost,
      id: Date.now(),
      sharedBy: user?.name || "Unknown User",  // ✅ Safe access
      likes: 0,
      comments: [],
      shares: 0,
    };

    setPosts(posts.map(p =>
      p.id === id ? { ...p, shares: p.shares + 1 } : p
    ));

    setPosts(prev => [sharedPost, ...prev]);
  };

  return (
    <div className="feed-container">
      <h2>Public Feed</h2>

      {/* CREATE POST */}
      <div className="create-post">
        <textarea
          placeholder="What's on your mind?"
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <button onClick={handleCreatePost}>Post</button>
      </div>

      {/* POSTS */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike}
          onComment={handleComment}
          onShare={handleShare}
        />
      ))}
    </div>
  );
}

export default PublicFeed;
