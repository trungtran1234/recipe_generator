from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_current_user, get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
import mysqlx
from model import PantryItem, db, User
from __init__ import app
from werkzeug.security import generate_password_hash, check_password_hash


@app.route("/mainpage", methods=["GET", "POST"])
@jwt_required()
def home():
    return "Welcome to Gusto.AI!"

@app.route('/token', methods=["POST"])
def create_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email != "test" or password != "test":
        return {"msg": "Wrong email or password"}, 401

    access_token = create_access_token(identity=email)
    response = {"access_token":access_token}
    return response

#register route
@app.route("/register", methods=["POST", "GET"])
def register():
    username = request.json["username"] #get username from request
    password = request.json["password"] #get password from request

    user_exists = User.query.filter_by(username=username).first() #gets username from database

    if user_exists: #if username exists in database, return error
        return jsonify({"message": "User already exists"}), 402
    
    hashed_password = generate_password_hash(password) #hash password
    new_user = User(username=username, password=hashed_password) #create new user
    db.session.add(new_user) #add new user to table
    db.session.commit() #commit changes

    return jsonify({"id": new_user.id, "username": new_user.username})

#login route
@app.route("/login", methods=["POST"])
def login():
    username = request.json["username"]
    password = request.json["password"]

    user = User.query.filter_by(username=username).first() #get username from database
    if user is None: #if username does not exist in database, return error
        return jsonify({"message": "Invalid username" }), 400
    
    if not check_password_hash(user.password, password): #if password does not match with user's password, return error
        return jsonify({"message": "Invalid password", "error" : user.password }), 401
        
    access_token = create_access_token(identity=user.id) #create access token
    return jsonify(access_token = access_token), 200

@app.route("/logout", methods=["POST"])
@jwt_required()
def logout():
    response = jsonify({"msg": "logout successful"})
    unset_jwt_cookies(response)
    return response

#add ingredient
@app.route('/pantry', methods=['POST'])
@jwt_required()
def add_pantry_item():
    data = request.json
    current_user_id = get_jwt_identity()

    new_item = PantryItem(
        user_id=current_user_id,
        ingredient_name=data['ingredient_name'],
        quantity=data['quantity'],
        unit=data['unit'],
        category=data['category']
    )
    db.session.add(new_item)
    db.session.commit()
    return jsonify(new_item.to_dict()), 201

@app.route('/pantry', methods=['GET'])
@jwt_required()
def get_pantry_items():
    current_user_id = get_jwt_identity()
    items = PantryItem.query.filter_by(user_id=current_user_id).all()
    return jsonify([item.to_dict() for item in items])


