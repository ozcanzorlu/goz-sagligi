from flask import Flask, render_template, request, jsonify
from io import BytesIO
from PIL import Image
import numpy as np
import os
import traceback

app = Flask(__name__)

MODEL_PATH = "eye_disease_model.h5"
MODEL_INPUT_SIZE = (224, 224)

model = None
tf = None
try:
    import tensorflow as tf
    tf = tf
except Exception as e:
    print("TensorFlow yüklenemedi:", e)

if tf is not None:
    if os.path.exists(MODEL_PATH):
        try:
            print("Model yükleniyor...")
            model = tf.keras.models.load_model(MODEL_PATH)
            print("Model yüklendi.")
        except Exception:
            print("Model yüklenirken hata oluştu:")
            traceback.print_exc()
            model = None
    else:
        print(f"Model dosyası bulunamadı: {MODEL_PATH}")

class_names = [
    "swollen_eye",
    "cataract",
    "strabismus",
    "glaucoma",
    "uveitis",
    "healthy"
]

eng_to_tr = {
    "swollen_eye": "şiş göz",
    "cataract": "katarakt",
    "strabismus": "çapraz göz",
    "glaucoma": "glokom",
    "uveitis": "üveit",
    "healthy": "sağlıklı"
}

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/tahmin")
def tahmin():
    return render_template("yapay_zeka.html")

@app.route("/bilgi")
def bilgi():
    return render_template("bilgi.html")

@app.route("/oyunlar")
def oyunlar():
    return render_template("oyunlar.html")

@app.route("/predict", methods=["POST"])
def predict():
    try:
        if model is None:
            return jsonify({"error": "Model yüklenmedi veya TensorFlow yüklü değil."}), 500

        if "file" not in request.files:
            return jsonify({"error": "Dosya gönderilmedi."}), 400

        file = request.files["file"]
        if file.filename == "":
            return jsonify({"error": "Geçerli bir dosya seçilmedi."}), 400

        img_bytes = file.read()
        img = Image.open(BytesIO(img_bytes)).convert("RGB")
        img = img.resize(MODEL_INPUT_SIZE)
        arr = np.array(img).astype(np.float32) / 255.0
        arr = np.expand_dims(arr, axis=0)

        preds = model.predict(arr)
        preds = np.asarray(preds).squeeze()
        if preds.ndim == 0:
            return jsonify({"error": "Model beklenmedik çıktı döndürdü."}), 500

        idx = int(np.argmax(preds))
        confidence = float(preds[idx])

        eng_label = class_names[idx] if idx < len(class_names) else str(idx)
        tr_label = eng_to_tr.get(eng_label, eng_label)

        return jsonify({"class": tr_label, "confidence": confidence})

    except Exception as e:
        traceback.print_exc()
        return jsonify({"error": "Sunucu hatası: " + str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True, use_reloader=False)