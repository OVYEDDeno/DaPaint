from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, DaPaint, UserImg
from flask_cors import CORS
from datetime import datetime, date
from sqlalchemy import or_
import re, json, os
import cloudinary
import cloudinary.uploader

api = Blueprint('api', __name__)

cloudinary.config( 
  cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME") ,
  api_key = os.getenv("CLOUDINARY_API_KEY"), 
  api_secret = os.getenv("CLOUDINARY_SECRET_KEY"), 
)  
# Allow CORS requests to this API
CORS(api)

# @api.route('/logout', methods=['POST'])
# @jwt_required()
# def handle_user_logout():
#     user_id = get_jwt_identity()

#     try:
#         jti = get_jwt()['jti']
#         jwt_blacklist.add(jti)
#         return jsonify({"msg": "Logout successful"}), 200
#     except Exception as e:
#         return jsonify({"msg": "Failed to logout", "error": str(e)}), 500

@api.route('/login', methods=['POST'])
def handle_user_login():
    email = request.json.get("email", None)
    name = request.json.get("email", None)
    password = request.json.get("password", None)

    if email is None and name is None or password is None:
        return jsonify({"msg": "No username/email or password"}), 400
    
    user = User.query.filter(or_(User.email==email, User.name==name)).one_or_none()
    if user is None:
        return jsonify({"msg": "No such user"}), 404

    if not check_password_hash(user.password, password):
        return jsonify({"msg": "Bad password"}), 401

    access_token = create_access_token(identity=user.id)
    return jsonify(access_token=access_token), 200

@api.route('/signup', methods=['POST'])
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

    errors = {}


    if errors:
        return jsonify({"errors": errors}), 400

    # Validate age restriction (e.g., user must be at least 18 years old)
    if birthday:
        age = (date.today() - birthday).days // 365
        if age < 18:
            return jsonify({"errors": {'birthday': 'User must be at least 18 years old'}}), 409

    # Check if the email already exists
    user = User.query.filter_by(email=email).one_or_none()
    if user:
        return jsonify({"errors": {'email': 'An account associated with the email already exists'}}), 409
    
    # Check if the username already exists
    username_check = User.query.filter_by(name=name).one_or_none()
    if username_check:
        return jsonify({"errors": {'name': 'An account associated with the username already exists'}}), 409
    
    # Validate username contains only letters and numbers
    if not re.match("^[a-zA-Z0-9]+$", name):
        return jsonify({"errors": {'name': 'Username can only contain letters and numbers'}}), 400

    # Validate zip code contains exactly 5 digits
    if not re.match("^\d{5}$", zipcode):
        return jsonify({"errors": {'zipcode': 'ZipCode must contain exactly 5 digits'}}), 409

    # Validate phone number contains exactly 10 digits
    if not re.match("^\d{10}$", phone):
        return jsonify({"errors": {'phone': 'Phone number must contain exactly 10 digits'}}), 409

    # Create new user
    new_user = User(
        email=email,
        password=generate_password_hash(password),
        name=name,
        city=city,
        zipcode=zipcode,
        phone=phone,
        birthday=birthday
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({'msg': 'User created successfully'}), 201

@api.route('/user/edit', methods=['PUT'])
@jwt_required()
def handle_user_edit():
    user_id=get_jwt_identity()
    raw_data = request.form.get("data")
    picture = request.files.get("file")
    body = json.loads(raw_data)
    email = body.get("email")  
    name = body.get("name")
    city = body.get("city")
    zipcode = body.get("zipcode")
    phone = body.get("phone")
    birthday = body.get("birthday")
    
    if email is None or name is None or city is None or zipcode is None or phone is None or birthday is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400
    
    user = User.query.filter_by(id=user_id).one_or_none()
    if user is None:
        return jsonify({"msg": "No user found"}), 404

    response = cloudinary.uploader.upload(picture)
    if response['secure_url']:
        img = UserImg(public_id=response["public_id"], image_url=response["secure_url"], user_id=user.id)
        db.session.add(img)
        db.session.commit()
        db.session.refresh(user)    
    else:
        print("user img was not successful") 
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


@api.route('/max-win-streak', methods=['GET'])
def get_max_win_streak():
    max_win_streak = db.session.query(db.func.max(User.winstreak)).scalar() or 0
    return jsonify({"maxWinStreak": max_win_streak})