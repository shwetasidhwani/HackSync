import numpy as np
import pandas as pd
import tensorflow as tf
import joblib

# Load saved model and preprocessing objects
model = tf.keras.models.load_model("social_scheduler_v3.h5", compile=False)
label_encoders = joblib.load("label_encoders.pkl")
friend_encoder = joblib.load("friend_encoder.pkl")
scaler = joblib.load("scaler.pkl")
features = joblib.load("features.pkl")

# Define function to preprocess user input
def preprocess_input(raw_input, sequence_length=10):
    df = pd.DataFrame([raw_input])
    
    # Encode categorical variables
    for col in ["Category", "Interaction_Type", "Day_of_Week", "Preferred_Time_Slot"]:
        df[col] = label_encoders[col].transform(df[col])
    
    # Normalize numerical values
    numerical_cols = ["Duration_Minutes", "Mood_Before", "Mood_After", "Previous_Interaction_Gap", "Interaction_Frequency_Score", "Social_Preference_Score", "Urgency_Score"]
    df[numerical_cols] = scaler.transform(df[numerical_cols])
    
    # Construct sequence (for now, repeating the input to match sequence length)
    sequence = np.tile(df[features].values, (sequence_length, 1))
    sequence = sequence.reshape(1, sequence_length, -1)
    
    return sequence

# Sample raw input for testing
raw_test_input = {
    "Category": "Work",
    "Interaction_Type": "Call",
    "Day_of_Week": "Monday",
    "Preferred_Time_Slot": "Evening",
    "Duration_Minutes": 30,
    "Mood_Before": 7,
    "Mood_After": 8,
    "Previous_Interaction_Gap": 2,
    "Interaction_Frequency_Score": 5,
    "Social_Preference_Score": 6,
    "Urgency_Score": 3
}

# Preprocess the input
processed_input = preprocess_input(raw_test_input)

# Make predictions
predicted_output = model.predict(processed_input)

# Ensure attention mechanism is taken into account
if 'attention_output' in model.output_names:
    attention_output = predicted_output['attention_output']
    print(f"Attention Output: {attention_output}")

predicted_friend = np.argmax(predicted_output['friend_output'])
predicted_time = np.argmax(predicted_output['time_output'])

# Decode predictions
friend_decoded = friend_encoder.inverse_transform([predicted_friend])[0]
time_decoded = label_encoders["Best_Time_to_Meet"].inverse_transform([predicted_time])[0]

print(f"Predicted Friend to Interact With: {friend_decoded}")
print(f"Predicted Best Time to Interact: {time_decoded}")
