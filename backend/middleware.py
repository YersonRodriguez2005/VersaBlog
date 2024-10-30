from flask import request, jsonify
import jwt

def token_required(f):
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split()[1]  # Asumiendo que el formato es "Bearer <token>"
        if not token:
            return jsonify({'message': 'Token es necesario!'}), 401
        try:
            data = jwt.decode(token, 'tu_clave_secreta', algorithms=['HS256'])
            current_user = data['user_id']  # Suponiendo que guardas el user_id en el token
        except Exception:
            return jsonify({'message': 'Token es inválido!'}), 401
        return f(current_user, *args, **kwargs)
    return decorator
