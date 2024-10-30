import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../../static/Auth.css';

const Login = ({ setUser }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/login', { email, password });
            const { user, token } = response.data;

            localStorage.setItem('token', token);
            setUser({ ...user, token });
            navigate('/');
        } catch (error) {
            if (error.response) {
            } else {
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Inicio de Sesión</h2>
            <form onSubmit={handleLogin}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaEnvelope className="icon" />
                    <input
                        type="email"
                        placeholder="Correo Electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaLock className="icon" />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default Login;
