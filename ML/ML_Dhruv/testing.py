import numpy as np
import pandas as pd
import joblib
import tensorflow as tf

# Load pre-trained model
model = tf.keras.models.load_model("social_scheduler_v3.h5")

# Load preprocessing objects
scaler = joblib.load("scaler.pkl")  # StandardScaler now properly loaded
label_encoders = joblib.load("label_encoders.pkl")
friend_encoder = joblib.load("friend_encoder.pkl")
features = joblib.load("features.pkl")

# Required input features
numerical_cols = ["Duration_Minutes", "Mood_Before", "Mood_After", "Previous_Interaction_Gap",
                  "Interaction_Frequency_Score", "Social_Preference_Score", "Urgency_Score"]
categorical_cols = ["Category", "Interaction_Type", "Day_of_Week", "Preferred_Time_Slot"]

# Function to take dynamic user input
def get_user_input():
    print("\nEnter your details for prediction:")
    user_data = {}

    # Take numerical inputs
    for col in numerical_cols:
        user_data[col] = float(input(f"Enter {col}: "))

    # Take categorical inputs
    for col in categorical_cols:
        options = list(label_encoders[col].classes_)  # Get available categories
        print(f"\nAvailable {col} options: {options}")
        choice = input(f"Choose {col}: ")
        while choice not in options:
            print("Invalid choice! Try again.")
            choice = input(f"Choose {col}: ")
        user_data[col] = label_encoders[col].transform([choice])[0]  # Encode user input

    return user_data

# Convert user input to model-ready format
def preprocess_input(user_data, sequence_length=10):
    # Convert to DataFrame
    df = pd.DataFrame([user_data])

    # Normalize numerical data using StandardScaler
    df[numerical_cols] = scaler.transform(df[numerical_cols])

    # Convert to numpy array
    input_array = df[features].values

    # Repeat input to match required LSTM sequence length
    input_sequence = np.tile(input_array, (sequence_length, 1)).reshape(1, sequence_length, -1)

    return input_sequence

# Get user input
user_data = get_user_input()

# Preprocess input
input_seq = preprocess_input(user_data)

# Make prediction
predictions = model.predict(input_seq)
predicted_friend_idx = np.argmax(predictions["friend_output"])
predicted_time_idx = np.argmax(predictions["time_output"])

# Decode predictions
predicted_friend = friend_encoder.inverse_transform([predicted_friend_idx])[0]
predicted_time = label_encoders["Best_Time_to_Meet"].inverse_transform([predicted_time_idx])[0]

# Display prediction results
print("\n--- Prediction Results ---")
print(f"🧑‍🤝‍🧑 Suggested Friend: {predicted_friend}")
print(f"⏰ Best Time to Interact: {predicted_time}")
