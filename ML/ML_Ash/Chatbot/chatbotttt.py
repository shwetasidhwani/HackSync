import openai
import os
import nltk
from flask import Flask, request, jsonify
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer

nltk.download("vader_lexicon")
sia = SentimentIntensityAnalyzer()

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend interaction

# Mood-based system messages
MOOD_PROMPTS = {
    "Overworked": "You are a compassionate AI therapist assisting someone who feels overworked and exhausted. Suggest ways to relax and take care of yourself. Suggest meditation and yoga.",
    "Distressed": "You are a kind and supportive AI helping someone who is feeling emotionally distressed. Suggest more physical activities and social interactions that help in reducing distress.",
    "Burned Out": "You are a gentle and understanding AI therapist talking to someone who feels burned out and drained. Suggest ways to relax and take care of yourself. Suggest calming activities like reading a book or listening to music. Suggest to take rest and sleep more."
}

def analyze_sentiment(text):
    """Determine sentiment polarity (positive, neutral, negative)."""
    score = sia.polarity_scores(text)["compound"]
    if score >= 0.05:
        return "positive"
    elif score <= -0.05:
        return "negative"
    else:
        return "neutral"

def get_ai_response(user_input, mood):
    """Generate AI response using OpenAI's GPT model, adjusting for mood."""
    try:
        system_message = MOOD_PROMPTS.get(mood, "You are a supportive AI therapist.")
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": system_message},
                {"role": "user", "content": user_input}
            ]
        )
        return response["choices"][0]["message"]["content"]
    except Exception as e:
        return "Sorry, I am currently unavailable. Try again later."

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")
    user_mood = data.get("mood", "Neutral")

    if not user_message:
        return jsonify({"error": "Empty message"}), 400

    ai_response = get_ai_response(user_message, user_mood)
    return jsonify({"response": ai_response})

if __name__ == "__main__":
    app.run(debug=True)
