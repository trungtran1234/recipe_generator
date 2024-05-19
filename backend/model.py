from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from uuid import uuid4
from __init__ import db

#for hashing
def get_uuid():
    return uuid4().hex

#User model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.String(32), unique = True, primary_key=True, default=get_uuid)
    username = db.Column(db.String(32), unique=True, nullable=False)
    password = db.Column(db.Text, nullable=False)

#Pantry model
class PantryItem(db.Model):
    __tablename__ = 'pantry_items'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    ingredient_name = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Float, nullable=False)
    unit = db.Column(db.String(50))
    category = db.Column(db.String(100)) 
    favorite = db.Column(db.Boolean, default=False)
    selected = db.Column(db.Boolean, default=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "ingredient_name": self.ingredient_name,
            "quantity": self.quantity,
            "unit": self.unit,
            "category": self.category,
            "favorite": self.favorite,
            "selected": self.selected
        }

#Recipe model
class Recipe(db.Model):
    __tablename__ = 'recipes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    recipe_data = db.Column(db.JSON, nullable=False)
    favorited = db.Column(db.Boolean, default=False)
    recipe_uri = db.Column(db.String(255), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "recipe_data": self.recipe_data,
            "favorited": self.favorited,
            "recipe_uri": self.recipe_uri

        }
#Restriction model
class Restriction(db.Model):
    __tablename__ = 'restrictions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    restriction = db.Column(db.JSON, nullable=False)
    user = db.relationship('User', backref=db.backref('restrictions', lazy=True))

#Nutrition goal model
class NutritionGoal(db.Model):
    __tablename__ = 'nutrition_goals'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    last_updated = db.Column(db.DateTime, default=datetime.utcnow)
    weight = db.Column(db.Integer)
    calories = db.Column(db.Integer)
    carbs = db.Column(db.Integer)
    fat = db.Column(db.Integer)
    protein = db.Column(db.Integer)
    sugar = db.Column(db.Integer)
    sodium = db.Column(db.Integer)
    cholesterol = db.Column(db.Integer)
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "weight": self.weight,
            "calories": self.calories,
            "carbs": self.carbs,
            "fat": self.fat,
            "protein": self.protein,
            "sugar": self.sugar,
            "sodium": self.sodium,
            "cholesterol": self.cholesterol,
            "last_updated": self.last_updated.strftime("%Y-%m-%d")
        }
    
#Daily intake model
class DailyIntake(db.Model):
    __tablename__ = 'daily_intakes'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.String(32), db.ForeignKey('users.id'))
    weight = db.Column(db.Integer)
    date = db.Column(db.Date)
    calories = db.Column(db.Integer)
    carbs = db.Column(db.Integer)
    fat = db.Column(db.Integer)
    protein = db.Column(db.Integer)
    sugar = db.Column(db.Integer)
    sodium = db.Column(db.Integer)
    cholesterol = db.Column(db.Integer)
    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "date": self.date.strftime("%Y-%m-%d") if self.date else None,
            "calories": self.calories,
            "carbs": self.carbs,
            "fat": self.fat,
            "protein": self.protein,
            "sugar": self.sugar,
            "sodium": self.sodium,
            "cholesterol": self.cholesterol
        }



