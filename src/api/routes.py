from flask import Blueprint, request, jsonify, abort
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from api.models import db, InviteCode, User, DaPaint, UserImg, Notifications, Insight, UserDisqualification, Reports, invitee_association
from flask_cors import CORS
from datetime import datetime, date, timedelta
from sqlalchemy import or_, and_
import re, os
import cloudinary.uploader as uploader
import random
import string
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

    access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=10))
    return jsonify(access_token=access_token), 200

def generate_unique_invite_code(length=10):
    while True:
        # Generate a random alphanumeric code
        code = ''.join(random.choices(string.ascii_letters + string.digits, k=length))
        
        # Check if the code already exists in the User table
        existing_code = InviteCode.query.filter_by(code=code).first()
        if not existing_code:
            # If code is unique, return it
            return code

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
    db.session.refresh(new_user)
    invite_code = generate_unique_invite_code()
    new_invite_code = InviteCode(code=invite_code, inviter_id=new_user.id)
    db.session.add(new_invite_code)
    db.session.commit()
    return jsonify({'msg': 'User created successfully', 'invite_code': invite_code}), 201


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
    user = User.query.filter_by(id=get_jwt_identity()).first()
    if user is None:
        return jsonify({"msg": "No user found"}), 404

    # Get JSON data from the request
    data = request.get_json()

    # Update only the fields that are present in the request
    if "email" in data:
        user.email = data["email"]
    if "name" in data:
        user.name = data["name"]
    if "city" in data:
        user.city = data["city"]
    if "zipcode" in data:
        user.zipcode = data["zipcode"]
    if "phone" in data:
        user.phone = data["phone"]
    if "birthday" in data:
        try:
            from datetime import datetime
            user.birthday = datetime.strptime(data["birthday"], "%m/%d/%Y").date()
        except ValueError:
            return jsonify({"msg": "Invalid birthday format, should be MM/DD/YYYY"}), 400
    if "instagram_url" in data:
        user.instagram_url = data["instagram_url"]
    if "tiktok_url" in data:
        user.tiktok_url = data["tiktok_url"]
    if "twitch_url" in data:
        user.twitch_url = data["twitch_url"]
    if "kick_url" in data:
        user.kick_url = data["kick_url"]
    if "youtube_url" in data:
        user.youtube_url = data["youtube_url"]
    if "twitter_url" in data:
        user.twitter_url = data["twitter_url"]
    if "facebook_url" in data:
        user.facebook_url = data["facebook_url"]

    # Commit the changes to the database
    try:
        db.session.commit()
    except Exception as e:
        db.session.rollback()  # Rollback in case of error
        return jsonify({"msg": "An error occurred while updating the user.", "error": str(e)}), 500

    # Refresh user object to reflect updated data and return a response
    db.session.refresh(user)
    return jsonify({"msg": "Account successfully edited!", "user": user.serialize()}), 200



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

@api.route('/update-win-streak/<int:dapaint_id>', methods=['PUT'])
@jwt_required()
def update_win_streak(dapaint_id):
    user_id = get_jwt_identity()  # Get the ID of the user making the request
    data = request.get_json()
    winner_vote = data.get('winner')
    loser_vote = data.get('loser')
    img_url = data.get('img_url', None)  # Optional image for report

    print(f"Received winner_vote: {winner_vote}, loser_vote: {loser_vote}")
    
    if not winner_vote or not loser_vote:
        return jsonify({"msg": "Winner and loser votes are required."}), 400

    # Fetch the DaPaint record
    daPaint = DaPaint.query.get(dapaint_id)
    if daPaint is None:
        return jsonify({"msg": "No DaPaint found"}), 404

    # Determine if the user is the host or the foe
    if daPaint.hostFoeId == user_id:
        if daPaint.host_winnerId is not None or daPaint.host_loserId is not None:
            return jsonify({"msg": "Host has already made their choice."}), 400

        daPaint.host_winnerId = winner_vote
        daPaint.host_loserId = loser_vote
        print(f"Host's choice: winnerId={winner_vote}, loserId={loser_vote}")

    elif daPaint.foeId == user_id:
        if daPaint.foe_winnerId is not None or daPaint.foe_loserId is not None:
            return jsonify({"msg": "Foe has already made their choice."}), 400

        daPaint.foe_winnerId = winner_vote
        daPaint.foe_loserId = loser_vote
        print(f"Foe's choice: winnerId={winner_vote}, loserId={loser_vote}")
    else:
        return jsonify({"msg": "User is neither the host nor the foe."}), 403

    # Check for conflict
    if daPaint.host_winnerId and daPaint.foe_winnerId:
        if daPaint.host_winnerId != daPaint.foe_winnerId:
            # Conflict found, create a report
            if not img_url:
                return jsonify({"msg": "Conflict detected! Please provide an image for the report."}), 400

            conflict_report = Reports(
                user_id=user_id,
                dapaint_id=dapaint_id,
                img_url=img_url
            )
            db.session.add(conflict_report)
            print(f"Conflict report created for DaPaint ID: {dapaint_id}")

    try:
        db.session.commit()
        print("Database commit successful.")
    except Exception as e:
        print(f"Database commit failed: {e}")
        return jsonify({"msg": "Database commit failed"}), 500
    
    if daPaint.host_winnerId and daPaint.foe_winnerId and daPaint.host_winnerId == daPaint.foe_winnerId:
        winner = User.query.get(winner_vote)
        loser = User.query.get(loser_vote)
        if not winner or not loser:
            return jsonify({"msg": "Winner or loser not found"}), 404

        # Update win/loss stats
        winner.wins += 1
        winner.winstreak += 1
        loser.losses += 1
        loser.winstreak = 0
        
        daPaint.winnerId = winner.id
        daPaint.loserId = loser.id

        try:
            db.session.commit()
            print("Winner and loser stats updated.")
        except Exception as e:
            print(f"Stats update failed: {e}")
            return jsonify({"msg": "Stats update failed"}), 500

    return jsonify(daPaint.serialize()), 200

