from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import cv2
import base64
from camera_capture import process_and_log
from database_logger import create_tables, get_analysis_history, get_user_stats


app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])

# Initialize database tables
create_tables()


# Endpoint to handle image analysis and logging
@app.route('/analyze', methods=['POST'])
def analyze():
    """
    Endpoint to analyze an image.
    """
    # Get image and user details from request
    data = request.get_json()
    image_b64 = data.get('image')
    user_id = data.get('user_id')
    role = data.get('role', 'guest')
    password = data.get('password')  # <-- get password from request
    if not image_b64:
        return jsonify({'error': 'No image provided'}), 400
    # Decode base64 image (needed for analyzing with OpenCV)
    try:
        image_bytes = base64.b64decode(image_b64)
        np_arr = np.frombuffer(image_bytes, np.uint8)
        image = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
    except Exception as e:
        return jsonify({'error': f'Invalid image data: {str(e)}'}), 400
    
    # Process and log (pass password along)
    result = process_and_log(image, user_id, role, password)


    return jsonify(result)


# Endpoint to get analysis history
@app.route('/history', methods=['GET'])
def get_history():
    """
    Endpoint to get analysis history for dashboard and insights.
    """
    try:
        # Get query parameters
        user_id = request.args.get('user_id', type=int)
        role = request.args.get('role', 'guest')
        limit = request.args.get('limit', 10, type=int)

        if role not in ('admin', 'user'):
            return jsonify({'error': 'Must be logged in to view history'}), 400

        # Get history from database
        history = get_analysis_history(user_id, role, limit)
        
        # Format the response
        formatted_history = []
        for record in history:
            formatted_history.append({
                'id': record[0],
                'user_id': record[1],
                'timestamp': record[2],
                'image_path': record[3],
                'class_name': record[4],
                'confidence_score': record[5]
            })
        
        return jsonify(formatted_history)
    except Exception as e:
        return jsonify({'error': f'Failed to get history: {str(e)}'}), 500


# Endpoint to get user statistics
@app.route('/stats', methods=['GET'])
def get_stats():
    """
    Endpoint to get user statistics for dashboard.
    """
    try:
        user_id = request.args.get('user_id', type=int)
        role = request.args.get('role', 'guest')
        
        # Get stats from database
        stats = get_user_stats(user_id, role)
        
        return jsonify(stats)
    except Exception as e:
        return jsonify({'error': f'Failed to get stats: {str(e)}'}), 500


# Endpoint to send images
@app.route('/images/<filename>', methods=['GET'])
def send_image(filename):
    return send_from_directory('saved_images', filename)

# return a simple message for the root endpoint
@app.route('/')
def index():
    return 'Camera is running.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)