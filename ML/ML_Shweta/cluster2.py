import pandas as pd
import numpy as np
import joblib
from sklearn.cluster import KMeans
from sklearn.preprocessing import LabelEncoder, StandardScaler
from flask import Flask, request, jsonify
from flask_cors import CORS

# Load Data
data = pd.read_csv("user_activities_with_names.csv")

# Define columns
columns = ["age", "gender", "time_spent", "platform", "interests", "location", "demographics", "profession", "income", "indebt", "isHomeOwner", "Owns_Car", "name"]
data = data[columns]

# Convert categorical columns to numeric
label_encoders = {}
categorical_cols = ["gender", "platform", "interests", "location", "demographics", "profession"]

for col in categorical_cols:
    le = LabelEncoder()
    data[col] = le.fit_transform(data[col])
    label_encoders[col] = le

# Convert boolean columns to integers
boolean_cols = ["indebt", "isHomeOwner", "Owns_Car"]
for col in boolean_cols:
    data[col] = data[col].astype(int)

# Normalize the data
scaler = StandardScaler()
data_scaled = scaler.fit_transform(data.drop(columns=["name"]))

# Apply K-Means Clustering
kmeans = KMeans(n_clusters=5, random_state=42)
data['cluster'] = kmeans.fit_predict(data_scaled)

# Save the model and scalers
joblib.dump(kmeans, "kmeans_model.pkl")
joblib.dump(scaler, "scaler.pkl")
joblib.dump(label_encoders, "label_encoders.pkl")

# Create Flask API
app = Flask(__name__)
CORS(app)  # Enable CORS

# Load trained model and scalers
kmeans = joblib.load("kmeans_model.pkl")
scaler = joblib.load("scaler.pkl")
label_encoders = joblib.load("label_encoders.pkl")

@app.route("/getUserGroup", methods=["POST"])
def get_user_group():
    try:
        user_data = request.json
        print(user_data)
        if not user_data:
            return jsonify({"error": "No data provided"}), 400

        user_df = pd.DataFrame([user_data])
        
        # Define all columns used during fit
        all_columns = ["age", "gender", "time_spent", "platform", "interests", "location", "demographics", "profession", "income", "indebt", "isHomeOwner", "Owns_Car"]
        
        # Ensure all columns are present with default values
        for col in all_columns:
            if col not in user_df:
                user_df[col] = 0  # Default value

        # Encode categorical features
        for col in categorical_cols:
            if user_df[col][0] in label_encoders[col].classes_:
                user_df[col] = label_encoders[col].transform([user_df[col][0]])
            else:
                return jsonify({"error": f"Invalid value for {col}"}), 400
        
        # Convert boolean columns to integers
        for col in boolean_cols:
            user_df[col] = user_df[col].astype(int)
        
        # Normalize user data
        user_scaled = scaler.transform(user_df[all_columns])
        
        # Predict group
        cluster = kmeans.predict(user_scaled)[0]

        # Find users in the same cluster
        cluster_data = data.copy()  # Create a copy of the original data
        cluster_data_scaled = scaler.transform(cluster_data.drop(columns=['name', 'cluster']))
        cluster_data['cluster'] = kmeans.predict(cluster_data_scaled)
        same_cluster_users = cluster_data[cluster_data['cluster'] == cluster]

        # Highlight similarities
        similarities = []
        for col in categorical_cols + boolean_cols:
            if user_data.get(col) is not None and user_data[col] in same_cluster_users[col].values:
                similarities.append(col)

        # Get names of users in the same cluster
        names = same_cluster_users['name'].tolist()

        return jsonify({"group": int(cluster), "names": names, "similarities": similarities})
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
