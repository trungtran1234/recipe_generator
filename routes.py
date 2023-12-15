from datetime import date, datetime
from flask import jsonify, request
from flask_jwt_extended import create_access_token, get_current_user, get_jwt,get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
import mysqlx
from model import PantryItem, db, User, Recipe, Restriction, NutritionGoal, DailyIntake
from __init__ import app
from werkzeug.security import generate_password_hash, check_password_hash
import pytz

@app.route("/mainpage", methods=["GET", "POST"])
@jwt_required()
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
        
    access_token = create_access_token(identity=user.id) #create access token
    return jsonify(access_token = access_token), 200
 
#logout route
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

    existing_item = PantryItem.query.filter_by(
        user_id=current_user_id,
        ingredient_name=data['ingredient_name'],
    ).first()

    if existing_item:
        return jsonify({"message" : "Ingredient already in pantry"}), 409

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

#get ingredients
@app.route('/pantry', methods=['GET'])
@jwt_required()
def get_pantry_items():
    current_user_id = get_jwt_identity()
    items = PantryItem.query.filter_by(user_id=current_user_id).all()
    return jsonify([item.to_dict() for item in items])


#delete ingredient
@app.route('/pantry/<int:item_id>', methods=['DELETE'])
@jwt_required()
def delete_pantry_item(item_id):
    current_user_id = get_jwt_identity()

    item_to_delete = PantryItem.query.filter_by(id=item_id, user_id=current_user_id).first()

    if item_to_delete:
        db.session.delete(item_to_delete)
        db.session.commit()
        return jsonify({'message': 'Item deleted successfully'}), 200
    else:
        return jsonify({'message': 'Item not found'}), 404

#favorite ingredient
@app.route('/pantry/<int:item_id>/favorite', methods=['PATCH'])
@jwt_required()
def toggle_favorite(item_id):
    current_user_id = get_jwt_identity()
    item = PantryItem.query.filter_by(id=item_id, user_id=current_user_id).first()

    if not item:
        return jsonify({"message": "Item not found"}), 404

    data = request.json
    item.favorite = data.get('favorite', item.favorite)

    db.session.commit()
    return jsonify(item.to_dict()), 200

#change password
@app.route("/changePassword", methods=["POST"])
@jwt_required()
def changePassword():

    try:
        data = request.json
      
        current_user_id = get_jwt_identity()
        
        user = User.query.get(current_user_id)
       
        user.password = data['new_password']
        hashed_password = generate_password_hash( user.password)
        user.password = hashed_password
       
        db.session.commit()

       
        return jsonify({"success": True, "response": "Password updated"}), 200

    except Exception as e:
      
        print("Error:", str(e))
        return jsonify({"success": False, "response": str(e)}), 500 


#change username
@app.route("/changeUsername", methods=["POST"])
@jwt_required()
def changeUsername():

    try:
       
        data = request.json
    
        current_user_id = get_jwt_identity()
       
        user = User.query.get(current_user_id)

        existing_user = User.query.filter_by(username=data['new_Username']).first()

        if existing_user:
            return jsonify({"success": False, "response": "Username already exists, please enter a new one"}), 400
        
        user.username = data['new_Username']
       
        db.session.commit()
      
        return jsonify({"success": True, "response": "Username updated"}), 200

    except Exception as e:
       
        print("Error:", str(e))
        return jsonify({"success": False, "response": str(e)}), 500

#select items for recipe generation
@app.route("/mainpage/select", methods=["PATCH"])
@jwt_required()
def select_item():
    try:
        data = request.json
        ingredient_name = data['ingredient_name']
        selected = data['selected']
        current_user_id = get_jwt_identity()

        item = PantryItem.query.filter_by(user_id=current_user_id, ingredient_name=ingredient_name).first()
        if not item:
            return jsonify({"message": "Item not found"}), 404
        item.selected = selected
        db.session.commit()
        return jsonify({"success": True, "response": "Item updated"}), 200
    
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"success": False, "response": str(e)}), 500
    
