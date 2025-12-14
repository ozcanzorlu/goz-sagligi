# train_model.py

import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.preprocessing.image import ImageDataGenerator

# Veri seti yolu
data_dir = r"F:\PROJELER 2026\goz\Eye_diseases"

# Veri artırma ve ön işleme
datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)

# Eğitim veri jeneratörü
train_generator = datagen.flow_from_directory(
    data_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='training',
    color_mode='rgb'
)

# Doğrulama veri jeneratörü
val_generator = datagen.flow_from_directory(
    data_dir,
    target_size=(224, 224),
    batch_size=32,
    class_mode='categorical',
    subset='validation',
    color_mode='rgb'
)

# Model oluşturma (Transfer Learning - MobileNetV2)
from tensorflow.keras.applications import MobileNetV2

base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
base_model.trainable = False

model = models.Sequential([
    base_model,
    layers.GlobalAveragePooling2D(),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.2),
    layers.Dense(train_generator.num_classes, activation='softmax')
])

model.compile(optimizer='adam',
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Modeli eğit
history = model.fit(
    train_generator,
    epochs=10,
    validation_data=val_generator
)

# Modeli kaydet
model.save("eye_disease_model.h5")
print("Model eğitildi ve 'eye_disease_model.h5' olarak kaydedildi.")