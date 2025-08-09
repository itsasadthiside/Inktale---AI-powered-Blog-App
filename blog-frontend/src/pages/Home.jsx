// Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Home() {
    const navigate = useNavigate();
    const [blogs, setBlogs] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Technology', 'Startup', 'Lifestyle', 'Finance'];

    useEffect(() => {
        axios.get('http://localhost:5000/api/blogs')
            .then((res) => setBlogs(res.data))
            .catch((err) => console.error('Error fetching blogs:', err));
    }, []);

    const filteredBlogs = blogs.filter(blog => {
        const matchTitle = blog.title.toLowerCase().includes(search.toLowerCase());
        const matchCategory = selectedCategory === 'All' || blog.category === selectedCategory;
        return matchTitle && matchCategory && blog.isPublished;
    });

    return (
        <div className="container">
            <header>
                <h1>Inktale</h1>
                <button className="login-btn" onClick={() => navigate('/login')}>
                    Login
                </button>
            </header>

            <section className="welcome">
                <h2>Welcome to the AI-Powered Blog!</h2>
                <input
                    className="search-input"
                    placeholder="Search blog title or category..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </section>

            <div className="filters">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        style={{
                            backgroundColor: selectedCategory === cat ? '#444' : '#222',
                            color: '#fff',
                            padding: '5px 10px',
                            border: 'none',
                            borderRadius: '5px',
                            marginRight: '10px'
                        }}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="blog-list">
                {filteredBlogs.length === 0 ? (
                    <p>No blogs found.</p>
                ) : (
                    filteredBlogs.map((blog) => (
                        <div
                            className="blog-card"
                            key={blog._id}
                            onClick={() => navigate(`/blogs/${blog._id}`)}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                src={`http://localhost:5000${blog.imageUrl}` || 'https://via.placeholder.com/300x150'}
                                alt="Blog Thumbnail"
                                style={{ width: '100%', height: '150px', borderRadius: '10px' }}
                            />
                            <div className="blog-content">
                                <h3>{blog.title}</h3>
                                <p>{blog.subtitle}</p>
                                <span className="category">{blog.category}</span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <section className="newsletter">
                <h3>Subscribe to Our Newsletter</h3>
                <input placeholder="Enter your email" />
                <button>Subscribe</button>
            </section>

            <footer>
                <p>&copy; 2025 Inktale. All rights reserved.</p>
            </footer>
        </div>
    );
}
