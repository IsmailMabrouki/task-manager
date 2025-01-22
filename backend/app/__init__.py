# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from flask_cors import CORS
import os
from dotenv import load_dotenv

db = SQLAlchemy()
bcrypt = Bcrypt()
jwt = JWTManager()

load_dotenv()  # Load environment variables from .env

def create_app():
    app = Flask(__name__)
     # CORS configuration - Allow all origins for both /api/* and /auth/*
    CORS(app, resources={
        r"/api/*": {"origins": "*"},
        r"/auth/*": {"origins": "*"}
    })

    # Configuration
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('SQLALCHEMY_DATABASE_URI', 'sqlite:///tasks.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'default_secret_key')

    db.init_app(app)
    bcrypt.init_app(app)
    jwt.init_app(app)


    # Register routes (Blueprints)
    from .routes import api
    app.register_blueprint(api, url_prefix='/api')
   
    from .auth import auth
    app.register_blueprint(auth, url_prefix='/auth')

    return app
