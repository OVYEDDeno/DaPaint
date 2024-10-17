from datetime import datetime, timedelta, timezone
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.orm import backref
from flask import current_app
import random, string, qrcode, uuid, os

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    dapaint_unlocked = db.Column(db.Boolean, default=False, nullable=True) #Update to False before launch
    name = db.Column(db.String(200), unique=True, nullable=False)
    city = db.Column(db.String(80), nullable=False)
    zipcode = db.Column(db.String(10), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    winstreak = db.Column(db.Integer, default=0)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    disqualifications = db.Column(db.Integer, default=0)
    disqualifications = db.relationship('UserDisqualification', back_populates='user')

    # Social Media Links
    instagram_url = db.Column(db.String(200), nullable=True)
    tiktok_url = db.Column(db.String(200), nullable=True)
    twitch_url = db.Column(db.String(200), nullable=True)
    kick_url = db.Column(db.String(200), nullable=True)
    youtube_url = db.Column(db.String(200), nullable=True)
    twitter_url = db.Column(db.String(200), nullable=True)
    facebook_url = db.Column(db.String(200), nullable=True)
    password = db.Column(db.String(512), nullable=False)
    
    # User Type
    # user_type = db.Column(db.String(50), default='user')
    # Relationships for Admin and Advertiser
    admin_profile = db.relationship('Insight', back_populates='user', uselist=False, cascade='all, delete-orphan')
    advertiser_profile = db.relationship('Advertiser', back_populates='user', uselist=False, cascade='all, delete-orphan')

    # Profile pic relationship
    profile_pic = db.relationship("UserImg", back_populates="user", uselist=False, cascade='all, delete-orphan')
    # user_pay = db.relationship("UserPay", back_populates="user", cascade='all, delete-orphan')

    orders = db.relationship("Orders", back_populates="user")
    tickets = db.relationship('Ticket', back_populates='user', lazy='dynamic')


    # Notifications relationship
    notifications = db.relationship('Notifications', back_populates='user', cascade='all, delete-orphan')
    
     # Feedback relationship
    feedback = db.relationship('Feedback', back_populates='user', cascade='all, delete-orphan')

    # Other relationships
    reports = db.relationship('Reports', back_populates='user', uselist=False, cascade='all, delete-orphan')
    dapaint_host = db.relationship('DaPaint', foreign_keys='DaPaint.hostFoeId', back_populates='host_user', cascade='all, delete-orphan')
    dapaint_foe = db.relationship('DaPaint', foreign_keys='DaPaint.foeId', back_populates='foe_user', cascade='all, delete-orphan')
    dapaint_winner = db.relationship('DaPaint', foreign_keys='DaPaint.winnerId', back_populates='winner_user', cascade='all, delete-orphan')
    dapaint_loser = db.relationship('DaPaint', foreign_keys='DaPaint.loserId', back_populates='loser_user', cascade='all, delete-orphan')

    # Invite Code relationships
    invite_code = db.relationship('InviteCode', back_populates='inviter', uselist=False, cascade='all, delete-orphan')
    invited_by = db.relationship('InviteCode', back_populates='invitees', secondary='invitee_association', uselist=False)


    def __repr__(self):
        return f'<User {self.email}'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "dapaint_unlocked": self.dapaint_unlocked,
            "name": self.name,
            "city": self.city,
            "zipcode": self.zipcode,
            "phone": self.phone,
            "birthday": self.birthday.strftime("%m/%d/%Y"),
            "winstreak": self.winstreak,
            "wins": self.wins,
            "losses": self.losses,
            "disqualifications": self.disqualifications,
            "disqualifications": [dq.serialize() for dq in self.disqualifications],
            "profile_pic": self.profile_pic.serialize() if self.profile_pic else None,           
            "notifications": [n.serialize() for n in self.notifications],
            "instagram_url": self.instagram_url,
            "tiktok_url": self.tiktok_url,
            "twitch_url": self.twitch_url,
            "kick_url": self.kick_url,
            "youtube_url": self.youtube_url,
            "twitter_url": self.twitter_url,
            "facebook_url": self.facebook_url,
            "invite_code": self.invite_code.serialize() if self.invite_code else None,
            "invited_by": self.invited_by.serialize() if self.invited_by else None,
            # "user_type": self.user_type,
            "admin_profile": self.admin_profile.serialize() if self.admin_profile else None,
            "advertiser_profile": self.advertiser_profile.serialize() if self.advertiser_profile else None,

        }
        

class InviteCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), unique=True, nullable=False)
    inviter_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    # Relationships
    inviter = db.relationship('User', back_populates='invite_code', uselist=False)
    invitees = db.relationship('User', secondary='invitee_association', back_populates='invited_by')

    # Relationship to track completed DaPaints
    # completed_dapaints = db.relationship('DaPaint', back_populates='invite_code')

    def serialize(self):
        return {
            'id': self.id,
            'code': self.code,
            'inviter_id': self.inviter_id,
            'created_at': self.created_at.strftime("%m/%d/%Y %H:%M:%S"),
            'invitees': [invitee.id for invitee in self.invitees],
             'completed_dapaints': [
            {
                'invitee_id': invitee.id,
                'wins': invitee.wins,
                'losses': invitee.losses
            } 
            for invitee in self.invitees 
            if invitee.wins > 0 or invitee.losses > 0
        ]
        }
        

invitee_association = db.Table('invitee_association',
    db.Column('invite_code_id', db.Integer, db.ForeignKey('invite_code.id'), primary_key=True),
    db.Column('invitee_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('used_at', db.DateTime, nullable=False, default=db.func.current_timestamp())
)
    

class DaPaint(db.Model):
    __tablename__ = 'dapaint'
    id = db.Column(db.Integer, primary_key=True)
    hostFoeId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Host user
    foeId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Foe user

    fitnessStyle = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    date_time = db.Column(db.DateTime(timezone=False), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    winnerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    loserId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    isBoosted = db.Column(db.Boolean, nullable=True)

    # # Host user results
    host_winnerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    host_loserId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    host_winnerImg = db.Column(db.String(250), nullable=True)

    # # Foe user results
    foe_winnerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    foe_loserId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    foe_winnerImg = db.Column(db.String(250), nullable=True)

    # Relationships for host and foe
    host_user = db.relationship('User', foreign_keys=[hostFoeId], back_populates='dapaint_host')
    foe_user = db.relationship('User', foreign_keys=[foeId], back_populates='dapaint_foe')
    winner_user = db.relationship('User', foreign_keys=[winnerId], back_populates='dapaint_winner')
    loser_user = db.relationship('User', foreign_keys=[loserId], back_populates='dapaint_loser')

    # Reports handling
    reports = db.relationship('Reports', back_populates='dapaint', cascade='all, delete-orphan')
    lastmodify = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=True)

    # Dispute tracking
    dispute_status = db.Column(db.String(50), nullable=True)  # e.g., 'pending', 'resolved'
    dispute_reported = db.Column(db.Boolean, default=False)

    # Relationship with tickets (single relationship definition)
    # user_tickets = db.relationship('Ticket', back_populates='dapaint', cascade='all, delete-orphan')
    # user_pay = db.relationship("UserPay", back_populates="dapaint", cascade='all, delete-orphan')
    tickets = db.relationship('Ticket', back_populates='dapaint')


    def serialize(self):
        return {
            "id": self.id,
            "hostFoeId": self.host_user.serialize(),
            "foeId": self.foe_user.serialize() if self.foe_user else "N/A",
            "fitnessStyle": self.fitnessStyle,
            "location": self.location,
            "date_time": self.date_time.strftime("%m/%d/%Y %H:%M:%S"),
            "price": self.price,
            # "isBoosted" : self.isBoosted,
            "host_winnerId": self.host_winnerId,
            "host_loserId": self.host_loserId,
            "host_winnerImg": self.host_winnerImg,
            "foe_winnerId": self.foe_winnerId,
            "foe_loserId": self.foe_loserId,
            "foe_winnerImg": self.foe_winnerImg,
            "dispute_status": self.dispute_status,
            "dispute_reported": self.dispute_reported,
            "winnerId": self.winnerId,
            "loserId": self.loserId,
            "reports": [report.serialize() for report in self.reports],
            "lastmodify": self.lastmodify,
        }

# class Orders(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
#     user = db.relationship("User", back_populates="orders")
#     paypal_id = db.Column(db.String(500))
#     tickets = db.relationship('Ticket', backref='order', lazy=True)
#     type_of_order = db.Column(db.String(20))
#     fufilled = db.Column(db.Boolean, default=False)


#     def serialize(self):
#         return {
#             "id": self.id,
#             "user_id": self.user_id,
#             "paypal_id": self.paypal_id
#         }

class UserImg(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    public_id = db.Column(db.String(500), nullable=False, unique=True)
    image_url = db.Column(db.String(500), nullable=False, unique=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False, unique=True)
    user = db.relationship("User", back_populates="profile_pic", uselist=False)

    def __init__(self, public_id, image_url, user_id):
        self.public_id = public_id
        self.image_url = image_url.strip()
        self.user_id = user_id

    def serialize(self):
        return {
            "id": self.id,
            "image_url": self.image_url
        }
    

class Notifications(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=db.func.current_timestamp())

    user = db.relationship('User', back_populates='notifications')

    def delete_expired(self):
        expiry_date = datetime.now(timezone.utc) - timedelta(hours=24)
        if self.created_at < expiry_date:
            db.session.delete(self)

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'message': self.message,
            'created_at': self.created_at.strftime("%m/%d/%Y %H:%M:%S")
        }

class Reports(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    dapaint_id = db.Column(db.Integer, db.ForeignKey('dapaint.id'), nullable=False)  # Corrected foreign key reference
    host_winnerImg = db.Column(db.String(500),  nullable=False) 
    foe_winnerImg = db.Column(db.String(500), nullable=False) 
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    resolved = db.Column(db.Boolean, default=False)
    resolved_at = db.Column(db.DateTime, nullable=True)

    # Relationships with explicit foreign_keys to resolve ambiguity
    dapaint = db.relationship('DaPaint', back_populates='reports', foreign_keys=[dapaint_id])

    user = db.relationship('User', back_populates='reports')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'dapaint_id': self.dapaint_id,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            'resolved': self.resolved,
            'resolved_at': self.resolved_at.strftime("%Y-%m-%d %H:%M:%S") if self.resolved else None
        }


class UserDisqualification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reason = db.Column(db.String(500), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    user = db.relationship('User', back_populates='disqualifications')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'reason': self.reason,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

class Insight(db.Model):
    __tablename__ = 'insight' 
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    
    # Use Enum for permissions
    # permissions = db.Column(db.Enum('Full Access', 'Can Edit', 'Can View/Comment', name='permissions_enum'), nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship back to User
    user = db.relationship('User', back_populates='admin_profile')

    # Admin statistics fields
    total_users = db.Column(db.Integer, default=0)
    daily_active_users = db.Column(db.Integer, default=0)
    winstreak_winners = db.Column(db.Integer, default=0)
    most_popular_sport = db.Column(db.String(50), nullable=True)
    sports_market_percentage = db.Column(db.Float, default=0.0)
    matches_per_day = db.Column(db.Integer, default=0)
    inactive_users = db.Column(db.Integer, default=0)

    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "permissions": self.permissions,
            "is_active": self.is_active,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "total_users": self.total_users,
            "daily_active_users": self.daily_active_users,
            "winstreak_winners": self.winstreak_winners,
            "most_popular_sport": self.most_popular_sport,
            "sports_market_percentage": self.sports_market_percentage,
            "matches_per_day": self.matches_per_day,
            "inactive_users": self.inactive_users
        }


# class Ticket(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
#     order_id = db.Column(db.Integer, db.ForeignKey('order.id'), nullable=False)
#     dapaint_id = db.Column(db.Integer, db.ForeignKey('dapaint.id'), nullable=False)
#     already_scanned = db.Column(db.Boolean, default=False)


#     qr_code_path = db.Column(db.String(255), nullable=True)  # Path to the QR code image
#     ticket_code = db.Column(db.String(10), unique=True, nullable=True)  # Unique code for the ticket


#     user = db.relationship('User', backref='tickets', lazy=True)
#     order = db.relationship('Order', backref='tickets', lazy=True)
#     dapaint = db.relationship('DaPaint', back_populates='tickets')

#     def serialize(self):
#         return {
#             'id': self.id,
#             'dapaint_id': self.dapaint_id,
#             'user_id': self.user_id,
#             'already_scanned': self.already_scanned,
#             'qr_code_path': self.qr_code_path,  # Include QR code path in the serialized output
#             'ticket_code': self.ticket_code,  # Include ticket code
#         }

#     def generate_ticket_code(self):
#         # Generate a unique ticket code (implement your logic here)
#         self.ticket_code = str(uuid.uuid4())[:10]  # Simple UUID example

#     def generate_qr_code(self):
#         if self.ticket_code:
#             qr = qrcode.QRCode(
#                 version=1,
#                 error_correction=qrcode.constants.ERROR_CORRECT_L,
#                 box_size=10,
#                 border=4,
#             )
#             qr.add_data(self.ticket_code)
#             qr.make(fit=True)

#             img = qr.make_image(fill='black', back_color='white')
#             qr_code_directory = 'path/to/qrcodes'  # Specify your path
#             if not os.path.exists(qr_code_directory):
#                 os.makedirs(qr_code_directory)
#             qr_code_filename = os.path.join(qr_code_directory, f'{self.ticket_code}.png')
#             img.save(qr_code_filename)
#             self.qr_code_path = qr_code_filename

# # User.tickets = db.relationship('Ticket', order_by=Ticket.id, back_populates='user')

class Orders(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    user = db.relationship("User", back_populates="orders")
    paypal_id = db.Column(db.String(500), unique=True)
    tickets = db.relationship('Ticket', backref='order', lazy=True)
    type_of_order = db.Column(db.String(20))
    fulfilled = db.Column(db.Boolean, default=False)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "paypal_id": self.paypal_id,
            "type_of_order": self.type_of_order,
            "fulfilled": self.fulfilled
        }

class Ticket(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    order_id = db.Column(db.Integer, db.ForeignKey('orders.id'), nullable=False)
    dapaint_id = db.Column(db.Integer, db.ForeignKey('dapaint.id'), nullable=False)
    already_scanned = db.Column(db.Boolean, default=False)
    qr_code_path = db.Column(db.String(255), nullable=True)
    ticket_code = db.Column(db.String(10), unique=True, nullable=False)

    user = db.relationship('User', back_populates='tickets')
    dapaint = db.relationship('DaPaint', back_populates='tickets')

    def serialize(self):
        return {
            'id': self.id,
            'dapaint_id': self.dapaint_id,
            'user_id': self.user_id,
            'already_scanned': self.already_scanned,
            'qr_code_path': self.qr_code_path,
            'ticket_code': self.ticket_code,
        }

    def generate_ticket_code(self):
        self.ticket_code = str(uuid.uuid4())[:10]

    def generate_qr_code(self):
        if self.ticket_code:
            qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
            qr.add_data(self.ticket_code)
            qr.make(fit=True)

            img = qr.make_image(fill='black', back_color='white')
            qr_code_directory = 'static/qrcodes'
            if not os.path.exists(qr_code_directory):
                os.makedirs(qr_code_directory)
            qr_code_filename = os.path.join(qr_code_directory, f'{self.ticket_code}.png')
            img.save(qr_code_filename)
            self.qr_code_path = f'/static/qrcodes/{self.ticket_code}.png'


class Advertiser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company_name = db.Column(db.String(200), nullable=False)
    contact_email = db.Column(db.String(100), nullable=False, unique=True)
    
    # Moved ad_budget to AdCampaign
    ad_budget = db.Column(db.Float, default=0.0)
    targeting_criteria = db.Column(db.JSON, nullable=True)  # To target users based on location data

    # Relationship back to User
    user = db.relationship('User', back_populates='advertiser_profile')

    # Ad campaigns relationship
    ad_campaigns = db.relationship('AdCampaign', back_populates='advertiser', cascade='all, delete-orphan')

    def __repr__(self):
        return f'<Advertiser {self.company_name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "company_name": self.company_name,
            "contact_email": self.contact_email,
            "ad_budget": self.ad_budget,
            "targeting_criteria": self.targeting_criteria,
            "ad_campaigns": [ac.serialize() for ac in self.ad_campaigns]
        }

class AdCampaign(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    advertiser_id = db.Column(db.Integer, db.ForeignKey('advertiser.id'), nullable=False)
    campaign_name = db.Column(db.String(200), nullable=False)
    budget = db.Column(db.Float, nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date, nullable=False)
    
    # Metrics for performance tracking
    views = db.Column(db.Integer, default=0)
    clicks = db.Column(db.Integer, default=0)
    
    # Relationship back to Advertiser
    advertiser = db.relationship('Advertiser', back_populates='ad_campaigns')

    def __repr__(self):
        return f'<AdCampaign {self.campaign_name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "advertiser_id": self.advertiser_id,
            "campaign_name": self.campaign_name,
            "budget": self.budget,
            "start_date": self.start_date.strftime("%Y-%m-%d"),
            "end_date": self.end_date.strftime("%Y-%m-%d"),
            "views": self.views,
            "clicks": self.clicks
        }

Advertiser.ad_campaigns = db.relationship('AdCampaign', order_by=AdCampaign.id, back_populates='advertiser')

class Feedback(db.Model):
    id = db.Column(db.Integer, primary_key=True)    
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    feedback_text = db.Column(db.String(500), nullable=False)
    rating = db.Column(db.Integer, nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship to User model
    user = db.relationship('User', back_populates='feedback')
    
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'feedback_text': self.feedback_text,
            'rating': self.rating,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }
    