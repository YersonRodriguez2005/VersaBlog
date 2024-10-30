import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import '../static/Header.css';

const Header = ({ user, setUser }) => {
    return (
        <header className="header">
            <a href="/">Mi Blog Multiusuario</a>
            <nav>
                <ul>
                    {user ? (
                        <>
                            <li>
                                <span>Bienvenido, {user}</span>
                            </li>
                            <li>
                                <button onClick={() => setUser(null)}>Cerrar Sesión</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">
                                    <FaSignInAlt style={{ marginRight: '5px' }} /> Iniciar Sesión
                                </Link>
                            </li>
                            <li>
                                <Link to="/register">
                                    <FaUserPlus style={{ marginRight: '5px' }} /> Registrarse
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;