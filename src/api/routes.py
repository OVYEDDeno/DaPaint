from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, DaPaint, UserImg, WSH
from flask_cors import CORS
from datetime import datetime, date, timedelta
from sqlalchemy import or_
from sqlalchemy.orm import aliased
import re, json, os
import cloudinary.uploader as uploader
from cloudinary.uploader import destroy
from cloudinary.api import delete_resources_by_tag

api = Blueprint('api', __name__)

WINSTREAK_GOAL=os.getenv("WINSTREAK_GOAL")or 30


# Allow CORS requests to this API
CORS(api)

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

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))

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

# Working route
@api.route('/user/edit', methods=['PUT'])
@jwt_required()
def handle_user_edit():

    email = request.json.get("email")
    name = request.json.get("name")
    city = request.json.get("city")
    zipcode = request.json.get("zipcode")
    phone = request.json.get("phone")
    birthday = request.json.get("birthday")

    if email is None or name is None or city is None or zipcode is None or phone is None or birthday is None:
        return jsonify({"msg": "Some fields are missing in your request"}), 400

    user = User.query.filter_by(id=get_jwt_identity()).first()
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
    search_term = request.args.get('search', '')
    users = User.query.filter(
        or_(
            User.name.ilike(f"%{search_term}%"),
            User.email.ilike(f"%{search_term}%")
        )
    ).all()
    return jsonify([user.serialize() for user in users]), 200

@api.route('/dapaint', methods=['POST'])
@jwt_required()
def create_dapaint():
    user_id = get_jwt_identity()  # Assuming the user is authenticated
    data = request.get_json()

    location = data.get('location')
    date_time_str = data.get('date_time')
    price = data.get('price')

    try:
        date_time = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"msg": "Invalid date format"}), 400

    new_dapaint = DaPaint(
        hostFoeId=user_id,
        location=location,
        date_time=date_time,
        price=price
    )

    db.session.add(new_dapaint)
    db.session.commit()

    return jsonify(new_dapaint.serialize()), 201

@api.route('/lineup', methods=['GET'])
@jwt_required()
def get_all_dapaint():
    is_accepted = request.args.get("isaccepted")
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    winstreak=user.winstreak

    if is_accepted == '1':
        dapaint = DaPaint.query.filter(DaPaint.foeId.isnot(None)).all()
    else:
        dapaint = db.session.query(DaPaint).join(User, DaPaint.hostFoeId == User.id).filter(DaPaint.foeId.is_(None), User.winstreak == winstreak).all()

    return jsonify([d.serialize() for d in dapaint]), 200

@api.route('/lineup/<int:event_id>', methods=['PATCH'])
@jwt_required()
def update_foe_id(event_id):
    user_id = get_jwt_identity()
    data = request.get_json()
    foe_id = data.get('foeId')

    # Ensure the user is not trying to set themselves as foeId if they are host
    event = DaPaint.query.get(event_id)
    if event.hostFoeId == user_id:
        return jsonify({'error': 'You cannot clock into your own event'}), 403

    if event and foe_id:
        event.foeId = foe_id
        db.session.commit()
        return jsonify(event.serialize()), 200
    return jsonify({'error': 'Event not found or invalid data'}), 404
    
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
@jwt_required()
def get_max_win_streak():    
    # Subquery to find the maximum win streak
    max_winstreak_subquery = db.session.query(
        db.func.max(User.winstreak).label('max_winstreak')
    ).subquery()

    # Alias for the User table
    user_alias = aliased(User)

    # Query to get the user with the maximum win streak
    user_with_max_winstreak = db.session.query(user_alias).join(
        max_winstreak_subquery,
        user_alias.winstreak == max_winstreak_subquery.c.max_winstreak
    ).first()

    # Ensure the user is found
    if user_with_max_winstreak:
        return jsonify({
            "maxWinStreak": user_with_max_winstreak.winstreak,
            "maxWinStreakUser": user_with_max_winstreak.serialize(),
            "WinStreakGoal": WINSTREAK_GOAL
        }), 200
    else:
        return jsonify({"message": "No user found"}), 404
    
@api.route('/reset-win-streak', methods=['PUT'])
@jwt_required()
def reset_win_streak():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    user.winstreak = 0
    db.session.commit()
    return jsonify({"message": "Goal reached Wins Streak Reset!"}), 200

@api.route('/user-img', methods=['POST'])
@jwt_required()
def user_img():
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if user is None:
        return jsonify({"msg": "No user found"}), 404

    images = request.files.getlist("file")
    if not images:
        return jsonify({"msg": "No images uploaded"}), 400

    uploaded_images = []
    for image_file in images:
        try:
            response = uploader.upload(image_file)
            if response.get("secure_url"):
                new_image = UserImg(public_id=response["public_id"], image_url=response["secure_url"], user_id=user.id)
                db.session.add(new_image)
                db.session.commit()
                uploaded_images.append(new_image.image_url)
            else:
                print("User image upload was not successful")
        except Exception as e:
            return jsonify({"msg": "Image upload failed", "error": str(e)}), 500

    return jsonify({"msg": "Images Successfully Uploaded", "images": uploaded_images}), 200

@api.route('/act', methods=['PUT'])
@jwt_required()
def act():
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if user is None:
        return jsonify({"msg": "User not found"}), 404
    if user.is_active==True:
        user.is_active=False
    else:
        user.is_active=True
    db.session.commit()
    return jsonify({"msg": "Account status updated"}), 200

@api.route('/update-win-streak', methods=['PUT'])
@jwt_required()
def update_win_streak():
    data = request.get_json()
    host_vote = data.get('hostVote')
    foe_vote = data.get('foeVote')

    # Get the current user
    user = User.query.filter_by(id=user_id).first()
    if user is None:
        return jsonify({"msg": "No user found"}), 404

    # Update win streak and related statistics
    if host_vote == 'yes':
        user.winstreak += 1
        user.wins += 1
    elif host_vote == 'no':
        user.winstreak = 0
        user.losses += 1

    if foe_vote == 'yes':
        user.winstreak += 1
        user.wins += 1
    elif foe_vote == 'no':
        user.winstreak = 0
        user.losses += 1

    # Commit changes to the database
    db.session.commit()

    return jsonify({'winstreak': user.winstreak, 'wins': user.wins, 'losses': user.losses}), 200