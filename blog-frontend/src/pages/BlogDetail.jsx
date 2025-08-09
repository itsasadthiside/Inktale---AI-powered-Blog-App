import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Add these in your public/index.html <head>:
// <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
// <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;700&display=swap" rel="stylesheet">

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => setBlog(res.data))
      .catch((err) =>
        console.error("Failed to fetch blog:", err.response?.data || err.message)
      );
  }, [id]);

  if (!blog)
    return (
      <p style={{ padding: "20px", textAlign: "center" }}>Loading blog...</p>
    );

  return (
    <div style={styles.page}>
      {/* Title */}
      <h1 style={styles.title}>{blog.title}</h1>

      {/* Subtitle */}
      {blog.subtitle && <p style={styles.subtitle}>{blog.subtitle}</p>}

      {/* Author & Meta */}
      <p style={styles.meta}>
        By <strong>{blog.author || "Anonymous"}</strong> ·{" "}
        {new Date(blog.createdAt).toLocaleDateString()}
      </p>

      {/* Blog Image */}
      {blog.imageUrl && (
        <img
          src={`http://localhost:5000${blog.imageUrl}`}
          alt="Blog"
          style={styles.image}
        />
      )}

      {/* Blog Content */}
      <div style={styles.content}>{blog.description}</div>

      {/* Comments */}
      <div style={styles.commentsSection}>
        <h3 style={styles.commentTitle}>Comments</h3>
        {blog.comments?.length > 0 ? (
          blog.comments.map((c, i) => (
            <p key={i} style={styles.comment}>
              <strong>{c.name}</strong>: {c.text}
            </p>
          ))
        ) : (
          <p style={styles.noComment}>No comments yet.</p>
        )}
      </div>

      {/* Comment Form */}
      <form style={styles.form}>
        <input type="text" placeholder="Your name" style={styles.input} />
        <textarea placeholder="Write a comment..." style={styles.textarea} />
        <button type="submit" style={styles.button}>
          Submit
        </button>
      </form>
    </div>
  );
}

const styles = {
  page: {
    fontFamily: "'Roboto', sans-serif",
    maxWidth: "750px",
    margin: "50px auto",
    padding: "0 20px",
    color: "#1a1a1a",
    lineHeight: "1.7",
  },
  title: {
    fontSize: "2.8rem",
    fontWeight: "700",
    marginBottom: "0.5rem",
  },
  subtitle: {
    fontSize: "1.3rem",
    fontWeight: "500",
    color: "#555",
    marginBottom: "0.5rem",
  },
  meta: {
    fontSize: "0.95rem",
    color: "#888",
    marginBottom: "2rem",
  },
  image: {
    width: "100%",
    maxHeight: "350px", // Medium height
    objectFit: "cover",
    borderRadius: "8px",
    marginBottom: "2rem",
  },
  content: {
    fontFamily: "'LubalinGraph', serif",
    fontSize: "1.45rem",
    whiteSpace: "pre-line",
    marginBottom: "3rem",
  },
  commentsSection: {
    marginTop: "3rem",
  },
  commentTitle: {
    fontSize: "1.2rem",
    fontWeight: "600",
    marginBottom: "1rem",
  },
  comment: {
    marginBottom: "0.8rem",
  },
  noComment: {
    color: "#666",
  },
  form: {
    marginTop: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "10px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  textarea: {
    padding: "10px",
    fontSize: "1rem",
    height: "100px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    backgroundColor: "#000",
    color: "#fff",
    padding: "10px 20px",
    fontSize: "1rem",
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
  },
};
