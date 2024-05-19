from flask import Flask
from flask_sqlalchemy import SQLAlchemy
import os
from dotenv import load_dotenv
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity

load_dotenv()

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_KEY')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False
jwt = JWTManager(app)
CORS(app, supports_credentials=True)

DB_USER = os.getenv('DB_USER')
DB_PASS = os.getenv('DB_PASS')
DB_HOST = os.getenv('DB_HOST')
DB_PORT = os.getenv('DB_PORT')
DB_NAME = os.getenv('DB_NAME')

app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql+mysqlconnector://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
db = SQLAlchemy(app)

import routes

with app.app_context():
    db.create_all()

if __name__ == '__main__':
    app.run()