import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import BlogDetail from './pages/BlogDetail';
import AdminDashboard from './pages/AdminDashboard';
import CreateBlog from './pages/CreateBlog';
import Register from './pages/Register';
import EditBlog from './pages/EditBlog';  

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/blogs/:id" element={<BlogDetail />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/create" element={<CreateBlog />} />
      <Route path="/admin/edit/:id" element={<EditBlog />} />
    </Routes>
  );
}
