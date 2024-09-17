from datetime import datetime, timedelta, timezone
from flask import current_app
from flask_sqlalchemy import SQLAlchemy
import random
import string
from datetime import datetime
from sqlalchemy.orm import backref

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    name = db.Column(db.String(200), unique=True, nullable=False)
    city = db.Column(db.String(80), nullable=False)
    zipcode = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    winstreak = db.Column(db.Integer, default=0)
    wins = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
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
    usertype= db.Column(db.String(200), nullable=False, default="user")

    # Profile pic relationship
    profile_pic = db.relationship("UserImg", back_populates="user", uselist=False)

    # Notifications relationship
    notifications = db.relationship('Notifications', back_populates='user', cascade='all, delete-orphan')

    # Other relationships
    reports = db.relationship('Reports', back_populates='user', cascade='all, delete-orphan')
    dapaint_host = db.relationship('DaPaint', foreign_keys='DaPaint.hostFoeId', back_populates='host_user')
    dapaint_foe = db.relationship('DaPaint', foreign_keys='DaPaint.foeId', back_populates='foe_user')
    dapaint_winner = db.relationship('DaPaint', foreign_keys='DaPaint.winnerId', back_populates='winner_user')
    dapaint_loser = db.relationship('DaPaint', foreign_keys='DaPaint.loserId', back_populates='loser_user')

    # Invite Code relationships
    invite_code = db.relationship('InviteCode', back_populates='inviter', uselist=False, cascade='all, delete-orphan')
    invited_by = db.relationship('InviteCode', back_populates='invitees', secondary='invitee_association', uselist=False)

    # Relationships for Admin and Advertiser
    admin_profile = db.relationship('Insight', back_populates='user', uselist=False)
    advertiser_profile = db.relationship('Advertiser', back_populates='user', uselist=False)


    def __repr__(self):
        return f'<User {self.email} - Type {self.usertype}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "name": self.name,
            "city": self.city,
            "zipcode": self.zipcode,
            "phone": self.phone,
            "birthday": self.birthday.strftime("%m/%d/%Y"),
            "winstreak": self.winstreak,
            "wins": self.wins,
            "losses": self.losses,
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
            "usertype": self.usertype,
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
    completed_dapaints = db.relationship('DaPaint', back_populates='invite_code')

    def serialize(self):
        return {
            'id': self.id,
            'code': self.code,
            'inviter_id': self.inviter_id,
            'created_at': self.created_at.strftime("%m/%d/%Y %H:%M:%S"),
            'invitees': [invitee.id for invitee in self.invitees],
            'completed_dapaints': [dapaint.id for dapaint in self.completed_dapaints]
        }

invitee_association = db.Table('invitee_association',
    db.Column('invite_code_id', db.Integer, db.ForeignKey('invite_code.id'), primary_key=True),
    db.Column('invitee_id', db.Integer, db.ForeignKey('user.id'), primary_key=True),
    db.Column('used_at', db.DateTime, nullable=False, default=db.func.current_timestamp())
)
    

class DaPaint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hostFoeId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  # Host user
    foeId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)  # Foe user
    
    fitnessStyle = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    date_time = db.Column(db.DateTime(timezone=False), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    winnerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    loserId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    
    # Host user results
    host_winnerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    host_loserId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    host_winnerImg = db.Column(db.String(250), nullable=True)
    
    # Foe user results
    foe_winnerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    foe_loserId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    foe_winnerImg = db.Column(db.String(250), nullable=True)

    # Relationships for host and foe
    host_user = db.relationship('User', foreign_keys=[hostFoeId], back_populates='dapaint_host')
    foe_user = db.relationship('User', foreign_keys=[foeId], back_populates='dapaint_foe')
    winner_user = db.relationship('User', foreign_keys=[winnerId], back_populates='dapaint_winner')
    loser_user = db.relationship('User', foreign_keys=[loserId], back_populates='dapaint_loser')
    
    # Reports and dispute handling
    reports = db.relationship('Reports', back_populates='dapaint', cascade='all, delete-orphan')
    lastmodify = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=True)
    
    # Dispute tracking
    dispute_status = db.Column(db.String(50), nullable=True)  # e.g., 'pending', 'resolved'
    dispute_reported = db.Column(db.Boolean, default=False)

    #invite code
    invite_code_id = db.Column(db.Integer, db.ForeignKey('invite_code.id'), nullable=True)
    invite_code = db.relationship('InviteCode', back_populates='completed_dapaints')

    def serialize(self):
        return {
            "id": self.id,
            "hostFoeId": self.host_user.serialize(),
            "foeId": self.foe_user.serialize() if self.foe_user else "N/A",
            "fitnessStyle": self.fitnessStyle,
            "location": self.location,
            "date_time": self.date_time.strftime("%m/%d/%Y %H:%M:%S"),
            "price": self.price,
            "host_winnerId": self.host_winnerId,
            "host_loserId": self.host_loserId,
            "host_winnerImg": self.host_winnerImg,
            "foe_winnerId": self.foe_winnerId,
            "foe_loserId": self.foe_loserId,
            "foe_winnerImg": self.foe_winnerImg,
            "dispute_status": self.dispute_status,
            "dispute_reported": self.dispute_reported,
            "invite_code_id": self.invite_code_id,
        }

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
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    type = db.Column(db.String(50), nullable=False)
    message = db.Column(db.String(2000), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))
    
    user = db.relationship('User', back_populates='notifications')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
            'message': self.message,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

    @property
    def is_expired(self):
        # Check if notification is older than 24 hours
        return datetime.now(timezone.utc) - self.created_at > timedelta(hours=24)

    def delete(self):
        db.session.delete(self)
        db.session.commit()

    # Utility function to delete expired notifications
    def delete_expired_notifications():
        expired_notifications = Notifications.query.filter(
            Notifications.created_at < datetime.now(timezone.utc) - timedelta(hours=24)
        ).all()
        for notification in expired_notifications:
            db.session.delete(notification)
        db.session.commit()

    # You can run this function periodically using a background task    


