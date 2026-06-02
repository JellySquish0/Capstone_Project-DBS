import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, confusion_matrix
from imblearn.over_sampling import SMOTE
import joblib

df = pd.read_csv('healthcare-dataset-stroke-data.csv')
data = df.copy()
data.dropna(subset=['bmi'], inplace=True)
data.drop(columns=['id'], errors='ignore', inplace=True)

# Membuat ulang sistem skor
data['high_risk_score'] = 0
data.loc[data['hypertension'] == 1, 'high_risk_score'] += 1
data.loc[data['heart_disease'] == 1, 'high_risk_score'] += 1
data.loc[data['smoking_status'] == 'smokes', 'high_risk_score'] += 1
data.loc[data['avg_glucose_level'] >= 126.0, 'high_risk_score'] += 1
data.loc[data['bmi'] >= 25.0, 'high_risk_score'] += 1

def tentukan_level_risiko(skor):
    if skor >= 3: return 'High Risk'
    elif skor in [1, 2]: return 'Caution'
    else: return 'Low Risk'

# INI ADALAH TARGET BARU KITA
data['risk_level'] = data['high_risk_score'].apply(tentukan_level_risiko)

X_mentah = data.drop(columns=['risk_level', 'high_risk_score', 'stroke'])

# Mengubah teks menjadi angka
X = pd.get_dummies(X_mentah, drop_first=True)

y = data['risk_level']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)

model = RandomForestClassifier(random_state=42)
model.fit(X_train_smote, y_train_smote)

y_pred = model.predict(X_test)

# Menampilkan tabel Confusion Matrix 3x3
tabel_hasil = confusion_matrix(y_test, y_pred)
tabel_df = pd.DataFrame(tabel_hasil,
                        columns=['Tebak Low', 'Tebak Caution', 'Tebak High'],
                        index=['Fakta Low', 'Fakta Caution', 'Fakta High'])

print("\nTabel Confusion Matrix (3x3):")
print(tabel_df)

print("\nLaporan Detail (Classification Report):")
print(classification_report(y_test, y_pred))

# Proses Inference
print("\n--- Berikut adalah proses inference Random Forest ---")

load_model = joblib.load('model_stroke_risk.pkl')
load_kolom = joblib.load('kolom_training.pkl') # Load the training columns

data_baru = pd.DataFrame({
    'gender': ["Male"], # Sesuaikan dengan kategori di dataset asli
    'age': [67],
    'hypertension': [1],
    'heart_disease': [1],
    'ever_married': ["Yes"],
    'work_type': ["Private"],
    'Residence_type': ["Urban"],
    'avg_glucose_level': [228.69],
    'bmi': [36.6],
    'smoking_status': ["formerly smoked"]
})


data_baru_processed = pd.get_dummies(data_baru, drop_first=True)

# Tambahkan Missing Colume jika ada
missing_cols = set(load_kolom) - set(data_baru_processed.columns)
for c in missing_cols:
    data_baru_processed[c] = 0

data_baru_processed = data_baru_processed[load_kolom] 
prediksi = load_model.predict(data_baru_processed)
probabilitas = load_model.predict_proba(data_baru_processed)
kelas = load_model.classes_

print(f"Hasil Klasifikasi : {prediksi[0]}")
print("\n Detail Probabilitas: ")

for i, label in enumerate(kelas):
    persen = probabilitas[0][i] * 100
    print(f"- {label:<12}: {persen:>6.2f}%")

# Memberikan rekomendasi sederhana berdasarkan hasil
if prediksi[0] == 'High Risk':
    print("\nREKOMENDASI: Segera konsultasi dengan dokter spesialis.")
elif prediksi[0] == 'Caution':
    print("\nREKOMENDASI: Perbaiki pola makan dan cek tekanan darah rutin.")
else:
    print("\nREKOMENDASI: Pertahankan gaya hidup sehat Anda!")