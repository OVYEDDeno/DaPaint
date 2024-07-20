from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    name = db.Column(db.String(200), unique=True, nullable=False)
    city = db.Column(db.String(80), nullable=False)
    zipcode = db.Column(db.Integer(10), nullable=False)
    phone = db.Column(db.String(20), nullable=False)
    birthday = db.Column(db.String(20), nullable=False)
    winstreak = db.Column(db.Integer(1000))
    wins = db.Column(db.Integer(1000))
    winsByKO = db.Column(db.Integer(1000))
    winsBySub = db.Column(db.Integer(1000))
    losses = db.Column(db.Integer(1000))
    lossesByKO = db.Column(db.Integer(1000))
    lossesBySub = db.Column(db.Integer(1000))
    disqualifications = db.Column(db.Integer(1000))
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
            # do not serialize the password, its a security breach
        }
class DaPaint(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    hostFoeId = db.Relationship ("User", back_populates="dapaint")
    foeId = db.Relationship ("User", back_populates="dapaint")
    location = db.Column(db.String(1000), nullable=False)
    date = db.Column(db.String(20), nullable=False)
    time = db.Column(db.String(20), nullable=False)
    price = db.Column(db.Integer(10), nullable=False)
    winnerID = db.Relationship ("User", back_populates="dapaint")
    losserID = db.Relationship ("User", back_populates="dapaint")
    
    def serialize(self):
        return {
           "hostFoeId": self.hostFoeId,
           "foeId": self.foeId,
           "location": self.location,
           "date": self.date,
           "time": self.time,
           "price": self.price,
           "winnerId": self.winnerid,
           "losserId": self.losserId
        }