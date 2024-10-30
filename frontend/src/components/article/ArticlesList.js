import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import '../../static/articlesList.css';

const ArticlesList = () => {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await axios.get('http://localhost:5000/articles');
                setArticles(response.data);
            } catch (error) {
                console.error("Error al cargar los artículos:", error);
            }
        };

        fetchArticles();
    }, []);

    return (
        <div className="articles-container">
            {articles.map(article => (
                <div key={article.id} className="article-card">
                    <h3>{article.title}</h3>
                    <p>{article.content.substring(0, 100)}...</p> {/* Previsualización */}
                    <Link to={`/article/${article.id}`}>Leer más</Link> {/* Enlace al artículo completo */}
                </div>
            ))}
        </div>
    );
};

export default ArticlesList;
