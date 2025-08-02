from flask import Flask, request, jsonify
from flask_cors import CORS
from show_db_content import get_user_credentials
from database_logger import log_user

app = Flask(__name__)
CORS(app, supports_credentials=True, origins=["http://localhost:3000"])



# Endpoint to handle user sign-up
@app.route('/sign_up', methods=['POST'])
def sign_up():
    # name, email, and password from request
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    # Validate input
    if not name or not email or not password:
        return jsonify({"message": "Missing name, email, or password"}), 400
    
    # Check if user already exists, we don't allow duplicate emails
    users = get_user_credentials()
    for user in users:
        if user[0] == email:
            return jsonify({"message": "Email already exists"}), 400

    # Add new user to the database
    user_id = log_user(name, email, password, role='user')


    # return success message
    return jsonify({"message": "User signed up successfully"}), 201

# Endpoint to handle user login
@app.route('/log_in', methods=['POST'])
def log_in():
    # Get email and password from request
    data = request.json
    email = data.get('email')
    password = data.get('password')

    # Validate email and password
    if not email or not password:
        return jsonify({"message": "Missing email or password"}), 400

    # get user credentials from the database
    users = get_user_credentials()

    # Validate email and password
    for user in users:
        if user[0] == email and user[1] == password:
            return jsonify({
                "message": "User logged in successfully",
                "user": {
                    "email": email,
                    "id": user[2],
                    "role": user[3]
                }
            }), 200


    return jsonify({"message": "Invalid email or password"}), 401

# return a simple message for the root endpoint
@app.route('/')
def index():
    return 'Login and Signup is running.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)