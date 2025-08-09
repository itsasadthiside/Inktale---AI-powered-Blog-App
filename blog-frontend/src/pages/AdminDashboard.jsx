// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import DeleteConfirmation from '../components/DeleteConfirmation';
import { Button } from '@mui/material';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    fetchBlogs();
    fetchComments();
  }, []);

  const fetchBlogs = () => {
    axios.get('http://localhost:5000/api/blogs')
      .then((res) => setBlogs(res.data))
      .catch((err) => console.error('Error fetching blogs:', err));
  };

  const fetchComments = () => {
    axios.get('http://localhost:5000/api/comments')
      .then((res) => setComments(res.data))
      .catch((err) => console.error('Error fetching comments:', err));
  };

  const confirmDelete = (id) => {
    setSelectedId(id);
    setShowPopup(true);
  };

 const handleDeleteConfirmed = async () => {
  try {
    const token = localStorage.getItem("token"); // Make sure token is stored on login

    await axios.delete(`http://localhost:5000/api/blogs/${selectedId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchBlogs(); // Refresh blog list
    setShowPopup(false); // Close confirmation dialog
  } catch (err) {
    console.error("Error deleting blog:", err);
    alert("Failed to delete blog. Please ensure you're logged in.");
  }
};

  const handleApproveComment = async (id) => {
    try {
      await axios.patch(`http://localhost:5000/api/comments/${id}`, { approved: true });
      fetchComments();
    } catch (err) {
      console.error('Error approving comment:', err);
    }
  };

  return (
    <div className="container" style={{ padding: '30px', color: '#eee' }}>
      <h1>🛠 Admin Dashboard</h1>

      <div style={{
        display: 'flex',
        gap: '30px',
        margin: '30px 0',
        background: '#222',
        padding: '20px',
        borderRadius: '10px'
      }}>
        <div><h3>Total Blogs</h3><p>{blogs.length}</p></div>
        <div><h3>Published</h3><p>{blogs.filter((b) => b.isPublished).length}</p></div>
        <div><h3>Drafts</h3><p>{blogs.filter((b) => !b.isPublished).length}</p></div>
      </div>

      <h2>📝 Blogs</h2>
      {blogs.map((blog) => (
        <div key={blog._id} style={{
          background: '#333',
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {blog.imageUrl && (
            <img
              src={blog.imageUrl?.startsWith('/uploads') ? `http://localhost:5000${blog.imageUrl}` : blog.imageUrl}
              alt="Thumbnail"
              style={{
                width: '100px',
                height: '100px',
                objectFit: 'cover',
                borderRadius: '8px'
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <h3>{blog.title}</h3>
            <p>{blog.isPublished ? '✅ Published' : '📝 Draft'} — <small>{blog.category}</small></p>
          </div>
          <div>
            <Button
              variant="outlined"
              onClick={() => navigate(`/admin/edit/${blog._id}`)}
              style={{ marginRight: '10px', color: 'cyan', borderColor: 'cyan' }}
            >
              ✏️ Edit
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => confirmDelete(blog._id)}
            >
              ❌ Delete
            </Button>
          </div>
        </div>
      ))}

      <DeleteConfirmation
        open={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={handleDeleteConfirmed}
      />

      <h2 style={{ marginTop: '30px' }}>💬 Comments</h2>
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((comment) => (
        <div key={comment._id} style={{
          background: '#444',
          padding: '12px',
          marginBottom: '10px',
          borderRadius: '8px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            {comment.text} — <strong>{comment.approved ? '✅ Approved' : '⏳ Pending'}</strong>
          </div>
          {!comment.approved && (
            <Button
              variant="outlined"
              color="success"
              onClick={() => handleApproveComment(comment._id)}
            >
              Approve
            </Button>
          )}
        </div>
      ))}

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: '30px' }}
        onClick={() => navigate('/admin/create')}
      >
        ➕ Add New Blog
      </Button>
    </div>
  );
}
