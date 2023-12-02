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

# models.py

class PantryItem(db.Model):
    __tablename__ = 'pantry_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    ingredient_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50))
    category = db.Column(db.String(100)) 
    favorite = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "ingredient_name": self.ingredient_name,
            "quantity": self.quantity,
            "unit": self.unit,
            "category": self.category,
            "favorite": self.favorite
        }


