import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../../static/createArticle.css';

const CreateArticle = ({ token }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    // Obtener todas las categorías de la base de datos
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/categories');
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
        toast.error("Error al cargar las categorías");
      }
    };

    fetchCategories();
  }, []);

  const handleCreateArticle = async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? user.id : null;

    if (!userId) {
      toast.error("Usuario no autenticado. Por favor, inicia sesión.");
      return; // Salir si no hay ID de usuario
    }

    const articleData = {
      title,
      content,
      ...(selectedCategory && { category_id: selectedCategory.category_id }),
      user_id: userId,
    };

    const authToken = token || localStorage.getItem('token');

    if (!authToken) {
      toast.error("Token de autenticación no encontrado");
      return; // Salir si no hay token
    }

    try {
      await axios.post(
        'http://localhost:5000/articles',
        articleData,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      toast.success("Artículo creado exitosamente");
      setTitle('');
      setContent('');
      setSelectedCategory(null);
    } catch (error) {
      console.error("Error al crear el artículo:", error.response || error);
      toast.error("Error al crear el artículo: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div>
      <h2>Crear Artículo</h2>
      <input
        type="text"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Contenido"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <select
        className="custom-select"
        value={selectedCategory ? selectedCategory.category_id : ''}
        onChange={(e) => {
          const categoryId = e.target.value;
          const category = categories.find(cat => cat.category_id === parseInt(categoryId));
          setSelectedCategory(category);
        }}
      >
        <option value="">Selecciona una categoría</option>
        {categories.map(category => (
          <option key={category.category_id} value={category.category_id}>
            {category.name}
          </option>
        ))}
      </select>

      {/* Mostrar descripción de la categoría seleccionada */}
      {selectedCategory && (
        <p className="category-description">{selectedCategory.description}</p>
      )}

      <button onClick={handleCreateArticle}>Crear Artículo</button>
    </div>
  );
};

export default CreateArticle;