#bulk update selected status of items (for select all and clear all buttons)
@app.route('/mainpage/bulk-update', methods=['PATCH'])
@jwt_required()
def bulk_update_pantry_items():
    user_id = get_jwt_identity()
    try:
        data = request.json
        item_ids = data.get('item_ids')
        new_selected_status = data.get('selected') 
        print(new_selected_status)

        PantryItem.query.filter(PantryItem.id.in_(item_ids), PantryItem.user_id == user_id).update({'selected': new_selected_status}, synchronize_session=False)
        db.session.commit()

        return jsonify({"success": True, "message": "Items updated"}), 200
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500
    
@app.route('/recipe', methods=['POST'])
@jwt_required()
def add_or_update_recipe():
    user_id = get_jwt_identity()
    recipe_data = request.json.get('recipe_data')
    favorited = request.json.get('favorited', False)
    print(favorited)
    recipe_uri = recipe_data.get('recipe').get('uri')
    print(recipe_uri)

    existing_recipe = Recipe.query.filter_by(
        user_id=user_id, 
        recipe_uri=recipe_uri
    ).first()
    print(existing_recipe)
    if existing_recipe:
        existing_recipe.recipe_data = recipe_data
        print(favorited)
        existing_recipe.favorited = favorited
        db.session.commit()
        return jsonify(existing_recipe.to_dict()), 200
    else:
        new_recipe = Recipe(
            user_id=user_id,
            recipe_data=recipe_data,
            favorited=favorited,
            recipe_uri=recipe_uri
        )
        db.session.add(new_recipe)
    
    db.session.commit()
    return jsonify({"message": "Recipe saved successfully"}), 200

#get all recipes
@app.route('/recipe/get', methods=['GET'])
@jwt_required()
def get_recipes():
    user_id = get_jwt_identity()
    recipes = Recipe.query.filter_by(user_id=user_id).all()
    return jsonify([recipe.to_dict() for recipe in recipes])

#get all favorited recipes
@app.route('/recipe/getFav', methods=['GET'])
@jwt_required()
def get_favorites():
    user_id = get_jwt_identity()
    recipes = Recipe.query.filter_by(user_id=user_id, favorited=True).all()
    print([recipe.to_dict() for recipe in recipes])
    return jsonify([recipe.to_dict() for recipe in recipes])

#get favorited status of recipe
@app.route('/recipe/favorite-status', methods=['GET'])
@jwt_required()
def get_favorite_status():
    user_id = get_jwt_identity()
    recipe_uri = request.args.get('recipeUri')
    
    recipe = Recipe.query.filter_by(user_id=user_id, recipe_uri=recipe_uri).first()
    if recipe:
        return jsonify(favorited=recipe.favorited)
    else:
        return jsonify({"message": "Recipe not found"}), 404
    
