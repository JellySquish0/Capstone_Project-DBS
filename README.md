# Facial Stroke Early Sign Detection

# Deskripsi Singkat Proyek

Facial Stroke Early Sign Detection adalah aplikasi berbasis Deep Learning dan Computer Vision yang dirancang untuk mendeteksi indikasi awal stroke melalui analisis citra wajah dan data klinis pasien. Sistem menyediakan dashboard interaktif untuk menampilkan hasil prediksi serta visualisasi data sehingga membantu proses deteksi dini secara cepat, akurat, dan mudah dipahami.

# Petunjuk Setup Environment

## Prasyarat (Prerequisites)

Pastikan perangkat telah terinstal:

* Python 3.10 atau versi lebih baru
* Node.js 18 atau versi lebih baru
* npm
* Git

## Isolasi Lingkungan (Virtual Environment)

Virtual environment digunakan untuk memisahkan dependensi proyek dari proyek Python lainnya sehingga tidak terjadi konflik versi library.

### Membuat Virtual Environment

**Windows**

```bash
python -m venv venv
```

**Linux / MacOS**

```bash
python3 -m venv venv
```

### Mengaktifkan Virtual Environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / MacOS**

```bash
source venv/bin/activate
```

### Output yang Diharapkan

```text
(venv) C:\Users\User\Capstone_Project-DBS>
```

Setelah virtual environment aktif, lanjutkan ke tahap instalasi dependensi.

## Instalasi Dependensi

### Artificial Intelligence (Computer Vision API)

Masuk ke folder:

```bash
cd "Artificial Intelligence/computer vision_api/app"
```

Instal dependensi Python yang terdapat pada file `requirements.txt`:

```bash
pip install -r requirements.txt
```

### Dashboard Data Science

Masuk ke folder dashboard:

```bash
cd "Data Scientist/DASHBOARD"
```

Instal dependensi yang terdapat pada file `requirements.txt`:

```bash
pip install -r requirements.txt
```

### Backend

Masuk ke folder backend:

```bash
cd "Full-Stack/stroke-ai/backend"
```

Instal dependensi Node.js yang terdapat pada file `package.json`:

```bash
npm install
```

### Frontend

Masuk ke folder frontend:

```bash
cd "Full-Stack/stroke-ai/frontend"
```

Instal dependensi Node.js yang terdapat pada file `package.json`:

```bash
npm install
```

# Tautan Model ML

# 1. Model Prediksi Fisiologis (Random Forest)

Folder model:

https://github.com/JellySquish0/Capstone_Project-DBS/tree/main/Artificial%20Intelligence/Model%20Prediksi%20Fisiologis/model

File model:

* model_stroke_risk.pkl
* kolom_training.pkl

# 2. Model Computer Vision

Folder model:

https://github.com/JellySquish0/Capstone_Project-DBS/tree/main/Artificial%20Intelligence/computer%20vision_api/app/models

File model:

* model_xgb.pkl
* scaler.pkl

# Cara Menjalankan Aplikasi

## Menjalankan Backend

### Kondisi Awal

Pastikan seluruh dependensi backend telah terinstal.

### Perintah Eksekusi (Command)

```bash
cd "Full-Stack/stroke-ai/backend"
npm start
```

### Output yang Diharapkan

```text
http://localhost:3000
```

### Cara Penggunaan Singkat

Backend menyediakan layanan API yang digunakan oleh frontend dan modul lainnya.

## Menjalankan Frontend

### Kondisi Awal

Pastikan backend telah dijalankan dan seluruh dependensi frontend telah terinstal.

### Perintah Eksekusi (Command)

```bash
cd "Full-Stack/stroke-ai/frontend"
npm run dev
```

### Output yang Diharapkan

```text
http://localhost:5173
```

### Cara Penggunaan Singkat

Buka alamat tersebut melalui browser untuk mengakses aplikasi.

## Menjalankan Computer Vision API

### Kondisi Awal

Pastikan virtual environment aktif dan seluruh dependensi Python telah terinstal.

### Perintah Eksekusi (Command)

```bash
cd "Artificial Intelligence/computer vision_api/app"
uvicorn main:app --reload
```

### Output yang Diharapkan

```text
http://127.0.0.1:8000
```

Dokumentasi API:

```text
http://127.0.0.1:8000/docs
```

### Cara Penggunaan Singkat

API digunakan untuk menerima data hasil ekstraksi fitur wajah dan menghasilkan prediksi indikasi stroke.

## Menjalankan Dashboard Streamlit

### Kondisi Awal

Pastikan virtual environment aktif dan seluruh dependensi dashboard telah terinstal.

### Perintah Eksekusi (Command)

```bash
cd "Data Scientist/DASHBOARD"
streamlit run app.py
```

### Output yang Diharapkan

```text
http://localhost:8501
```

### Cara Penggunaan Singkat

Buka dashboard melalui browser untuk melihat visualisasi data dan hasil analisis.

## Akses Aplikasi Online

https://stroke-ai-three-fawn.vercel.app
