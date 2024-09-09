from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, User, DaPaint, UserImg, InviteCode, Notifications, AdminUser, UserDisqualification
from flask_cors import CORS
from datetime import datetime, date, timedelta
from sqlalchemy import or_, and_
import re, os
import cloudinary.uploader as uploader
from sendgrid.helpers.mail import Mail
from api.send_email import send_email

api = Blueprint('api', __name__)
WINSTREAK_GOAL = os.getenv("WINSTREAK_GOAL") or 30
CORS(api)

@api.route('/login', methods=['POST'])
def handle_user_login():
    email = request.json.get("email", None)
    name = request.json.get("email", None)
    password = request.json.get("password", None)

    if (email is None and name is None) or password is None:
        return jsonify({"msg": "No username/email or password"}), 400

    user = User.query.filter(or_(User.email == email, User.name == name)).one_or_none()
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
    birthday_str = data.get('birthday')
    birthday = datetime.strptime(birthday_str, '%Y-%m-%d').date() if birthday_str else None

    errors = {}

    if errors:
        return jsonify({"errors": errors}), 400

    if birthday:
        age = (date.today() - birthday).days // 365
        if age < 18:
            return jsonify({"errors": {'birthday': 'User must be at least 18 years old'}}), 409

    user = User.query.filter_by(email=email).one_or_none()
    if user:
        return jsonify({"errors": {'email': 'An account associated with the email already exists'}}), 409

    username_check = User.query.filter_by(name=name).one_or_none()
    if username_check:
        return jsonify({"errors": {'name': 'An account associated with the username already exists'}}), 409

    if not re.match("^[a-zA-Z0-9]+$", name):
        return jsonify({"errors": {'name': 'Username can only contain letters and numbers'}}), 400

    if not re.match("^\d{5}$", zipcode):
        return jsonify({"errors": {'zipcode': 'ZipCode must contain exactly 5 digits'}}), 409

    if not re.match("^\d{10}$", phone):
        return jsonify({"errors": {'phone': 'Phone number must contain exactly 10 digits'}}), 409

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


@api.route("/forgot-password", methods=["POST"])
def forgetpassword():
    data = request.json
    email = data.get("email")
    if not email:
        return jsonify({"message": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if user is None:
        return jsonify({"message": "Email does not exist"}), 400

    token = create_access_token(identity=email, expires_delta=timedelta(hours=1))
    email_value = f"Here is the password recovery link!\n{os.getenv('FRONTEND_URL')}/forgot-password?token={token}"
    send_email(email, email_value, "Subject: Password Recovery")

    return jsonify({"message": "Recovery password has been sent"}), 200


@api.route("/change-password", methods=["PUT"])
@jwt_required()
def changepassword():
    data = request.get_json()
    password = data.get("password")
    if not password:
        return jsonify({"message": "Please provide a new password."}), 400

    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"message": "Email does not exist"}), 400

    user.password = generate_password_hash(password)
    db.session.commit()

    send_email(email, "Your password has been changed successfully.", "Password Change Notification")
    return jsonify({"message": "Password successfully changed."}), 200


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

    user.email = email
    user.name = name
    user.city = city
    user.zipcode = zipcode
    user.phone = phone
    user.birthday = birthday

    db.session.commit()
    db.session.refresh(user)

    return jsonify({"msg": "Account successfully edited!", "user": user.serialize()}), 201


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

    match = DaPaint.query.filter(
        and_(or_(DaPaint.foeId == user.id, DaPaint.hostFoeId == user.id), DaPaint.foeId.isnot(None))
    ).first()

    if match is None:
        return jsonify({
            "user": user.serialize(),
            "hasfoe": False,
            "dapaintId": None,
            "indulgers": None
        }), 200

    return jsonify({
        "user": user.serialize(),
        "hasfoe": True,
        "dapaintId": match.id,
        "indulgers": {
            "host": match.host_user.serialize() if match.hostFoeId else None,
            "foe": match.foe_user.serialize() if match.foeId else None
        }
    }), 200


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
    user_id = get_jwt_identity()
    data = request.get_json()
    fitnessStyle = data.get('fitnessStyle')
    location = data.get('location')
    date_time_str = data.get('date_time')
    price = data.get('price')

    try:
        date_time = datetime.strptime(date_time_str, "%Y-%m-%d %H:%M:%S")
    except ValueError:
        return jsonify({"msg": "Invalid date format"}), 400

    new_dapaint = DaPaint(
        hostFoeId=user_id,
        fitnessStyle=fitnessStyle,
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
    winstreak = user.winstreak

    if is_accepted == '1':
        dapaint = DaPaint.query.filter(DaPaint.foeId.isnot(None), DaPaint.winnerId == None).all()
    else:
        dapaint = db.session.query(DaPaint).join(User, DaPaint.hostFoeId == User.id).filter(DaPaint.foeId.is_(None), User.winstreak == winstreak).all()

    return jsonify([paint.serialize() for paint in dapaint]), 200


@api.route('/dapaint/report/<int:id>', methods=['PUT'])
@jwt_required()
def report_dapaint_dispute(id):
    user_id = get_jwt_identity()
    data = request.get_json()

    dispute_reported = data.get('dispute_reported', None)
    dispute_status = data.get('dispute_status', None)

    dapaint = DaPaint.query.get(id)
    if not dapaint:
        return jsonify({"msg": "No DaPaint found"}), 404

    if dapaint.hostFoeId != user_id and dapaint.foeId != user_id:
        return jsonify({"msg": "Unauthorized to report dispute"}), 403

    dapaint.dispute_reported = dispute_reported
    dapaint.dispute_status = dispute_status

    db.session.commit()

    return jsonify({"msg": "Dispute status updated successfully", "dapaint": dapaint.serialize()}), 200


@api.route('/dapaint/dispute/<int:id>', methods=['GET'])
@jwt_required()
def get_dapaint_dispute(id):
    dapaint = DaPaint.query.get(id)
    if not dapaint:
        return jsonify({"msg": "No DaPaint found"}), 404

    return jsonify({
        "dispute_reported": dapaint.dispute_reported,
        "dispute_status": dapaint.dispute_status
    }), 200


@api.route('/createReport', methods=['POST'])
@jwt_required()
def create_report():
    user_id = get_jwt_identity()
    data = request.get_json()

    dapaint_id = data.get("dapaint_id")
    reason = data.get("reason")

    if not dapaint_id or not reason:
        return jsonify({"msg": "Dapaint ID and reason are required"}), 400

    dapaint = DaPaint.query.get(dapaint_id)
    if not dapaint:
        return jsonify({"msg": "No DaPaint found"}), 404

    new_report = UserDisqualification(
        user_id=user_id,
        dapaint_id=dapaint_id,
        reason=reason
    )

    db.session.add(new_report)
    db.session.commit()

    return jsonify({"msg": "Report successfully created"}), 201
