from flask import Flask
from config import Config
from models.model_all import db
from routes.route_users import auth
from routes.route_articles import articles_bp
from routes.route_categories import categories_bp
from flask_cors import CORS
from flask_jwt_extended import JWTManager

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
app.config.from_object(Config)
app.config['JWT_SECRET_KEY'] = 'tu_clave_secreta'
app.config['JWT_TOKEN_LOCATION'] = ['headers']

jwt = JWTManager(app)

db.init_app(app)

with app.app_context():
    db.create_all()

# Registrar el blueprint de autenticación
app.register_blueprint(auth)

# Registrar el Blueprint de articles
app.register_blueprint(articles_bp)

# Registrar el Blueprint de categorias
app.register_blueprint(categories_bp)

if __name__ == '__main__':
    app.run(debug=True)
