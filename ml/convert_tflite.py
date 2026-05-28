import os
import tensorflow as tf

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    models_dir = os.path.join(base_dir, 'models')
    model_path = os.path.join(models_dir, 'grain_model.h5')
    tflite_path = os.path.join(models_dir, 'grain_model.tflite')
    
    if not os.path.exists(model_path):
        print(f"Error: Keras model file {model_path} not found. Please train the model first by running train.py.")
        return
        
    print(f"Loading Keras model from {model_path}...")
    model = tf.keras.models.load_model(model_path)
    
    print("Converting model to TensorFlow Lite format...")
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    
    # Optional: Apply quantization for size optimization
    # converter.optimizations = [tf.lite.Optimize.DEFAULT]
    
    tflite_model = converter.convert()
    
    print(f"Saving TensorFlow Lite model to {tflite_path}...")
    with open(tflite_path, 'wb') as f:
        f.write(tflite_model)
        
    print("TFLite conversion completed successfully!")
    print(f"Original model size: {os.path.getsize(model_path) / (1024 * 1024):.2f} MB")
    print(f"TFLite model size: {os.path.getsize(tflite_path) / (1024 * 1024):.2f} MB")

if __name__ == '__main__':
    main()
