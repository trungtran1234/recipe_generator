from flask import jsonify, request
from model import db, User
from __init__ import app
from werkzeug.security import generate_password_hash, check_password_hash

@app.route("/mainpage", methods=["GET", "POST"])
def home():
    return "Welcome to Gusto.AI!"

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
        
    return jsonify({"id": user.id, "username": user.username})