import React, { useState } from 'react';
import axios from 'axios';
import { FaUser, FaEnvelope, FaLock, FaInfoCircle, FaCamera } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import { ToastContainer, toast } from 'react-toastify'; // Importar ToastContainer y toast
import 'react-toastify/dist/ReactToastify.css'; // Importar estilos de Toastify
import '../../static/Auth.css';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [biografia, setBiografia] = useState('');
    const [fotoPerfilUrl, setFotoPerfilUrl] = useState('');
    
    const navigate = useNavigate(); // Crear el objeto navigate

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/register', {
                username,
                email,
                password,
                biografia,
                foto_perfil_url: fotoPerfilUrl
            });

            // Mostrar mensaje de éxito
            toast.success(response.data.message);

            // Redirigir al inicio de sesión
            navigate('/login'); // Cambia '/login' según tu ruta de inicio de sesión
        } catch (error) {
            if (error.response) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Error en el registro. Intenta nuevamente.');
            }
        }
    };

    return (
        <div className="auth-container">
            <h2>Registro</h2>
            <form onSubmit={handleRegister}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaUser className="icon" />
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaEnvelope className="icon" />
                    <input
                        type="email"
                        placeholder="Email"
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
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaInfoCircle className="icon" />
                    <textarea
                        placeholder="Biografía"
                        value={biografia}
                        onChange={(e) => setBiografia(e.target.value)}
                        required
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <FaCamera className="icon" />
                    <input
                        type="url"
                        placeholder="URL de foto de perfil"
                        value={fotoPerfilUrl}
                        onChange={(e) => setFotoPerfilUrl(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Registrarse</button>
            </form>
            <ToastContainer />
        </div>
    );
};

export default Register;
