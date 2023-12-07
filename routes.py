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

<<<<<<< HEAD
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
=======
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
    selected = db.Column(db.Boolean, default=False)
>>>>>>> 75ac179 (added recipe generation)

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