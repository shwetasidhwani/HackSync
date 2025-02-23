from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import tensorflow as tf
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the saved model and scaler
model = tf.keras.models.load_model('ML/ML_Ash/cognitive_engagement_model.h5')
scaler = joblib.load('ML/ML_Ash/scaler.joblib')
feature_columns = joblib.load('ML/ML_Ash/feature_columns.joblib')

def analyze_factors(input_data, probability):
    analysis = {
        "overload_probability": float(probability),
        "risk_level": "High" if probability >= 0.75 else "Medium" if probability >= 0.5 else "Low",
        "contributing_factors": [],
        "recommendations": []
    }
    
    # Analyze duration
    if input_data['duration'][0] > 90:
        analysis["contributing_factors"].append("Long duration activity (over 90 minutes)")
        analysis["recommendations"].append("Consider breaking this activity into smaller segments of 45-60 minutes")
    
    # Analyze engagement level
    if input_data['engagement_level'][0] >= 7:
        analysis["contributing_factors"].append("High mental engagement required")
        analysis["recommendations"].append("Schedule 5-minute breaks every 25 minutes (Pomodoro Technique)")
    
    # Time of day analysis
    if input_data['time_of_day'][0] == 'afternoon':
        analysis["contributing_factors"].append("Afternoon timing (natural energy dip period)")
        analysis["recommendations"].append("Consider scheduling high-focus tasks during morning hours")
    elif input_data['time_of_day'][0] == 'evening':
        analysis["contributing_factors"].append("Evening work (potential fatigue impact)")
        analysis["recommendations"].append("Ensure proper lighting and regular movement breaks")

    # Location analysis
    if input_data['location'][0] == 'office':
        analysis["contributing_factors"].append("Office environment (potential for distractions)")
        analysis["recommendations"].extend([
            "Use noise-cancelling headphones if needed",
            "Take regular screen breaks using the 20-20-20 rule"
        ])
    
    # Event type analysis
    if input_data['event_type'][0] == 'meeting':
        analysis["contributing_factors"].append("Meeting (requires sustained attention)")
        analysis["recommendations"].extend([
            "Request meeting agenda in advance",
            "Take brief notes to maintain engagement",
            "Suggest breaks for meetings over 60 minutes"
        ])
    
    # Add general recommendations based on overload probability
    if probability >= 0.5:
        analysis["recommendations"].extend([
            "Practice quick stress-relief techniques (deep breathing, stretching)",
            "Use task prioritization methods",
            "Consider delegating some responsibilities",
            "Schedule recovery periods between high-intensity tasks"
        ])
    else:
        analysis["recommendations"].extend([
            "Current cognitive load is manageable",
            "Monitor energy levels throughout the activity",
            "Maintain this balanced approach to task management"
        ])
    
    return analysis

@app.route('/cogPredict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.get_json()
        
        # Create DataFrame
        input_df = pd.DataFrame({
            'duration': [float(data['duration'])],
            'engagement_level': [float(data['engagement_level'])],
            'event_type': [data['event_type']],
            'location': [data['location']],
            'time_of_day': [data['time_of_day']]
        })
        
        # Process input
        processed_input = pd.get_dummies(input_df, columns=['event_type', 'location', 'time_of_day'])
        
        # Ensure all columns from training data are present
        for col in feature_columns:
            if col not in processed_input.columns:
                processed_input[col] = 0
        processed_input = processed_input[feature_columns]
        
        # Scale numerical features
        numerical_features = ['duration', 'engagement_level']
        processed_input[numerical_features] = scaler.transform(processed_input[numerical_features])
        
        # Make prediction
        prediction = model.predict(processed_input)
        probability = float(prediction[0][0])  # Convert to Python float for JSON serialization
        
        # Get detailed analysis
        analysis = analyze_factors(input_df, probability)
        
        return jsonify(analysis)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True) 