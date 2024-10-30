import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../static/articleDetail.css';

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/articles/${id}`);
        setArticle(response.data);
        fetchComments();  // Fetch comments when article is fetched
      } catch (error) {
        console.error("Error al cargar el artículo:", error);
      }
    };

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/articles/${id}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error al cargar los comentarios:", error);
      }
    };

    fetchArticle();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5000/articles/${id}/comments`, {
        content: newComment,
        user_id: 1,  // Cambia esto por el ID del usuario autenticado
      });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error("Error al agregar el comentario:", error);
    }
  };

  if (!article) {
    return <p>Cargando artículo...</p>;
  }

  return (
    <div className="article-detail">
      <h2>{article.title}</h2>
      <div className="article-content">{article.content}</div>
      <p><strong>Categoría:</strong> {article.category_name}</p>
      <p><strong>Fecha de publicación:</strong> {new Date(article.created_at).toLocaleDateString()}</p>
      <p><strong>Por:</strong> {article.username}</p>
      <Link to="/" className="back-button">Regresar a Artículos</Link>

      <h3>Comentarios</h3>
      <form onSubmit={handleCommentSubmit}>
        <textarea 
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          required
          placeholder="Escribe tu comentario aquí..."
        />
        <button type="submit">Comentar</button>
      </form>

      <ul>
        {comments.map((comment) => (
          <li key={comment.comment_id}>
            <p><strong>{comment.username}</strong>: {comment.content}</p>
            <small>{new Date(comment.created_at).toLocaleDateString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleDetail;
