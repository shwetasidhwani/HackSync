from flask import Flask, request, jsonify
from flask_cors import CORS
from chatbot import get_ai_response

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend interaction

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    ai_response = get_ai_response(user_message)
    return jsonify({"response": ai_response})

if __name__ == "__main__":
    app.run(debug=True)
