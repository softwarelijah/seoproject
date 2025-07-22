from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import cv2
import base64
from camera_capture import process_and_log

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])


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

# return a simple message for the root endpoint
@app.route('/')
def index():
    return 'Camera is running.'

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)