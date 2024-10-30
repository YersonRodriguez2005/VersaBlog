from flask import Blueprint, request, jsonify
from models.model_all import Comment, db

comments_bp = Blueprint('comments', __name__)

@comments_bp.route('/articles/<int:article_id>/comments', methods=['GET'])
def get_comments(article_id):
    comments = Comment.query.filter_by(article_id=article_id, approved=True).all()
    return jsonify([comment.to_dict() for comment in comments])

@comments_bp.route('/articles/<int:article_id>/comments', methods=['POST'])
def add_comment(article_id):
    data = request.json
    new_comment = Comment(
        content=data['content'],
        article_id=article_id,
        user_id=data['user_id'],
        approved=False
    )
    db.session.add(new_comment)
    db.session.commit()
    return jsonify(new_comment.to_dict()), 201

@comments_bp.route('/comments/<int:comment_id>/approve', methods=['POST'])
def approve_comment(comment_id):
    comment = Comment.query.get_or_404(comment_id)
    comment.approved = True
    db.session.commit()
    return jsonify(comment.to_dict())
