from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from __init__ import db



def get_uuid():
    return uuid4().hex

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), unique = True, primary_key=True, default=get_uuid)
    username = db.Column(db.String(32), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

