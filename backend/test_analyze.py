# test_analyze.py
import requests
import base64

# Use a small jpg image for testing
with open("Background 1.jpg", "rb") as img_file:
    b64_string = base64.b64encode(img_file.read()).decode("utf-8")

payload = {
    "image": b64_string,
    "user_id": 1,
    "role": "user",
    "password": "testpass"
}

response = requests.post("http://localhost:5000/analyze", json=payload)
print("Status code:", response.status_code)
print("Response:", response.json())