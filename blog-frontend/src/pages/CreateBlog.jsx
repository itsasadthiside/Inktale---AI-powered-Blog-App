import React, { useState } from 'react';
import axios from 'axios';

export default function CreateBlog() {
    const [title, setTitle] = useState('');
    const [subtitle, setSubtitle] = useState('');
    const [desc, setDesc] = useState('');
    const [category, setCategory] = useState('Technology');
    const [publishNow, setPublishNow] = useState(false);
    const [image, setImage] = useState(null);  // file object
    const [imageUrl, setImageUrl] = useState(''); // uploaded url
    const [generating, setGenerating] = useState(false);
    const [adding, setAdding] = useState(false);

    const handleImageUpload = async () => {
        if (!image) return;

        const formData = new FormData();
        formData.append('image', image);

        try {
            const res = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setImageUrl(res.data.imageUrl);
            return res.data.imageUrl;
        } catch (err) {
            console.error('Upload Error:', err);
            alert('❌ Image upload failed');
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        const token = localStorage.getItem('token');

        try {
            const res = await axios.post(
                'http://localhost:5000/api/ai/generate',
                { title, category },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setDesc(res.data.description || '');
        } catch (err) {
            console.error('AI Error:', err.response?.data || err.message);
            alert('AI generation failed: ' + (err.response?.data?.error || err.message));
        } finally {
            setGenerating(false);
        }
    };

    const handleAddBlog = async () => {
        if (!title || !subtitle || !desc || !category) {
            alert('Please fill all required fields');
            return;
        }

        setAdding(true);
        let uploadedImageUrl = imageUrl;

        if (image && !uploadedImageUrl) {
            uploadedImageUrl = await handleImageUpload();
        }

        try {
            const token = localStorage.getItem('token');
            await axios.post(
                'http://localhost:5000/api/blogs',
                {
                    title,
                    subtitle,
                    description: desc,
                    category,
                    isPublished: publishNow,
                    imageUrl: uploadedImageUrl, // ✅ send imageUrl string
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            alert('✅ Blog added successfully!');
            setTitle('');
            setSubtitle('');
            setDesc('');
            setCategory('Technology');
            setPublishNow(false);
            setImage(null);
            setImageUrl('');
        } catch (err) {
            console.error('Add Blog Error:', err.response?.data || err.message);
            alert('❌ Failed to add blog: ' + (err.response?.data?.error || err.message));
        } finally {
            setAdding(false);
        }
    };

    return (
        <div className="container" style={styles.container}>
            <h1 style={styles.heading}>📝 Create Blog Post</h1>

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

            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
                style={styles.input}
            />

            <textarea
                placeholder="Generated Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                style={styles.textarea}
            />

            <button onClick={handleGenerate} className="login-btn" style={styles.button}>
                {generating ? 'Generating...' : '✨ Generate with AI'}
            </button>

            <br /><br />

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

            <button onClick={handleAddBlog} className="login-btn" style={styles.button}>
                {adding ? 'Adding...' : '✅ Add Blog'}
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
