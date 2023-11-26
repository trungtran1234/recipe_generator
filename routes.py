from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
import mysqlx
from model import db, User
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

    access_token = create_access_token(identity=user.id) #create access token

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
@app.route("/addIngredient", methods=["POST"])
def add_ingredient():
    data = request.json
    cursor = db.cursor()

    query = """
    INSERT INTO ingredients (userId, categoryId, ingredientName, remaining)
    VALUES (%s, %s, %s, %s)
    """
    values = (
        data['userId'],
        data['categoryId'],
        data['ingredientName'],
        data['remaining']
    )
    
    try:
        cursor.execute(query, values)
        db.commit()
        return jsonify({"success": True, "response": "Ingredient added"}), 200
    except mysqlx.connector.Error as err:
        print("Something went wrong: {}".format(err))
        return jsonify({"success": False, "response": str(err)}), 500
    finally:
        cursor.close()