class Reports(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    dapaint_id = db.Column(db.Integer, db.ForeignKey('da_paint.id'), nullable=False)  # Corrected foreign key reference
    img_url = db.Column(db.String(250), nullable=False)
    vid_url = db.Column(db.String(250), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='reports')
    dapaint = db.relationship('DaPaint', back_populates='reports')

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'dapaint_id': self.dapaint_id,
            'img_url': self.img_url,
            'vid_url': self.vid_url,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
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
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    permissions = db.Column(db.String(200), nullable=False)  # Custom permissions for admins
    is_active = db.Column(db.Boolean(), nullable=False, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationship back to User
    user = db.relationship('User', back_populates='admin_profile')

    # Admin statistics fields
    total_users = db.Column(db.Integer, default=0)
    daily_active_users = db.Column(db.Integer, default=0)
    sports_market_percentage = db.Column(db.Float, default=0.0)
    matches_per_day = db.Column(db.Integer, default=0)
    number_of_winners = db.Column(db.Integer, default=0)
    number_of_losers = db.Column(db.Integer, default=0)
    inactive_users = db.Column(db.Integer, default=0)
    
    def __repr__(self):
        return f'<Insight {self.user.name}>'
    
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "permissions": self.permissions,
            "is_active": self.is_active,
            "created_at": self.created_at.strftime("%Y-%m-%d %H:%M:%S"),
            "total_users": self.total_users,
            "daily_active_users": self.daily_active_users,
            "sports_market_percentage": self.sports_market_percentage,
            "matches_per_day": self.matches_per_day,
            "number_of_winners": self.number_of_winners,
            "number_of_losers": self.number_of_losers,
            "inactive_users": self.inactive_users
        }
    
    def update_statistics(self):
        # Example method to update admin statistics
        self.total_users = User.query.count()
        self.daily_active_users = User.query.filter(
            User.last_login >= datetime.utcnow() - timedelta(days=1)
        ).count()
        self.sports_market_percentage = self.calculate_sports_market_percentage()
        self.matches_per_day = DaPaint.query.filter(
            DaPaint.date_time >= datetime.utcnow() - timedelta(days=1)
        ).count()
        self.number_of_winners = DaPaint.query.filter(
            DaPaint.winnerId.isnot(None)
        ).count()
        self.number_of_losers = DaPaint.query.filter(
            DaPaint.loserId.isnot(None)
        ).count()
        self.inactive_users = self.total_users - self.daily_active_users
        db.session.commit()
    
    def calculate_sports_market_percentage(self):
        # Implement your logic to calculate the sports market percentage
        # This is just a placeholder example
        total_sports = DaPaint.query.count()
        return (total_sports / self.total_users) * 100 if self.total_users else 0

# class Ticket(db.Model):
#     __tablename__ = 'tickets'
#     id = db.Column(db.Integer, primary_key=True)
#     user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
#     dapaint_id = db.Column(db.Integer, db.ForeignKey('dapaint.id'), nullable=False)  # Connect to DaPaint table
#     event_name = db.Column(db.String(200), nullable=False)
#     event_date = db.Column(db.Date, nullable=False)
#     purchase_date = db.Column(db.DateTime, default=db.func.current_timestamp(), nullable=False)
#     price = db.Column(db.Float, nullable=False)
#     ticket_status = db.Column(db.String(50), default='active')  # active, canceled, refunded, etc.

#     user = db.relationship('User', back_populates='tickets')
#     dapaint_event = db.relationship('DaPaint', back_populates='tickets')  # Relating to DaPaint events

#     def __repr__(self):
#         return f'<Ticket {self.event_name} - {self.user_id}>'

# User.tickets = db.relationship('Ticket', order_by=Ticket.id, back_populates='user')
# DaPaint.tickets = db.relationship('Ticket', order_by=Ticket.id, back_populates='dapaint_event')
class Advertiser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    company_name = db.Column(db.String(200), nullable=False)  # Example field for advertisers
    ad_budget = db.Column(db.Float, default=0.0)  # Budget for ads

    # Relationship back to User
    user = db.relationship('User', back_populates='advertiser_profile')

    def __repr__(self):
        return f'<Advertiser {self.user.name} - {self.company_name}>'

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "company_name": self.company_name,
            "ad_budget": self.ad_budget
        }
    name = db.Column(db.String(100), nullable=False)
    contact_email = db.Column(db.String(100), nullable=False, unique=True)
    budget = db.Column(db.Float, nullable=False)
    targeting_criteria = db.Column(db.JSON, nullable=True)  # JSON field to store targeting criteria

# class AdCampaign(db.Model):
#     __tablename__ = 'ad_campaigns'
#     id = db.Column(db.Integer, primary_key=True)
#     advertiser_id = db.Column(db.Integer, db.ForeignKey('advertisers.id'), nullable=False)
#     name = db.Column(db.String(100), nullable=False)
#     start_date = db.Column(db.Date, nullable=False)
#     end_date = db.Column(db.Date, nullable=False)
#     budget = db.Column(db.Float, nullable=False)
#     ad_content = db.Column(db.Text, nullable=False)
    
#     advertiser = db.relationship('Advertiser', back_populates='ad_campaigns')
    
#     def __repr__(self):
#         return f'<AdCampaign {self.name}>'

# Advertiser.ad_campaigns = db.relationship('AdCampaign', order_by=AdCampaign.id, back_populates='advertiser')
