# 🩺 Liver Cirrhosis Stage & Survival Prediction

A machine learning and survival analysis system to assist in **liver cirrhosis detection and prognosis**.  
This project predicts **disease stage (1–3)** using a neural network and estimates **patient survival probability** with a Cox model.

---

## ✨ Features
- 🔬 **Stage Classification** – Neural Network predicts cirrhosis stage (1, 2, 3)  
- 📈 **Survival Analysis** – Cox model estimates survival curves over time  
- ⚠️ **Risk Assessment** – Hazard rates, risk scores, and median survival time  
- 🌐 **Web API + Dashboard** – Flask backend + React frontend for predictions  
- 📊 **Dataset** – Mayo Clinic’s Primary Biliary Cirrhosis (PBC) study (1974–1984)  

---

## 📂 Project Structure

├── dashboard/                 # React frontend
│   └── liver\_cirrhosis\_diagnosis/
│       ├── public/
│       ├── src/
│       └── package.json
├── server/                    # Flask backend
│   ├── server.py              # Main backend script
│   ├── models/                # Trained ML/DL models
│   ├── data/                  # Dataset
│   └── requirements.txt
├── README.md

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/SudoRV/Liver-Cirrhosis-Stage-Predictor.git
cd Liver-Cirrhosis-Stage-Predictor
````

### 2️⃣ Frontend Setup

```bash
cd dashboard/liver_cirrhosis_diagnosis
npm install
npm run build
mv build ../server
```

### 3️⃣ Backend Setup

```bash
cd server
pip install -r requirements.txt
python server.py
```

👉 Dashboard runs at: **[http://localhost:3000](http://localhost:5000)**

---

## 🔥 API Usage

**Endpoint:** `/predict`
**Method:** `POST`

### 📤 Sample Request

```json
{
  "Drug": "D-penicillamine",
  "Age": 19358,
  "Sex": "F",
  "Ascites": "N",
  "Hepatomegaly": "Y",
  "Spiders": "N",
  "Edema": "S",
  "Bilirubin": 1.2,
  "Cholesterol": 315,
  "Albumin": 3.5,
  "Copper": 156,
  "Alk_Phos": 1200,
  "SGOT": 80,
  "Tryglicerides": 90,
  "Platelets": 250,
  "Prothrombin": 10.6
}
```

### 📥 Sample Response

```json
{
  "stage_prediction": {
    "stage": 2,
    "probs": [0.12, 0.67, 0.21]
  },
  "survival_prediction": {
    "time_days": [...],
    "survival_probs": [...],
    "hazard": [...],
    "risk_score": 1.34,
    "median_survival_time": 2150
  }
}
```

✅ The API returns both **disease stage** and **personalized survival prognosis**, making it suitable for dashboards, clinical decision systems, or research tools.

---

## 🛠 Tech Stack

| Layer        | Technologies Used                                                    |
| ------------ | -------------------------------------------------------------------- |
| **Backend**  | 🐍 Flask · 🤖 TensorFlow · 📊 scikit-learn · ⏳ lifelines · 💾 joblib |
| **Frontend** | ⚛️ React · 🎨 TailwindCSS                                            |
| **Data**     | 📑 Mayo Clinic Primary Biliary Cirrhosis (PBC) Dataset (1974–1984)   |

---

## 📊 Example Visualizations (to be added)

* Survival curves over time
* Hazard function trends
* Stage prediction distribution

---

## 🙌 Acknowledgements

* Mayo Clinic PBC study (1974–1984) for dataset
* TensorFlow, scikit-learn, lifelines libraries
