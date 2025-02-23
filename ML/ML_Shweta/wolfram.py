from flask import Flask, request, jsonify
import requests
import base64
from flask_cors import CORS #Import CORS.

app = Flask(__name__)
CORS(app) #Enable CORS for all routes.

WOLFRAM_API_URL = "https://www.wolframcloud.com/obj/3dbf22c8-c59d-4928-a4d3-e498678c07d7"

@app.route('/analyze_face', methods=['POST'])
def analyze_face():
    try:
        image_data = request.json['image']
        print(image_data)
        response = requests.post(WOLFRAM_API_URL, json={"image": image_data})
        response.raise_for_status()
        return jsonify(response.json())
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    except Exception as e:
        return jsonify({"error": "Internal server error"}), 500

if __name__ == '__main__':
    app.run(debug=True)