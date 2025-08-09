import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditBlog() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('Technology');
    const [publishNow, setPublishNow] = useState(false);
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
                const blog = res.data;

                setTitle(blog.title);
                setSubtitle(blog.subtitle);
                setDesc(blog.description);
                setCategory(blog.category);
                setPublishNow(blog.isPublished);
                setPreview(blog.imageUrl?.startsWith('http') ? blog.imageUrl : blog.imageUrl?.split('/').pop() || '');
            } catch (err) {
                console.error('Fetch Blog Error:', err);
                alert('Failed to fetch blog!');
            }
        };

        fetchBlog();
    }, [id]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setImage(file);
        if (file) setPreview(URL.createObjectURL(file));
    };

    const handleUpdateBlog = async () => {
        if (!title || !subtitle || !desc || !category) {
            alert('Please fill all required fields');
            return;
        }

        setUpdating(true);
        const token = localStorage.getItem('token');

        const formData = new FormData();
        formData.append('title', title);
        formData.append('subtitle', subtitle);
        formData.append('description', desc);
        formData.append('category', category);
        formData.append('isPublished', publishNow);
        if (image) formData.append('image', image);

        try {
            await axios.put(`http://localhost:5000/api/blogs/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            alert('✅ Blog updated successfully!');
            navigate('/admin');
        } catch (err) {
            console.error('Update Blog Error:', err.response?.data || err.message);
            alert('❌ Failed to update blog!');
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div className="container" style={styles.container}>
            <h1 style={styles.heading}>✏️ Edit Blog</h1>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={styles.input}
            />

            <input
                type="text"
                placeholder="Subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                style={styles.input}
            />

            {/* Show Image Preview */}
            {preview && (
                <div style={{ marginBottom: '15px' }}>
                    <img
                        src={
                            preview.startsWith('blob:')
                                ? preview
                                : `http://localhost:5000/uploads/${preview}`
                        }
                        alt="Blog Preview"
                        style={{ width: '100%', borderRadius: '8px' }}
                    />
                </div>
            )}

            <input
                type="file"
                onChange={handleImageChange}
                style={styles.input}
            />

            <textarea
                placeholder="Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={styles.textarea}
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.input}
            >
                <option>Technology</option>
                <option>Startup</option>
                <option>Finance</option>
                <option>Lifestyle</option>
            </select>

            <label style={{ color: 'white' }}>
                <input
                    type="checkbox"
                    checked={publishNow}
                    onChange={(e) => setPublishNow(e.target.checked)}
                    style={{ marginRight: '5px' }}
                />
                Publish Now
            </label>

            <br /><br />

            <button onClick={handleUpdateBlog} className="login-btn" style={styles.button}>
                {updating ? 'Updating...' : '💾 Update Blog'}
            </button>
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '600px',
        margin: '50px auto',
        padding: '30px',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: '10px',
        backdropFilter: 'blur(10px)',
        color: 'white',
        boxShadow: '0 0 10px rgba(255, 0, 200, 0.4)',
    },
    heading: {
        marginBottom: '20px',
        fontSize: '26px',
        textAlign: 'center',
        color: '#ff00c8',
    },
    input: {
        padding: '12px',
        width: '100%',
        marginBottom: '15px',
        borderRadius: '8px',
        border: '1px solid #555',
        backgroundColor: '#1a1a1a',
        color: 'white',
    },
    textarea: {
        padding: '12px',
        width: '100%',
        height: '150px',
        marginBottom: '15px',
        borderRadius: '8px',
        backgroundColor: '#1a1a1a',
        color: 'white',
        border: '1px solid #555',
    },
    button: {
        width: '100%',
        padding: '12px',
        border: 'none',
        borderRadius: '8px',
        background: '#ff00c8',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background 0.3s',
    },
};
