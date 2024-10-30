from flask import Blueprint, request, jsonify
from models.model_all import db, User
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token

# Inicializar Flask-Bcrypt
bcrypt = Bcrypt()

# Crear el blueprint
auth = Blueprint('auth', __name__)

@auth.route('/register', methods=['POST'])
def register_user():
    data = request.json
    username = data.get('username')
    email = data.get('email')
    password = data.get('password')
    biografia = data.get('biografia')
    foto_perfil_url = data.get('foto_perfil_url')
    role = data.get('role', 'lector')

    if not username or not email or not password:
        return jsonify({'message': 'Todos los campos son obligatorios.'}), 400

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'message': 'El usuario ya existe.'}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        biografia=biografia,
        foto_perfil_url=foto_perfil_url,
        role=role
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Usuario registrado exitosamente.', 'user': {'username': username, 'email': email, 'role': role}}), 201

# Ruta para iniciar sesión
@auth.route('/login', methods=['POST'])
def login_user():
    data = request.json
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Todos los campos son obligatorios.'}), 400

    user = User.query.filter_by(email=email).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, password):
        return jsonify({'message': 'Credenciales inválidas.'}), 401

    access_token = create_access_token(identity=user.user_id)

    return jsonify({
        'message': 'Inicio de sesión exitoso.',
        'user': {
            'id': user.user_id,
            'username': user.username,
            'email': user.email,
            'role': user.role
        },
        'token': access_token
    }), 200

@auth.route('/admin/users', methods=['GET'])
def get_all_users():
    users = User.query.all()
    users_list = [{
        'id': user.user_id,
        'username': user.username,
        'email': user.email,
        'biografia': user.biografia,
        'foto_perfil_url': user.foto_perfil_url
    } for user in users]

    return jsonify(users_list), 200