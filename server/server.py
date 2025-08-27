from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import numpy as np
import pandas as pd
import tensorflow as tf
import joblib
from sklearn.preprocessing import StandardScaler, LabelEncoder


# ======================
# Setup Flask
# ======================
app = Flask(__name__, static_folder="./build", static_url_path="/")
CORS(app)

# functions
def predictStage(patient):
    # Convert to DataFrame
    new_df = pd.DataFrame([patient])

    # Encode categorical values using saved encoders
    for col in categorical_cols:
        new_df[col] = encoders[col].transform(new_df[col])

    # Scale numeric values for NN
    new_scaled = scaler.transform(new_df)

    # Stage Prediction (NN)
    pred_probs = nn_model.predict(new_scaled)
    pred_stage = np.argmax(pred_probs, axis=1) + 1  # Stage {1,2,3}

    return {"stage": int(pred_stage[0]), "probs": pred_probs.tolist()[0]}


import matplotlib.pyplot as plt
import numpy as np

def predictSurvival(patient, stage):
    # ----------------------
    # Preprocess Patient Row
    # ----------------------
    new_df = pd.DataFrame([patient])
    for col in categorical_cols:
        new_df[col] = encoders[col].transform(new_df[col])

    survival_input = new_df.copy()
    survival_input["Stage"] = stage
    survival_input['Event'] = 0
    survival_input['Duration'] = 0

    # ----------------------
    # Predict Survival Curve
    # ----------------------
    surv_func = cox_model.predict_survival_function(survival_input)

    time_days = surv_func.index.to_numpy()
    survival_probs = surv_func.iloc[:, 0].to_numpy()

    # ----------------------
    # Hazard Function (λ(t))
    # approx. hazard = - d/dt log(S(t))
    # ----------------------
    hazard = -np.gradient(np.log(survival_probs + 1e-8), time_days)

    # ----------------------
    # Risk Score (relative hazard)
    # ----------------------
    risk_score = cox_model.predict_partial_hazard(survival_input).values[0]

    # ----------------------
    # Median Survival Time
    # ----------------------
    try:
        median_time = time_days[np.where(survival_probs <= 0.5)[0][0]]
    except IndexError:
        median_time = None  # survival never drops below 50%

    return {
        "time_days": time_days.tolist(),
        "survival_probs": survival_probs.tolist(),
        "hazard": hazard.tolist(),
        "risk_score": float(risk_score),
        "median_survival_time": median_time
    }


# ======================
# Load Models
# ======================
nn_model = tf.keras.models.load_model("../models/liver_cirrhosis_stage_predictor.h5")
cox_model = joblib.load("../models/liver_cirrhosis_cox.pkl")

# ======================
# Preprocessing Setup
# ======================
data = "../data/liver_cirrhosis.csv"
df = pd.read_csv(data)

# Save raw copy for Cox usage
df_survival = pd.read_csv(data)

# Drop unnecessary features for NN
df = df.drop(columns=['N_Days', 'Status'])
df = df.fillna(df.median(numeric_only=True))

# Encode categorical features (store encoders in a dict)
categorical_cols = ['Drug', 'Sex', 'Ascites', 'Hepatomegaly', 'Spiders', 'Edema']
encoders = {}
for col in categorical_cols:
    le = LabelEncoder()
    df[col] = le.fit_transform(df[col])
    encoders[col] = le   # save encoder

# Scale numeric features
scaler = StandardScaler()
X = df.drop(columns=['Stage'])
scaler.fit(X)




# ======================
# dashboard Route
# ======================
@app.route("/", methods=["GET"])
def index():
    return send_from_directory(app.static_folder, "index.html")

# Catch-all route for React Router
@app.route("/<path:path>")
def static_proxy(path):
    try:
        return send_from_directory(app.static_folder, path)
    except:
        return send_from_directory(app.static_folder, "index.html")

# ======================
# Prediction Route
# ======================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        # Get JSON input from client
        patient = request.get_json()
        value = patient.pop("Drug")
        patient = {"Drug": value, **patient}
        
        # predict stage
        stage_prediction = predictStage(patient) 
        
        # predict survival rate
        survival_prediction = predictSurvival(patient, stage_prediction["stage"])
        
        return jsonify({"stage_prediction": stage_prediction, "survival_prediction": survival_prediction})
        

    except Exception as e:
        return jsonify({"error": str(e)}), 400


# ======================
# Run Server
# ======================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
