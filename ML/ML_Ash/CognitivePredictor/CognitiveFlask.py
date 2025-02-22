from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import tensorflow as tf
import joblib
import numpy as np
import matplotlib.pyplot as plt
import io
import base64

app = Flask(__name__)
CORS(app)

# Load the saved model and scaler
model = tf.keras.models.load_model('cognitive_engagement_model.h5')
scaler = joblib.load('scaler.joblib')
feature_columns = joblib.load('feature_columns.joblib')

def generate_plot(analysis):
    plt.figure(figsize=(15, 5))
    
    # Plot 1: Risk Score Gauge
    plt.subplot(131)
    risk_color = 'red' if analysis['risk_score'] > 75 else 'orange' if analysis['risk_score'] > 50 else 'green'
    plt.pie([analysis['risk_score'], 100-analysis['risk_score']], 
            colors=[risk_color, 'lightgray'],
            startangle=90)
    plt.title(f"Risk Score: {analysis['risk_score']}%")
    
    # Plot 2: Top Contributors
    plt.subplot(132)
    contributors = analysis['primary_contributors']
    plt.bar([x[0] for x in contributors], [x[1] for x in contributors])
    plt.xticks(rotation=45)
    plt.title("Top Contributing Factors")
    
    plt.tight_layout()
    
    # Convert plot to base64 string
    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    plot_url = base64.b64encode(buf.getvalue()).decode()
    plt.close()
    
    return plot_url

def analyze_feature_importance():
    feature_importance = {
        'duration': 30.0,
        'engagement_level': 70.0,
        'event_type_training': 0.0,
        'event_type_meeting': 0.0,
        'event_type_focus_work': 0.0,
        'location_office': 0.0,
        'location_remote': 0.0,
        'location_home': 0.0,
        'time_of_day_morning': 0.0,
        'time_of_day_afternoon': 0.0,
        'time_of_day_evening': 0.0
    }
    return feature_importance

def generate_recommendations(input_data, probability):
    recommendations = []
    risk_factors = []
    
    # Duration analysis
    duration = float(input_data['duration'])
    if duration > 60:
        risk_level = 'high' if duration > 90 else 'moderate'
        risk_factors.append({
            'factor': 'Duration',
            'value': f"{duration} minutes",
            'risk_level': risk_level,
            'impact': 'Extended duration increases cognitive load'
        })
        recommendations.extend([
            "Break down the activity into 45-minute segments",
            f"Include {5 if duration <= 90 else 10} minute breaks between segments",
            "Use Pomodoro technique (25 min work + 5 min break)"
        ])

    # Add similar analysis for other factors...
    
    # Calculate risk score
    risk_score = probability * 100
    risk_level = 'High' if risk_score > 75 else 'Moderate' if risk_score > 50 else 'Low'
    
    return {
        'risk_score': int(risk_score),
        'risk_level': risk_level,
        'risk_factors': risk_factors,
        'recommendations': list(set(recommendations))
    }

@app.route('/cogPredict', methods=['POST'])
def predict():
    try:
        # Get input data
        data = request.json
        print("Received data:", data)
        
        # Process current scenario
        current_input = pd.DataFrame({
            'duration': [float(data['duration'])],
            'engagement_level': [float(data['engagement_level'])],
            'event_type': [data['event_type']],
            'location': [data['location']],
            'time_of_day': [data['time_of_day']]
        })
        
        # Process comparison scenario if provided
        comparison_input = None
        if data.get('comparison'):
            comparison_input = pd.DataFrame({
                'duration': [float(data['comparison']['duration'])],
                'engagement_level': [float(data['comparison']['engagement_level'])],
                'event_type': [data['comparison']['event_type']],
                'location': [data['comparison']['location']],
                'time_of_day': [data['comparison']['time_of_day']]
            })

        # Process and predict for current scenario
        current_processed = process_input(current_input)
        current_prediction = model.predict(current_processed)
        current_probability = float(current_prediction[0][0])
        
        # Generate analysis for current scenario
        feature_importance = analyze_feature_importance()
        current_analysis = generate_recommendations(data, current_probability)
        current_analysis['primary_contributors'] = list(feature_importance.items())[:3]
        
        # Generate plot
        plot_url = generate_plot(current_analysis)
        
        response_data = {
            "current": {
                "overload_probability": current_probability,
                "is_overloaded": "Yes" if current_probability >= 0.5 else "No",
                "analysis": current_analysis,
                "plot": plot_url
            }
        }
        
        # Add comparison analysis if provided
        if comparison_input is not None:
            comparison_processed = process_input(comparison_input)
            comparison_prediction = model.predict(comparison_processed)
            comparison_probability = float(comparison_prediction[0][0])
            comparison_analysis = generate_recommendations(data['comparison'], comparison_probability)
            comparison_analysis['primary_contributors'] = list(feature_importance.items())[:3]
            
            response_data["comparison"] = {
                "overload_probability": comparison_probability,
                "is_overloaded": "Yes" if comparison_probability >= 0.5 else "No",
                "analysis": comparison_analysis
            }
        
        return jsonify(response_data)
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400

