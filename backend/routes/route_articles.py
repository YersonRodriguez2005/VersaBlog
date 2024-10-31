from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from models.model_all import db, Article, Category, User
from sqlalchemy.exc import SQLAlchemyError

articles_bp = Blueprint('articles', __name__)

# Crear artículo
@articles_bp.route('/articles', methods=['POST'])
@jwt_required()
def create_article():
    data = request.get_json()
    current_user_id = get_jwt_identity()

    title = data.get('title')
    content = data.get('content')
    category_id = data.get('category_id')

    if not title or not content:
        return jsonify({"error": "Título y contenido son obligatorios"}), 400

    if category_id:
        category = Category.query.get(category_id)
        if not category:
            return jsonify({"error": "La categoría proporcionada no existe"}), 400

    new_article = Article(
        title=title,
        content=content,
        user_id=current_user_id,
        category_id=category_id
    )
    db.session.add(new_article)

    try:
        db.session.commit()
        return jsonify({"message": "Artículo creado exitosamente", "article": new_article.to_dict()}), 201
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al guardar el artículo en la base de datos"}), 500

# Obtener todos los artículos
@articles_bp.route('/articles', methods=['GET'])
def get_all_articles():
    articles = Article.query.all()
    return jsonify([article.to_dict() for article in articles]), 200

# Obtener un artículo por ID
@articles_bp.route('/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article = Article.query.get_or_404(article_id)
    return jsonify(article.to_dict()), 200

# Obtener artículos por usuario
@articles_bp.route('/articles/user/<int:user_id>', methods=['GET'])
def get_user_articles(user_id):
    articles = Article.query.filter_by(user_id=user_id).all()
    return jsonify([article.to_dict() for article in articles]), 200

# Actualizar un artículo
@articles_bp.route('/articles/<int:article_id>', methods=['PUT'])
@jwt_required()
def update_article(article_id):
    data = request.get_json()
    current_user_id = get_jwt_identity()

    article = Article.query.get_or_404(article_id)
    current_user = User.query.get(current_user_id)

    # Verificar propiedad
    if article.user_id != current_user_id and current_user.role != 'admin':
        return jsonify({"error": "No tienes permiso para actualizar este artículo"}), 403

    article.title = data.get('title', article.title)
    article.content = data.get('content', article.content)
    category_id = data.get('category_id', article.category_id)
    
    if category_id and not Category.query.get(category_id):
        return jsonify({"error": "La categoría proporcionada no existe"}), 400
    article.category_id = category_id
    article.updated_at = datetime.utcnow()

    try:
        db.session.commit()
        return jsonify({"message": "Artículo actualizado exitosamente", "article": article.to_dict()}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al actualizar el artículo"}), 500

# Eliminar un artículo
@articles_bp.route('/articles/<int:article_id>', methods=['DELETE'])
@jwt_required()
def delete_article(article_id):
    current_user_id = get_jwt_identity()
    article = Article.query.get_or_404(article_id)

    current_user = User.query.get(current_user_id)

    if article.user_id != current_user_id and current_user.role != 'admin':
        return jsonify({"error": "No tienes permiso para eliminar este artículo"}), 403

    try:
        db.session.delete(article)
        db.session.commit()
        return jsonify({"message": "Artículo eliminado exitosamente"}), 200
    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"error": "Error al eliminar el artículo"}), 500