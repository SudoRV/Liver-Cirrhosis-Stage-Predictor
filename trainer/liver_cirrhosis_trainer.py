import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import classification_report, confusion_matrix
from sklearn.ensemble import RandomForestClassifier

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout

from lifelines import CoxPHFitter
import joblib



# ======================
# Load data
# ======================

data = "C:\\Users\\PC\\Desktop\\UM Internship Projects\\Projects\\liver_cirrhosis_stage\\liver_cirrhosis.csv"

df = pd.read_csv(data)
df_survival = df.copy()

print(df.shape)
df.head()

"""

# drop unnecesary features
drop_cols = ['N_Days', 'Status']  
df = df.drop(columns=drop_cols)

# fill null values by median
df = df.fillna(df.median(numeric_only=True))

# converting string to numerical values
# Create a LabelEncoder instance
le = LabelEncoder()

# List of categorical columns from your dataset
categorical_cols = ['Drug', 'Sex', 'Ascites', 'Hepatomegaly', 'Spiders', 'Edema']

# Apply label encoding to each categorical column
for col in categorical_cols:
    df[col] = le.fit_transform(df[col])


# # Distribution of target variable (Stage)
# plt.figure(figsize=(6,4))
# sns.countplot(x='Stage', data=df, palette="Set2")
# plt.title("Distribution of Cirrhosis Stage")
# plt.show()

# # Distribution of numerical features (example: Bilirubin)
# plt.figure(figsize=(6,4))
# sns.histplot(df['Bilirubin'], bins=30, kde=True, color='skyblue')
# plt.title("Bilirubin Distribution")
# plt.xlabel("Bilirubin (mg/dl)")
# plt.ylabel("Frequency")
# plt.show()

# # Compare Bilirubin levels across stages
# plt.figure(figsize=(6,4))
# sns.boxplot(x='Stage', y='Bilirubin', data=df, palette="Set3")
# plt.title("Bilirubin vs Cirrhosis Stage")
# plt.show()

# # Correlation heatmap of numeric features
# plt.figure(figsize=(12,8))
# sns.heatmap(df.corr(), annot=False, cmap="coolwarm", center=0)
# plt.title("Correlation Heatmap")
# plt.show()

# # Barplot for Sex distribution across stages
# plt.figure(figsize=(6,4))
# sns.countplot(x='Sex', hue='Stage', data=df, palette="muted")
# plt.title("Sex distribution across Cirrhosis Stages")
# plt.show()

# # Pairplot (might be slow, but gives a good overview)
# sns.pairplot(df[['Bilirubin', 'Albumin', 'Cholesterol', 'Stage']], hue='Stage', palette="husl")
# plt.show()



# ======================
# Train-Test Split
# ======================
X = df.drop(columns=['Stage'])   # Features
y = df['Stage']                  # Target (Stage: 1,2,3)

# Scale features
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Convert target to categorical (for neural net softmax)
y_cat = tf.keras.utils.to_categorical(y-1)  # shift labels to start at 0

X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y_cat, test_size=0.2, random_state=42
)

# ======================
# Build Neural Network
# ======================
model = Sequential([
    Dense(64, activation='relu', input_shape=(X_train.shape[1],)),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dropout(0.3),
    Dense(3, activation='softmax')  # 3 output classes (Stage 1,2,3)
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# ======================
# Train Model
# ======================

history = model.fit(
    X_train, y_train,
    validation_data=(X_test, y_test),
    epochs=50,
    batch_size=16,
    verbose=1
)

# ======================
# Evaluate Model
# ======================
loss, acc = model.evaluate(X_test, y_test, verbose=0)
print(f"Test Accuracy: {acc:.2f}")

# save the model 
model.save("liver_cirrhosis_stage_predictor.h5")


# Predictions
y_pred_probs = model.predict(X_test)
y_pred = np.argmax(y_pred_probs, axis=1)
y_true = np.argmax(y_test, axis=1)

print("\nClassification Report:")
print(classification_report(y_true, y_pred))


# Confusion Matrix
# cm = confusion_matrix(y_true, y_pred)
# sns.heatmap(cm, annot=True, fmt="d", cmap="Blues",
#             xticklabels=[1,2,3], yticklabels=[1,2,3])
# plt.xlabel("Predicted")
# plt.ylabel("True")
# plt.title("Confusion Matrix")
# plt.show()

# ======================
# Plot Training History
# ======================
# plt.plot(history.history['accuracy'], label='Train Acc')
# plt.plot(history.history['val_accuracy'], label='Val Acc')
# plt.title("Training vs Validation Accuracy")
# plt.xlabel("Epochs")
# plt.ylabel("Accuracy")
# plt.legend()
# plt.show()




"""


# ======================
# Survival Analysis (Cox Model)
# ======================

# Reload raw data for survival analysis
df_survival = pd.read_csv(data)

# Define event (death) and duration
df_survival['Event'] = (df_survival['Status'] == 'D').astype(int)
df_survival['Duration'] = df_survival['N_Days']

# Drop unnecessary columns (Stage is classification target, Status is outcome label, N_Days is duration itself)
drop_cols = ['Status', 'N_Days']
df_survival = df_survival.drop(columns=drop_cols)

# Encode categorical columns
categorical_cols = ['Drug', 'Sex', 'Ascites', 'Hepatomegaly', 'Spiders', 'Edema']
le = LabelEncoder()
for col in categorical_cols:
    df_survival[col] = le.fit_transform(df_survival[col])

# Fill missing numeric values with median (important for CoxPH)
df_survival = df_survival.fillna(df_survival.median(numeric_only=True))
print(df_survival.iloc[1])

# Fit Cox Proportional Hazards model
cph = CoxPHFitter()
cph.fit(df_survival, duration_col='Duration', event_col='Event')

# Save Cox model
joblib.dump(cph, "liver_cirrhosis_cox.pkl")


# Print summary + plot
cph.print_summary()   # hazard ratios (impact of features)
cph.plot()
plt.show()