def process_input(input_df):
    processed_input = pd.get_dummies(input_df, columns=['event_type', 'location', 'time_of_day'])
    
    for col in feature_columns:
        if col not in processed_input.columns:
            processed_input[col] = 0
    processed_input = processed_input[feature_columns]
    
    numerical_features = ['duration', 'engagement_level']
    processed_input[numerical_features] = scaler.transform(processed_input[numerical_features])
    
    return processed_input

@app.route('/compareScenarios', methods=['POST'])
def compare_scenarios():
    try:
        data = request.json
        print("Comparing data" , data)
        scenario1 = data['scenario1']
        scenario2 = data['scenario2']
        
        # Process both scenarios
        scenario1_result = process_and_analyze(scenario1)
        scenario2_result = process_and_analyze(scenario2)
        
        # Calculate differences and generate recommendations
        differences = calculate_differences(scenario1_result, scenario2_result)
        recommendations = generate_comparison_recommendations(differences)
        
        return jsonify({
            'scenario1': scenario1_result,
            'scenario2': scenario2_result,
            'differences': differences,
            'recommendations': recommendations
        })
        
    except Exception as e:
        print("Error:", str(e))
        return jsonify({"error": str(e)}), 400

def process_and_analyze(scenario):
    # Similar to your existing prediction logic
    input_df = pd.DataFrame([scenario])
    processed_input = process_input(input_df)
    prediction = model.predict(processed_input)
    probability = float(prediction[0][0])
    
    return {
        'risk_score': int(probability * 100),
        'details': {
            'Duration': f"{scenario['duration']} minutes",
            'Engagement': f"Level {scenario['engagement_level']}",
            'Event Type': scenario['event_type'],
            'Location': scenario['location'],
            'Time': scenario['time_of_day']
        }
    }

def calculate_differences(scenario1, scenario2):
    differences = []
    
    # Compare risk scores
    risk_diff = abs(scenario1['risk_score'] - scenario2['risk_score'])
    differences.append({
        'factor': 'Risk Score Difference',
        'impact': f"{risk_diff}%"
    })
    
    # Compare other factors
    for key in scenario1['details']:
        if scenario1['details'][key] != scenario2['details'][key]:
            differences.append({
                'factor': key,
                'impact': f"Changed from {scenario1['details'][key]} to {scenario2['details'][key]}"
            })
    
    return differences

def generate_comparison_recommendations(differences):
    recommendations = []
    
    # Generate specific recommendations based on differences
    for diff in differences:
        if diff['factor'] == 'Risk Score Difference':
            score_diff = int(diff['impact'].replace('%', ''))
            if score_diff > 20:
                recommendations.append(
                    "Significant difference in risk scores. Consider adopting practices from the lower-risk scenario."
                )
        elif diff['factor'] == 'Duration':
            recommendations.append(
                "Consider optimizing session duration for better cognitive load management."
            )
        # Add more specific recommendations based on other factors
    
    return recommendations

if __name__ == '__main__':
    app.run(debug=True)