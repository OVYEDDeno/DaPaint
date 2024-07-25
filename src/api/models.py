from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(512), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    name = db.Column(db.String(200), unique=True, nullable=False)
    city = db.Column(db.String(80), nullable=False)
    zipcode = db.Column(db.Integer, nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.String(20), nullable=False)
    winstreak = db.Column(db.Integer)
    wins = db.Column(db.Integer)
    winsByKO = db.Column(db.Integer)
    winsBySub = db.Column(db.Integer)
    losses = db.Column(db.Integer)
    lossesByKO = db.Column(db.Integer)
    lossesBySub = db.Column(db.Integer)
    disqualifications = db.Column(db.Integer)
    

    dapaint_host = db.relationship('DaPaint', foreign_keys='DaPaint.hostFoeId', back_populates= 'host_user')
    dapaint_foe = db.relationship('DaPaint', foreign_keys='DaPaint.foeId',back_populates= 'foe_user' )
    dapaint_winner = db.relationship('DaPaint', foreign_keys='DaPaint.winnerId',back_populates= 'winner_user' )
    dapaint_loser = db.relationship('DaPaint', foreign_keys='DaPaint.loserId',back_populates= 'loser_user' )
    
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
            "birthday": self.birthday,
            "winstreak": self.winstreak,
            "wins": self.wins,
            "winsByKO": self.winsByKO,
            "winsBySub": self.winsBySub,
            "losses": self.losses,
            "lossesByKO": self.lossesByKO,
            "lossesBySub": self.lossesBySub,
            "disqualifications": self.disqualifications
            
        }
class DaPaint(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    hostFoeId = db.Column (db.Integer, db.ForeignKey('user.id'), nullable=False)
    foeId = db.Column (db.Integer, db.ForeignKey('user.id'), nullable=True)
    location = db.Column(db.String(100), nullable=False)
    date = db.Column(db.Date, nullable=False)
    price = db.Column(db.Integer, nullable=False)
    winnerId = db.Column (db.Integer, db.ForeignKey('user.id'), nullable=True)
    loserId = db.Column (db.Integer, db.ForeignKey('user.id'), nullable=True)

    host_user = db.relationship('User', foreign_keys=[hostFoeId], back_populates='dapaint_host')
    foe_user = db.relationship('User', foreign_keys=[foeId], back_populates='dapaint_foe')
    winner_user = db.relationship('User', foreign_keys=[winnerId], back_populates='dapaint_winner')
    loser_user = db.relationship('User', foreign_keys=[loserId], back_populates='dapaint_loser')
    
    def serialize(self):
        return {
           "hostFoeId": self.hostFoeId,
           "foeId": self.foeId,
           "location": self.location,
           "date": self.date,
           "price": self.price,
           "winnerId": self.winnerId,
           "loserId": self.loserId
        }