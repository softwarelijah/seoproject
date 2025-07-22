from keras.models import load_model 
import cv2 
import numpy as np
import time
from datetime import datetime
import os
from database_logger import log_result, log_user


# Load the model and class names
MODEL = load_model("keras_Model.h5", compile=False)
CLASS_NAMES = open("labels.txt", "r").readlines()

# analyze the image using the model
def analyze_image(image):
    image_resized = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)
    image_input = np.asarray(image_resized, dtype=np.float32).reshape(1, 224, 224, 3)
    image_input = (image_input / 127.5) - 1
    prediction = MODEL.predict(image_input)
    index = np.argmax(prediction)
    class_name = CLASS_NAMES[index]
    confidence_score = float(prediction[0][index])
    return class_name, confidence_score


# process the image, log the result, and return the details as a dictionary
def process_and_log(image, user_id=None, role='guest'):
    """
    Analyze image, save and log result if permitted by role.
    Returns: dict with class_name, confidence_score, image_path, instruction
    """
    class_name, confidence_score = analyze_image(image)
    class_name = class_name[2:].strip()
    instruction = get_disposal_instruction(class_name)
    image_path = None
    if role in ('admin', 'user'):
        image_path = save_image(image, class_name)
        log_result(user_id, class_name, round(confidence_score * 100, 2), image_path)
    return {
        "class_name": class_name,
        "confidence_score": round(confidence_score * 100, 2),
        "image_path": image_path,
        "instruction": instruction
    }

# Get disposal instructions based on class name
def get_disposal_instruction(class_name):
    disposal_instructions = {
        "trash": "Dispose in black bin (landfill).",
        "recycle": "Place in blue bin after rinsing.",
        "organic": "Place in green bin or compost pile."
    }
    return disposal_instructions.get(class_name.lower(), "No disposal info.")

def display_overlay_text(image, countdown_remaining, result_text, result_instruction):
    cv2.putText(
        image,
        f"Analyzing in: {countdown_remaining}s",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2,
        cv2.LINE_AA
    )
    if result_text:
        cv2.putText(
            image,
            f"Prediction: {result_text}",
            (10, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2,
            cv2.LINE_AA
        )
        cv2.putText(
            image,
            result_instruction,
            (10, 110),
            cv2.FONT_HERSHEY_SIMPLEX,
            0.8,
            (255, 255, 0),
            2,
            cv2.LINE_AA
        )

# camera loop for capturing images and processing them (only for testing)
def camera_loop(role='user', username="testuser", email="testuser@example.com", password="testpass"):
    np.set_printoptions(suppress=True)
    camera = cv2.VideoCapture(0)
    fps = 30
    delay = 1 / fps
    countdown_seconds = 10
    next_prediction_time = time.time() + countdown_seconds
    result_text = ""
    result_instruction = ""
    user_id = None

    # Log user if role is admin or user
    if role in ('admin', 'user'):
        user_id = log_user(username, email, password, role)
    while True:
        # initialize camera and read frame
        ret, image = camera.read()
        start = time.time()
        image_display = image.copy()
        window_state = cv2.getWindowProperty('Food Waste Tracker', cv2.WND_PROP_VISIBLE)

        # Check if the window is open
        # If the window is closed, pause the countdown
        if window_state < 1:
            countdown_paused = True
            countdown_remaining = int(next_prediction_time - time.time())
        else:
            countdown_paused = False
            countdown_remaining = max(0, int(next_prediction_time - time.time()))
            if countdown_remaining == 0:
                result = process_and_log(image, user_id, role)
                result_text = f"{result['class_name']} ({result['confidence_score']}%)"
                result_instruction = f"Instruction: {result['instruction']}"
                next_prediction_time = time.time() + countdown_seconds

        # Display overlay text
        display_overlay_text(image_display, countdown_remaining, result_text, result_instruction)

        cv2.imshow('Food Waste Tracker', image_display)
        # Exit if the window is closed or 'Esc' is pressed
        if cv2.getWindowProperty('Food Waste Tracker', cv2.WND_PROP_VISIBLE) < 1:
            break
        if cv2.waitKey(1) == 27:
            break
        elapsed = time.time() - start
        time.sleep(max(0, delay - elapsed))
    
    # Release resources
    camera.release()
    cv2.destroyAllWindows()

# Save the image to the saved_images folder
def save_image(image, class_name):
    timestamp = datetime.now().strftime("%Y-%m-%d_%H-%M-%S")
    filename = f"{class_name}_{timestamp}.jpg"
    backend_folder = os.path.dirname(os.path.abspath(__file__))
    folder = os.path.join(backend_folder, "saved_images")
    if not os.path.exists(folder):
        os.makedirs(folder)
    path = os.path.join(folder, filename)
    cv2.imwrite(path, image)
    return path


if __name__ == "__main__":
    # For TESTING ONLY, run the camera loop
    camera_loop(role='user', username="testuser", email="testuser@example.com", password="testpass")
