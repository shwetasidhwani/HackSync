from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import tensorflow as tf
import joblib
import numpy as np

app = Flask(__name__)
CORS(app)

# Load the saved model and scaler
model = tf.keras.models.load_model('cognitive_engagement_model.h5')
scaler = joblib.load('scaler.joblib')
feature_columns = joblib.load('feature_columns.joblib')

@app.route('/cogPredict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.json
        print(data)
        
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
        probability = float(prediction[0][0])
        print(prediction)
        
        return jsonify({
            "overload_probability": probability,
            "is_overloaded": "Yes" if probability >= 0.5 else "No"
        })
        
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True)