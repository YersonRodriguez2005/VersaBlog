import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { FaEdit, FaListUl } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/Header';
import Login from './components/login/Login';
import Register from './components/login/Register';
import CreateArticle from './components/article/CreateArticle';
import UserArticles from './components/article/UserArticles';
import EditArticle from './components/article/EditArticle';
import ArticlesList from './components/article/ArticlesList';
import ArticleDetail from './components/article/ArticleDetail';
import AdminDashboard from './components/admin/AdminDashboard';
import UserList from './components/admin/UserList';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleSetUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem('user', JSON.stringify({ ...userData, timestamp: Date.now() }));
      localStorage.setItem('token', userData.token);
      setToken(userData.token);
      toast.success('Inicio de sesión exitoso');
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      setToken(null);
      toast.info('Sesión cerrada');
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const expirationTime = 30 * 60 * 1000;
      if (Date.now() - parsedUser.timestamp < expirationTime) {
        setUser(parsedUser);
        setToken(parsedUser.token);
      } else {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setToken(null);
        toast.warning('Sesión expirada. Por favor, inicia sesión nuevamente.');
      }
    }
  }, []);

  return (
    <Router>
      <ToastContainer position="bottom-right" autoClose={3000} />
      <Header user={user ? user.username : null} setUser={handleSetUser} />
      <div className="app-content">
        <Routes>
          <Route path="/login" element={<Login setUser={handleSetUser} />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <div>
                <div className="links-container">
                  <Link to="/create-article" className="links-article">
                    <FaEdit className="link-icon" /> Crea tu artículo
                  </Link>
                  <Link to="/user-articles" className="links-article">
                    <FaListUl className="link-icon" /> Ver mis artículos
                  </Link>
                </div>
                <ArticlesList /> {/* Muestra las cards aquí mismo */}
              </div>
            }
          />
          <Route path="/create-article" element={<CreateArticle token={token} />} />
          <Route path="/user-articles" element={<UserArticles token={token} />} />
          <Route path="/edit-article/:id" element={<EditArticle />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
