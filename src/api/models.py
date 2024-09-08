from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timezone

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(512), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    name = db.Column(db.String(200), unique=True, nullable=False)
    city = db.Column(db.String(80), nullable=False)
    zipcode = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.Date, nullable=False)
    winstreak = db.Column(db.Integer, default=0)
    wins = db.Column(db.Integer, default=0)
    # winsByKO = db.Column(db.Integer, default=0)
    # winsBySub = db.Column(db.Integer, default=0)
    losses = db.Column(db.Integer, default=0)
    # lossesByKO = db.Column(db.Integer, default=0)
    # lossesBySub = db.Column(db.Integer, default=0)
    disqualifications = db.Column(db.Integer, default=0)
    disqualifications = db.relationship('UserDisqualification', back_populates='user')

    profile_pic = db.relationship("UserImg", back_populates="user", uselist=False)
    notifications = db.relationship('Notifications', back_populates='user', cascade='all, delete-orphan')
    reports = db.relationship('Reports', back_populates='user', cascade='all, delete-orphan')

    dapaint_host = db.relationship('DaPaint', foreign_keys='DaPaint.hostFoeId', back_populates='host_user')
    dapaint_foe = db.relationship('DaPaint', foreign_keys='DaPaint.foeId', back_populates='foe_user')
    dapaint_winner = db.relationship('DaPaint', foreign_keys='DaPaint.winnerId', back_populates='winner_user')
    dapaint_loser = db.relationship('DaPaint', foreign_keys='DaPaint.loserId', back_populates='loser_user')
    invite_codes = db.relationship('InviteCode', back_populates='user', cascade='all, delete-orphan')
    # user_disqualification = db.relationship('UserDisqualification', back_populates='user')

    def __repr__(self):
        return f'<User {self.email}>'

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
            "winsByKO": self.winsByKO,
            "winsBySub": self.winsBySub,
            "lossesByKO": self.lossesByKO,
            "lossesBySub": self.lossesBySub,
            "disqualifications": self.disqualifications,
            "profile_pic": self.profile_pic.serialize() if self.profile_pic else None
        }

class InviteCode(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    code = db.Column(db.String(10), unique=True, nullable=False)
    is_used = db.Column(db.Boolean, default=False, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    user = db.relationship('User', back_populates='invite_codes')

    def __repr__(self):
        return f'<InviteCode {self.code}>'

    def serialize(self):
        return {
            'id': self.id,
            'code': self.code,
            'is_used': self.is_used,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

class DaPaint(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    hostFoeId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    foeId = db.Column(db.Integer, db.ForeignKey('user.id'), unique=True, nullable=True)
    fitnessStyle = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    date_time = db.Column(db.DateTime(timezone=False), nullable=False)
    price = db.Column(db.Integer, nullable=False)
    winnerId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)
    loserId = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=True)    
    winnerImg = db.Column(db.String(250), nullable=True)
    loserImg = db.Column(db.String(250), nullable=True)

    host_user = db.relationship('User', foreign_keys=[hostFoeId], back_populates='dapaint_host')
    foe_user = db.relationship('User', foreign_keys=[foeId], back_populates='dapaint_foe')
    winner_user = db.relationship('User', foreign_keys=[winnerId], back_populates='dapaint_winner')
    loser_user = db.relationship('User', foreign_keys=[loserId], back_populates='dapaint_loser')
    
    reports = db.relationship('Reports', back_populates='dapaint', cascade='all, delete-orphan')  

    def serialize(self):
        return {
            "id": self.id,
            "hostFoeId": self.host_user.serialize(),
            "foeId": self.foe_user.serialize() if self.foe_user is not None else "N/A",
            "fitnessStyle": self.fitnessStyle,
            "location": self.location,
            "date_time": self.date_time.strftime("%m/%d/%Y %H:%M:%S"),
            "price": self.price,
            "winnerId": self.winnerId,
            "winnerUser": self.winner_user.serialize() if self.winner_user else "N/A",
            "loserId": self.loserId,
            "loserUser": self.loser_user.serialize() if self.loser_user else "N/A",
            "winnerImg": self.winnerImg,
            "loserImg": self.loserImg
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
    user=db.relationship('User', back_populates='notifications')
    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'type': self.type,
           'message': self.message,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

class Reports(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    dapaint_id = db.Column(db.Integer, db.ForeignKey('da_paint.id'), nullable=False)  # Corrected foreign key reference
    img_url = db.Column(db.String(250), nullable=False)
    vid_url = db.Column(db.String(250), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.now(timezone.utc))

    user = db.relationship('User', back_populates='reports')
    dapaint = db.relationship('DaPaint', back_populates='reports')  # Added back_populates to establish a bidirectional relationship

    def serialize(self):
        return {
            'id': self.id,
            'user_id': self.user_id,
            'dapaint_id': self.dapaint_id,
            'img_url': self.img_url,
            'vid_url': self.vid_url,
            'created_at': self.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }


class AdminUser(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(512), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False, default=True)
    name = db.Column(db.String(200), unique=True, nullable=False)
    rank = db.Column(db.String(50), nullable=True)

    # New columns
    num_users = db.Column(db.Integer, nullable=True, default=0)
    daily_active_users = db.Column(db.Integer, nullable=True, default=0)
    market_share = db.Column(db.Float, nullable=True, default=0.0)  # Percentage
    matches_per_day = db.Column(db.Integer, nullable=True, default=0)
    winners_per_day = db.Column(db.Integer, nullable=True, default=0)
    losers_per_day = db.Column(db.Integer, nullable=True, default=0)
    inactive_users_per_day = db.Column(db.Integer, nullable=True, default=0)

    # AdminUser moderation    
    disqualified_users = db.relationship('UserDisqualification', backref='admin')  # Establish relationship


    def serialize(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'rank': self.rank,
            'num_users': self.num_users,
            'daily_active_users': self.daily_active_users,
            'market_share': self.market_share,
            'matches_per_day': self.matches_per_day,
            'winners_per_day': self.winners_per_day,
            'losers_per_day': self.losers_per_day,
            'inactive_users_per_day': self.inactive_users_per_day,
        }

class UserDisqualification(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    admin_id = db.Column(db.Integer, db.ForeignKey('adminUser.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    reason = db.Column(db.String(500), nullable=False)
    disqualified_at = db.Column(db.DateTime, default=datetime.utcnow)
        
    user = db.relationship('User', back_populates='disqualifications')
    admin_user_id = db.Column(db.Integer, db.ForeignKey('admin_user.id'))  # Add foreign key


    def serialize(self):
        return {
            'id': self.id,
            'admin_id': self.admin_id,
            'user_id': self.user_id,
            'reason': self.reason,
            'disqualified_at': self.disqualified_at.strftime("%Y-%m-%d %H:%M:%S"),
        }