# Route to get all notifications for the logged-in user
@api.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({'error': 'User is not authenticated'}), 401

    # Query notifications for the current user
    notifications = Notifications.query.filter_by(user_id=user_id).all()

    # Serialize notifications
    notifications_list = [n.serialize() for n in notifications]

    return jsonify(notifications_list), 200


@api.route('/link-request/<string:platform>', methods=['POST'])
@jwt_required()
def send_notification(platform):
    data = request.get_json()
    participant_id=data.get("participantId")
    
    if platform not in ['instagram', 'tiktok', 'twitch', 'kick', 'youtube', 'twitter', 'facebook']:
        return jsonify({"msg": "Invalid platform specified"}), 400

    participant = User.query.get(participant_id)
    
    if not participant:
        return jsonify({"msg": "Participant not found"}), 404

    # Create a notification to prompt the user to add their social media link
    message = f"Please update your profile to add a {platform.capitalize()} link."

    notification = Notifications(user_id=participant.id, type="reminder", message=message)
    db.session.add(notification)
    db.session.commit()

    return jsonify({"msg": f"Notification sent to update {platform.capitalize()} link."}), 200

@api.route('/invitecodes', methods=['GET'])
@jwt_required()
def get_invite_codes():
    # Get the user ID from the JWT token
    user_id = get_jwt_identity()

    if not user_id:
        return jsonify({'error': 'User is not authenticated'}), 401

    # Query invite codes for the current user
    invite_codes = InviteCode.query.filter_by(inviter_id=user_id).all()

    # Serialize invite codes
    invite_codes_list = [code.serialize() for code in invite_codes]

    return jsonify(invite_codes_list), 200


@api.route('/process-invite-code', methods=['POST'])
@jwt_required()
def process_invite_code():
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    # Check if the current user exists
    if not current_user:
        return jsonify({"message": "User not found"}), 404

    # Check if the user already has an inviter
    if current_user.invited_by:
        return jsonify({"message": "Already invited", "hasInviter": True}), 200

    # Get the invite code from the request data
    data = request.get_json()
    invite_code = data.get('invite_code')

    # Check if the invite code was provided
    if not invite_code:
        return jsonify({"message": "Invite code is required"}), 400

    # Look for the invite code in the database
    invite_code_record = InviteCode.query.filter_by(code=invite_code).first()

    # Check if the invite code exists and is not the user's own code
    if not invite_code_record or invite_code_record.inviter_id == current_user_id:
        return jsonify({"message": "Invalid invite code"}), 400

    # Create an association between the current user and the invite code
    db.session.execute(invitee_association.insert().values(
        invite_code_id=invite_code_record.id,
        invitee_id=current_user_id,
        used_at=db.func.current_timestamp()
    ))

    # Commit the changes to the database
    db.session.commit()

    # Return success response
    return jsonify({
        "message": "Invite code processed successfully",
        "hasInviter": True
    }), 200