"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt, decode_token
from api.models import db, User, DaPaint
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/user/login', methods=['POST'])
def handle_user_login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return jsonify({"msg": "No email or password"}), 400
    user = User.query.filter_by(email=email).one_or_none()
    if user is None:
        return jsonify({"msg": "no such user"}), 404
    if user.password != password:
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(
        identity=user.id,
        # additional_claims = {"role": "owner"} 
        )
    return jsonify(access_token=access_token), 201

@api.route('/user/signup', methods=['POST'])
def handle_user_signup():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    name = request.json.get("name", None)
    city = request.json.get("city", None)
    zipcode = request.json.get("zipcode", None)
    phone = request.json.get("phone", None)
    birthday = request.json.get("birthday", None)
    if email is None or password is None or name is None or city is None or zipcode is None or phone is None or birthday is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    user = User.query.filter_by(email=email).one_or_none()
    if user:
        return jsonify({"msg": "An account associated with the email already exists"}), 409
    user = User(email=email, password=password, name=name, city=city, zipcode=zipcode, phone=phone, birthday=birthday, is_active=True)
    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)
    response_body = {"msg": "Account succesfully created!", "user":user.serialize()}
    return jsonify(response_body), 201

@api.route('/user/edit/<int:user_id>', methods=['PUT'])
@jwt_required()
def handle_user_edit(user_id):
    email = request.json.get("email")  
    name = request.json.get("name")
    city = request.json.get("city")
    zipcode = request.json.get("zipcode")
    phone = request.json.get("phone")
    birthday = request.json.get("birthday")
    if email is None  or name is None or city is None or zipcode is None or phone is None or birthday is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    user = User.query.filter_by(id=user_id).one_or_none()
    if user is None:
        return jsonify({"msg": "No user found"}), 404
    user.email=email
   
    user.name=name   
    user.city=city    
    user.zipcode=zipcode    
    user.phone=phone
    user.birthday=birthday
    db.session.commit()
    db.session.refresh(user)
    response_body = {"msg": "Account succesfully edited!", "user":user.serialize()}
    return jsonify(response_body), 201

@api.route('/user/get-user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    # current_user_id = get_jwt_identity()
    # current_user = User.query.get(current_user_id)

    user = User.query.get(user_id)
    if user is None:
        return jsonify({"msg": "No user found"}), 404
    
    return jsonify(user.serialize()), 200

@api.route('/current-user', methods=['GET'])
@jwt_required()
def get_current_user():
    
    user = User.query.get(get_jwt_identity())
    if user is None:
        return jsonify({"msg": "No user found"}), 404
    
    return jsonify(user.serialize()), 200

@api.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    users = User.query.all()
    return jsonify([user.serialize() for user in users]), 200