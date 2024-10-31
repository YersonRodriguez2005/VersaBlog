import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditArticle = () => {
    const { id } = useParams();
    const [article, setArticle] = useState({ title: '', content: '', category_id: null });
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchArticle = async () => {
            if (!id) {
                toast.error("ID de artículo no encontrado.");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/articles/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setArticle(response.data);
            } catch (error) {
                console.error("Error al cargar el artículo:", error);
                toast.error("Error al cargar el artículo: " + error.message);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:5000/categories');
                setCategories(response.data);
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
                toast.error("Error al cargar las categorías: " + error.message);
            }
        };

        fetchArticle();
        fetchCategories();
    }, [id, token]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setArticle((prevArticle) => ({ ...prevArticle, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`http://localhost:5000/articles/${id}`, article, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success("Artículo actualizado exitosamente.");

            // Redirección a la página anterior después de la actualización
            navigate(-1);
        } catch (error) {
            console.error("Error al actualizar el artículo:", error);
            toast.error("Error al actualizar el artículo: " + (error.response ? error.response.data.message : error.message));
        }
    };

    return (
        <div>
            <h2>Editar Artículo</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label>
                    <input
                        type="text"
                        name="title"
                        value={article.title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Contenido:</label>
                    <textarea
                        name="content"
                        value={article.content}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Categoría:</label>
                    <select
                        name="category_id"
                        value={article.category_id || ''}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        {categories.map(category => (
                            <option key={category.category_id} value={category.category_id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Actualizar Artículo</button>
            </form>
        </div>
    );
};

export default EditArticle;
