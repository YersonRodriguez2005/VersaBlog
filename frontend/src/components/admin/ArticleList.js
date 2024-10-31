import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import '../../static/ArticleList.css';

const ArticleList = ({ token }) => {
    const [articles, setArticles] = useState([]);
    const [expandedArticleId, setExpandedArticleId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/articles');
                setArticles(response.data);
                toast.dismiss();  // Elimina cualquier notificación previa antes de mostrar una nueva
                toast.success("Artículos cargados exitosamente.");
            } catch (error) {
                console.error('Error al obtener los artículos:', error);
                toast.error("Error al obtener los artículos: " + error.message);
            }
        };
    
        fetchArticles();
    }, []);
    

    const toggleExpand = (articleId) => {
        setExpandedArticleId(expandedArticleId === articleId ? null : articleId);
    };

    const handleDelete = async (articleId) => {
        const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este artículo?");
        if (!confirmDelete) return;

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
        <div className="article-list">
            <h2>Artículos Publicados</h2>
            {articles.length > 0 ? (
                <table className="article-table">
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Autor</th>
                            <th>Fecha de Creación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map(article => (
                            <React.Fragment key={article.id}>
                                <tr onClick={() => toggleExpand(article.id)}>
                                    <td>{article.title}</td>
                                    <td>{article.username}</td>
                                    <td>{new Date(article.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <div className="article-actions">
                                            <button onClick={() => navigate(`/edit-article/${article.id}`)}>
                                                <FaEdit className="action-icon" title="Editar artículo" />
                                            </button>
                                            <button onClick={() => handleDelete(article.id)}>
                                                <FaTrash className="action-icon" title="Eliminar artículo" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                                {expandedArticleId === article.id && (
                                    <tr className="expanded-row">
                                        <td colSpan="4">
                                            <div className="article-details">
                                                <p><strong>categoria:</strong> {article.category_name}</p>
                                                <div className="article-content">
                                                    <p><strong>Contenido:</strong></p>
                                                    <p>{article.content}</p>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay artículos publicados.</p>
            )}
        </div>
    );
};

export default ArticleList;
