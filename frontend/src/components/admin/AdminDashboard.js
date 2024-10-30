// src/admin/AdminDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaNewspaper, FaComments } from 'react-icons/fa';
import '../../static/AdminDashboard.css';

const AdminDashboard = () => {
    return (
        <div className="admin-dashboard">
            <h1>Panel de Administración</h1>
            <p>Bienvenido al panel de administración. Desde aquí puedes gestionar usuarios, artículos y comentarios.</p>
            
            <div className="admin-links">
                <Link to="/admin/users" className="admin-link">
                    <FaUser className="icon" />
                    <span>Gestión de Usuarios</span>
                </Link>
                <Link to="/admin/articles" className="admin-link">
                    <FaNewspaper className="icon" />
                    <span>Gestión de Artículos</span>
                </Link>
                <Link to="/admin/comments" className="admin-link">
                    <FaComments className="icon" />
                    <span>Gestión de Comentarios</span>
                </Link>
            </div>
        </div>
    );
};

export default AdminDashboard;
