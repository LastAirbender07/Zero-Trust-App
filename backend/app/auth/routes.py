# app/auth/routes.py
from flask import Blueprint, request, jsonify
from app.models import create_user, create_user_session
from .utils import validate_signup_data, validate_login_data
from datetime import datetime
from app import mongo

auth_bp = Blueprint('auth', __name__)

@auth_bp.route("/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()
        error = validate_signup_data(data)
        if error:
            return jsonify({"error": error}), 400

        response, status_code = create_user(data)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 400

@auth_bp.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        error = validate_login_data(data)
        if error:
            return jsonify({"error": error}), 400

        user = mongo.Users.find_one({"username": data['username']})
        if not user or not data['password']:
            return jsonify({"error": "Invalid username or password"}), 400
        
        login_time = datetime.utcnow()
        response, status_code = create_user_session(data['username'], login_time)
        print(response, status_code)
        return jsonify(response), status_code
    except Exception as e:
        return jsonify({"error": str(e)}), 400
