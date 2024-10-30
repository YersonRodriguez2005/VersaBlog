import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../static/UserArticles.css';

const UserArticles = ({ token }) => {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserArticles = async () => {
            if (!token) {
                toast.error("Debes iniciar sesión para ver tus artículos.");
                navigate('/login');
                return;
            }

            const authToken = token || localStorage.getItem('token');
            const userId = JSON.parse(localStorage.getItem('user')).id;

            try {
                const response = await axios.get(`http://localhost:5000/articles/user/${userId}`, {
                    headers: { Authorization: `Bearer ${authToken}` },
                });
                setArticles(response.data);
            } catch (error) {
                console.error("Error al obtener los artículos:", error);
                toast.error("Error al obtener los artículos: " + error.message);
            }
        };

        fetchUserArticles();
    }, [token, navigate]);

    const handleDelete = async (articleId) => {
        const authToken = token || localStorage.getItem('token');

        try {
            await axios.delete(`http://localhost:5000/articles/${articleId}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            toast.success("Artículo eliminado exitosamente.");
            setArticles(articles.filter(article => article.id !== articleId));
        } catch (error) {
            console.error("Error al eliminar el artículo:", error);
            toast.error("Error al eliminar el artículo: " + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div className="articles-container">
            <h2>Mis Artículos</h2>
            {articles.length === 0 ? (
                <p>No tienes artículos creados.</p>
            ) : (
                <div className="articles-grid">
                    {articles.map((article, index) => (
                        <div className="article-card" key={`${article.title}-${index}`}>
                            <h3 className="article-title">{article.title}</h3>
                            <p className="article-content">{article.content}</p>
                            <div className="article-actions">
                                {article.id ? (
                                    <button onClick={() => navigate(`/edit-article/${article.id}`)}>
                                        <FaEdit className="action-icon" title="Editar artículo" />
                                    </button>
                                ) : (
                                    <span>No se puede editar (ID no válido)</span>
                                )}
                                <button onClick={() => handleDelete(article.id)}>
                                    <FaTrash className="action-icon" title="Eliminar artículo" />
                                </button>
                            </div>

                        </div>
                    ))}

                </div>
            )}
        </div>
    );
};

export default UserArticles;
