// src/admin/UserList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../static/UserList.css';

const UserList = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:5000/admin/users');
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="user-list">
            <h2>Usuarios Registrados</h2>
            {users.length > 0 ? (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Nombre de Usuario</th>
                            <th>Email</th>
                            <th>Biografía</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <img
                                        src={user.foto_perfil_url || '/default-profile.png'}
                                        alt={`${user.username}'s profile`}
                                        className="user-avatar"
                                    />
                                </td>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.biografia || 'No disponible'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay usuarios registrados.</p>
            )}
        </div>
    );
};

export default UserList;
