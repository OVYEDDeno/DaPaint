"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, DaPaint
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
        return jsonify({"msg": "No such user"}), 404

    # if not check_password_hash(user.password, password):
    #     return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

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
    
    hashed_password = generate_password_hash(password, method='pbkdf2:sha256')

    user = User(email=email, password=hashed_password, name=name, city=city, zipcode=zipcode, phone=phone, birthday=birthday, is_active=True)
    db.session.add(user)
    db.session.commit()
    db.session.refresh(user)
    response_body = {"msg": "Account successfully created!", "user": user.serialize()}
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
    
    if email is None or name is None or city is None or zipcode is None or phone is None or birthday is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    user = User.query.filter_by(id=user_id).one_or_none()
    if user is None:
        return jsonify({"msg": "No user found"}), 404

    user.email = email
    user.name = name
    user.city = city
    user.zipcode = zipcode
    user.phone = phone
    user.birthday = birthday
    db.session.commit()
    db.session.refresh(user)
    response_body = {"msg": "Account successfully edited!", "user": user.serialize()}
    return jsonify(response_body), 200

@api.route('/user/get-user/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
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

@api.route('/dapaint', methods=['POST'])
def dapaint_create():
    hostFoeId = request.json.get("hostFoeId", None)
    foeId = request.json.get("foeId", None)
    location = request.json.get("location", None)
    date = request.json.get("date", None)
    time = request.json.get("time", None)
    price = request.json.get("price", None)   
    winnerId = request.json.get("winnerId", None)
    loserId = request.json.get("loserId", None)
    
    if hostFoeId is None or location is None or date is None or time is None or price is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    dapaint = DaPaint(hostFoeId=hostFoeId, foeId=foeId, location=location, date=date, time=time, price=price, winnerId=winnerId, loserId=loserId)
    db.session.add(dapaint)
    db.session.commit()
    db.session.refresh(dapaint)
    response_body = {"msg": "DaPaint successfully created!", "dapaint": dapaint.serialize()}
    return jsonify(response_body), 201

@api.route('/lineup', methods=['GET'])
def get_all_dapaint():
    dapaint = DaPaint.query.all()
    return jsonify([d.serialize() for d in dapaint]), 200

@api.route('/lineup-by-user', methods=['GET'])
@jwt_required()
def get_dapaint_by_user():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()
    
    if not user:
        return jsonify({"message": "User not found"}), 404

    dapaint_records = DaPaint.query.filter(
        (DaPaint.hostFoeId == user_id) | (DaPaint.foeId == user_id) |
        (DaPaint.winnerId == user_id) | (DaPaint.loserId == user_id)
    ).all()

    return jsonify([d.serialize() for d in dapaint_records]), 200



@api.route('/dapaint/edit/<int:dapaint_id>', methods=['PUT'])
@jwt_required()
def dapaint_edit(dapaint_id):
    hostFoeId = request.json.get("hostFoeId")
    foeId = request.json.get("foeId")
    location = request.json.get("location")
    date = request.json.get("date")
    time = request.json.get("time")
    price = request.json.get("price")   
    winnerId = request.json.get("winnerId")
    loserId = request.json.get("loserId")
    
    if hostFoeId is None or location is None or date is None or time is None or price is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    dapaint = DaPaint.query.filter_by(id=dapaint_id).one_or_none()
    if dapaint is None:
        return jsonify({"msg": "No DaPaint found"}), 404
    
    dapaint.hostFoeId = hostFoeId
    dapaint.foeId = foeId
    dapaint.location = location
    dapaint.date = date
    dapaint.time = time
    dapaint.price = price
    dapaint.winnerId = winnerId
    dapaint.loserId = loserId

    db.session.commit()
    db.session.refresh(dapaint)
    response_body = {"msg": "DaPaint successfully edited!", "dapaint": dapaint.serialize()}
    return jsonify(response_body), 200

@api.route('/dapaint/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_dapaint(id):
    dapaint = DaPaint.query.get(id)
    if dapaint is None:
        return jsonify({"msg": "No DaPaint found"}), 404 

    db.session.delete(dapaint)
    db.session.commit()

    return jsonify({"message": "DaPaint record deleted successfully"}), 200
