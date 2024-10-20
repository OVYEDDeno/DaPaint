import os
from flask_admin import Admin
from .models import db, User, DaPaint, UserImg, Reports, InviteCode, Ticket, Orders, Notifications, Insight, UserDisqualification, Feedback
from flask_admin.contrib.sqla import ModelView

def setup_admin(app):
    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
    admin = Admin(app, name='DAPAINT Admin', template_mode='bootstrap3')

    
    # Add your models here, for example this is how we add a the User model to the admin
    admin.add_view(ModelView(User, db.session))
    admin.add_view(ModelView(DaPaint, db.session))
    admin.add_view(ModelView(InviteCode, db.session))
    admin.add_view(ModelView(Ticket, db.session))
    admin.add_view(ModelView(UserImg, db.session))
    admin.add_view(ModelView(Reports, db.session))
    admin.add_view(ModelView(Notifications, db.session))
    admin.add_view(ModelView(Insight, db.session))
    admin.add_view(ModelView(Orders, db.session))
    admin.add_view(ModelView(UserDisqualification, db.session))
    admin.add_view(ModelView(Feedback, db.session))

    # You can duplicate that line to add mew models
    # admin.add_view(ModelView(YourModelName, db.session))