import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler, LabelEncoder
from tensorflow.keras.models import load_model
import joblib
from lifelines import CoxPHFitter

# ======================
# Load Trained Models
# ======================
nn_model = load_model("C:\\Users\\PC\\Desktop\\UM Internship Projects\\liver_cirrhosis\\models\\liver_cirrhosis_stage_predictor.h5")
cox_model = joblib.load("C:\\Users\\PC\\Desktop\\UM Internship Projects\\liver_cirrhosis\\models\\liver_cirrhosis_cox.pkl")

# ======================
# Load & Preprocess Dataset (to build encoders + scaler)
# ======================
data = "C:\\Users\\PC\\Desktop\\UM Internship Projects\\Projects\\liver_cirrhosis_stage\\liver_cirrhosis.csv"
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
# Predict on a New Patient Row
# ======================
new_patient = {
    "Drug": "Placebo",
    "Age": 18499,
    "Sex": "F",
    "Ascites": "N",
    "Hepatomegaly": "Y",
    "Spiders": "N",
    "Edema": "N",
    "Bilirubin": 0.5,
    "Cholesterol": 149.0,
    "Albumin": 4.04,
    "Copper": 227.0,
    "Alk_Phos": 598.0,
    "SGOT": 52.7,
    "Tryglicerides": 57.0,
    "Platelets": 256.0,
    "Prothrombin": 9.9,
}

# Convert to DataFrame
new_df = pd.DataFrame([new_patient])

# Encode categorical values using saved encoders
for col in categorical_cols:
    new_df[col] = encoders[col].transform(new_df[col])

# Scale numeric values for NN
new_scaled = scaler.transform(new_df)

# ======================
# Stage Prediction (NN)
# ======================
pred_probs = nn_model.predict(new_scaled)
pred_stage = np.argmax(pred_probs, axis=1) + 1  # Stage {1,2,3}

print("Prediction probabilities:", pred_probs)
print("Predicted Stage:", pred_stage[0])



# ======================
# Survival Prediction (Cox) if Stage 3
# ======================
if pred_stage[0]:
    # print("\nPatient is Stage 3 Predicting Survival Curve...")

    # For Cox, we need event+duration columns included.
    # Build a dataframe in the same format used during Cox training
    survival_input = new_df.copy()
    survival_input["Stage"] = pred_stage
    survival_input['Event'] = 0     # unknown future → assume not yet
    survival_input['Duration'] = 0  # not relevant for prediction

    # Predict survival curve
    surv_func = cox_model.predict_survival_function(survival_input)

    # Plot survival probability over time
    surv_func.plot()
    plt.title("Predicted Survival Curve")
    plt.xlabel("Days")
    plt.ylabel("Survival Probability")
    plt.show()
