import sys
import json
import pickle
import numpy as np
import pandas as pd

# Load scaler and HMM model
scaler = pickle.load(open("models/scaler.pkl", "rb"))
hmm_model = pickle.load(open("models/hmm_fraud_model.pkl", "rb"))

def predict_fraud(data):
    # Convert JSON to DataFrame
    df = pd.DataFrame([data])
    
    # Select relevant features (adjust based on your model training)
    features = ['TransactionID', 'Amount', 'Latitude', 'Longitude', 'AvgTransactionAmount', 'TransactionFrequency', 'FailedAttempts', 'PhoneNumber']
    X = df[features]

    # Scale the data
    X_scaled = scaler.transform(X)

    # Predict using HMM model
    log_prob = hmm_model.score(X_scaled)  # Log probability of the sequence
    prediction = 1 if log_prob < -50 else 0  # Adjust threshold as needed

    return {"fraud_prediction": prediction}


if __name__ == "__main__":
    if len(sys.argv) > 1:
        input_data = json.loads(sys.argv[1])  # Get data from command line
    else:
        with open("input.json", "r") as file:
            input_data = json.load(file)  # Read from input.json if no arguments

    result = predict_fraud(input_data)
    print(json.dumps(result))  # Send result back
