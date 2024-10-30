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

    # Validaciones básicas
    if not username or not email or not password:
        return jsonify({'message': 'Todos los campos son obligatorios.'}), 400

    # Verificar si el usuario ya existe
    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return jsonify({'message': 'El usuario ya existe.'}), 400

    # Hashear la contraseña
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Crear el nuevo usuario
    new_user = User(
        username=username,
        email=email,
        password_hash=hashed_password,
        biografia=biografia,
        foto_perfil_url=foto_perfil_url
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'Usuario registrado exitosamente.'}), 201

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

    # Cambiamos `user.id` por `user.user_id`
    access_token = create_access_token(identity=user.user_id)

    # Respuesta con el token y datos del usuario
    return jsonify({
        'message': 'Inicio de sesión exitoso.',
        'user': {
            'id': user.user_id,
            'username': user.username,
            'email': user.email
        },
        'token': access_token
    }), 200
