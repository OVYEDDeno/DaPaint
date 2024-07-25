from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, DaPaint
from flask_cors import CORS
from datetime import datetime, date

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

    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

@api.route('/user/signup', methods=['POST'])
def handle_user_signup():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    name = data.get('name')
    city = data.get('city')
    zipcode = data.get('zipcode')
    phone = data.get('phone')
    birthday_str = data.get('birthday')  # Expecting format YYYY-MM-DD
    birthday = datetime.strptime(birthday_str, '%Y-%m-%d').date() if birthday_str else None

    # Validate that all required fields are present
    if not all([email, password, name, city, zipcode, phone, birthday]):
        return jsonify({"msg": "Some fields are missing in your request"}), 400

    # Validate age restriction (e.g., user must be at least 18 years old)
    if birthday:
        age = (date.today() - birthday).days // 365
        if age < 18:
            return jsonify({'error': 'User must be at least 18 years old'}), 400

    # Check if the email already exists
    user = User.query.filter_by(email=email).one_or_none()
    if user:
        return jsonify({"msg": "An account associated with the email already exists"}), 409

    # Create new user
    new_user = User(
        email=email,
        password=password,
        name=name,
        city=city,
        zipcode=zipcode,
        phone=phone,
        birthday=birthday
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'message': 'User created successfully'}), 201

@api.route('/user/edit/<int:user_id>', methods=['PUT'])
@jwt_required()
def handle_user_edit(user_id):
    email = request.json.get("email")  
    name = request.json.get("name")
    city = request.json.get("city")
    zipcode = request.json.get("zipcode")
    phone = request.json.get("phone")
    birthday = request.json.get("birthday")
    winstreak = request.json.get("winstreak")
    wins = request.json.get("wins")
    winsByKO = request.json.get("winsByKO")
    winsBySub = request.json.get("winsBySub")
    losses = request.json.get("losses")
    lossesByKO = request.json.get("lossesByKO")
    lossesBySub = request.json.get("lossesBySub")
    disqualifications = request.json.get("disqualifications")
    
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
    user.winstreak = winstreak
    user.wins = wins
    user.winsByKO = winsByKO
    user.winsBySub = winsBySub
    user.losses = losses
    user.lossesByKO = lossesByKO
    user.lossesBySub = lossesBySub
    user.disqualifications = disqualifications
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
    date_time = request.json.get("dateTime", None)
    price = request.json.get("price", None)   
    winnerId = request.json.get("winnerId", None)
    loserId = request.json.get("loserId", None)
    
    if hostFoeId is None or location is None or date_time is None or price is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    dapaint = DaPaint(hostFoeId=hostFoeId, foeId=foeId, location=location, date_time=date_time, price=price, winnerId=winnerId, loserId=loserId)
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

    # dapaint_records
    
@api.route('/dapaint/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_dapaint(id):
    dapaint = DaPaint.query.get(id)
    if dapaint is None:
        return jsonify({"msg": "No DaPaint found"}), 404 

    db.session.delete(dapaint)
    db.session.commit()

    return jsonify({"message": "DaPaint record deleted successfully"}), 200
