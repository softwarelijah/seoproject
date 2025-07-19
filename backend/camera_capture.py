from keras.models import load_model 
import cv2 
import numpy as np
import time  # For sleep functionality

# Disable scientific notation for clarity
np.set_printoptions(suppress=True)

# Load the model
model = load_model("keras_Model.h5", compile=False)

# Load the labels
class_names = open("labels.txt", "r").readlines()

# CAMERA can be 0 or 1 based on default camera
camera = cv2.VideoCapture(0)

# handle frame rate
fps = 30
delay = 1 / fps

# Countdown settings
countdown_seconds = 10
next_prediction_time = time.time() + countdown_seconds

# Store result to display on screen
result_text = ""

while True:
    # Grab the webcamera's image.
    ret, image = camera.read()

    # get the current time
    start = time.time()

    # Resize and prepare the image
    image_resized = cv2.resize(image, (224, 224), interpolation=cv2.INTER_AREA)
    image_display = image.copy()  # Copy for display with overlay

    # Check if the window is minimized or closed
    window_state = cv2.getWindowProperty('Food Waste Tracker', cv2.WND_PROP_VISIBLE)
    if window_state < 1:
        countdown_paused = True
        countdown_remaining = int(next_prediction_time - time.time())
    else:
        countdown_paused = False
        countdown_remaining = max(0, int(next_prediction_time - time.time()))

        # If countdown finished, make prediction
        if countdown_remaining == 0:
            # Preprocess the image
            image_input = np.asarray(image_resized, dtype=np.float32).reshape(1, 224, 224, 3)
            image_input = (image_input / 127.5) - 1

            # Predict
            prediction = model.predict(image_input)
            index = np.argmax(prediction)
            class_name = class_names[index]
            confidence_score = prediction[0][index]

            # Print in console
            print("\nClass:", class_name[2:].strip())
            print("Confidence Score:", str(np.round(confidence_score * 100))[:-2], "%")

            # Set result to display on screen
            result_text = class_name[2:].strip() + " (" + str(np.round(confidence_score * 100))[:-2] + "%)"

            # Reset countdown
            next_prediction_time = time.time() + countdown_seconds

    # Show countdown overlay
    cv2.putText(
        image_display,
        f"Analyzing in: {countdown_remaining}s",
        (10, 30),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 0, 255),
        2,
        cv2.LINE_AA
    )

    # Show result text overlay (if any)
    if result_text:
        cv2.putText(
            image_display,
            f"Prediction: {result_text}",
            (10, 70),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 255, 0),
            2,
            cv2.LINE_AA
        )

    # Show the webcam image
    cv2.imshow('Food Waste Tracker', image_display)

    # Exit conditions
    if cv2.getWindowProperty('Food Waste Tracker', cv2.WND_PROP_VISIBLE) < 1:
        break
    if cv2.waitKey(1) == 27:
        break

    # Maintain frame rate
    elapsed = time.time() - start
    time.sleep(max(0, delay - elapsed))


camera.release()
cv2.destroyAllWindows()