#update user dietary restrictions
@app.route('/restrictions/update', methods=['POST'])
@jwt_required()
def update_dietary_restrictions():
    user_id = get_jwt_identity()
    restrictions = request.json.get('restrictions', [])  # List of restriction names
    print(restrictions)

    # Find or create a new Restriction object for the user
    user_restriction = Restriction.query.filter_by(user_id=user_id).first()
    if not user_restriction:
        user_restriction = Restriction(user_id=user_id)
        db.session.add(user_restriction)

    # Update the restrictions
    user_restriction.restriction = restrictions

    try:
        db.session.commit()
        return jsonify({"message": "Dietary restrictions updated successfully"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
#get user dietary restrictions
@app.route('/restrictions/get', methods=['GET'])
@jwt_required()
def get_dietary_restrictions():
    user_id = get_jwt_identity()
    user_restriction = Restriction.query.filter_by(user_id=user_id).first()
    print("restriction", user_restriction.restriction)
    if not user_restriction:
        return jsonify({"message": "No dietary restrictions found"}), 404
    return jsonify(user_restriction.restriction), 200

#get nutrition goal
@app.route('/nutrition/goal', methods=['GET'])
@jwt_required()
def get_nutrition_goal():
    user_id = get_jwt_identity()
    goal = NutritionGoal.query.filter_by(user_id=user_id).first()
    print(goal)
    if goal:
        return jsonify(goal.serialize())
    else:
        return jsonify({}), 404

#set nutrition goal
@app.route('/nutrition/goal', methods=['POST'])
@jwt_required()
def set_nutrition_goal():
    user_id = get_jwt_identity()
    data = request.json
    print(data)
    goal = NutritionGoal.query.filter_by(user_id=user_id).first()
    if goal:
        goal.weight = data.get('weight')
        goal.calories = data.get('calories')
        goal.carbs = data.get('carbs')
        goal.fat = data.get('fat')
        goal.protein = data.get('protein')
        goal.sugar = data.get('sugar')
        goal.sodium = data.get('sodium')
        goal.cholesterol = data.get('cholesterol')
        goal.last_updated = datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(pytz.timezone('America/Los_Angeles')).strftime('%Y-%m-%d')
    else:
        goal = NutritionGoal(
            user_id=user_id,
            weight=data.get('weight'),
            calories=data.get('calories'),
            carbs = data.get('carbs'),
            fat = data.get('fat'),
            protein = data.get('protein'),
            sugar = data.get('sugar'),
            sodium = data.get('sodium'),
            cholesterol = data.get('cholesterol'),
            last_updated = datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(pytz.timezone('America/Los_Angeles')).strftime('%Y-%m-%d')
        )
        db.session.add(goal)

    db.session.commit()
    return jsonify({"message": "Nutrition goal updated successfully"}), 200

#add daily intake
@app.route('/nutrition/intake', methods=['POST'])
@jwt_required()
def add_daily_intake():
    user_id = get_jwt_identity()
    data = request.json
    date = datetime.utcnow().replace(tzinfo=pytz.utc).astimezone(pytz.timezone('America/Los_Angeles')).strftime('%Y-%m-%d')

    intake = DailyIntake.query.filter_by(user_id=user_id, date=date).first()
    if intake:
        intake.calories += data.get('calories', 0)
        intake.carbs += data.get('carbs', 0)
        intake.fat += data.get('fat', 0)
        intake.protein += data.get('protein', 0)
        intake.sugar += data.get('sugar', 0)
        intake.sodium += data.get('sodium', 0)
        intake.cholesterol += data.get('cholesterol', 0)
    else:
        intake = DailyIntake(
            user_id=user_id,
            date=date,
            weight = 0,
            calories=data.get('calories', 0),
            carbs=data.get('carbs', 0),
            fat=data.get('fat', 0),
            protein=data.get('protein', 0),
            sugar=data.get('sugar', 0),
            sodium=data.get('sodium', 0),
            cholesterol=data.get('cholesterol', 0)
        )
        db.session.add(intake)

    db.session.commit()
    return jsonify({"message": "Daily intake updated successfully"}), 200

#get daily intake based on date
@app.route('/nutrition/intake/<date>', methods=['GET'])
@jwt_required()
def get_daily_intake(date):
    user_id = get_jwt_identity()
    try:
        date_obj = datetime.strptime(date, '%Y-%m-%d').date()
        print(date_obj)
    except ValueError:
        return jsonify({"message": "Invalid date format"}), 400

    intake = DailyIntake.query.filter_by(user_id=user_id, date=date_obj).first()
    print(intake)
    if intake:
        return jsonify(intake.serialize())
    else:
        intake = DailyIntake(
            user_id=user_id,
            date=date,
            weight = 0,
            calories=0,
            carbs=0,
            fat=0,
            protein=0,
            sugar=0,
            sodium=0,
            cholesterol=0
        )
        db.session.add(intake)
        db.session.commit()
        return jsonify(intake.serialize())

#update ingredient quantity and unit
@app.route('/pantry/<int:item_id>', methods=['PATCH'])
@jwt_required()
def update_pantry_item(item_id):
    current_user_id = get_jwt_identity()
    data = request.json

    item_to_update = PantryItem.query.filter_by(id=item_id, user_id=current_user_id).first()
    
    if item_to_update:
        item_to_update.quantity = data.get('quantity', item_to_update.quantity)
        item_to_update.unit = data.get('unit', item_to_update.unit)
        db.session.commit()
        return jsonify({'message': 'Item updated successfully'}), 200
    else:
        return jsonify({'message': 'Item not found'}), 404