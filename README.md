# Grain Vision - Mobile Grain Identification App

"Grain Vision" is a modern mobile application that identifies and classifies types of grain (Rice, Wheat, Maize, Barley, Millet, Oats, Chickpeas, Corn, Pulses) using Machine Learning and image processing. It features real-time classification simulation, an analytics dashboard, speech output (Text-to-Speech), multi-language translation support, and offline prediction support.

## Project Structure

```
grain_vision/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI main router & endpoints
│   │   ├── auth.py            # JWT-like sessions & security
│   │   ├── database.py        # SQLite SQLAlchemy database setup
│   │   ├── models.py          # User, Scan, and GrainDetail tables
│   │   ├── schemas.py         # Request and response models
│   │   ├── classifier.py      # TF Lite model loader (with mock fallback)
│   │   └── seed_data.py       # Pre-seeded nutritional info and descriptions
│   ├── requirements.txt       # Backend dependencies
│   └── start_backend.bat      # Windows automated server launcher
├── ml/
│   ├── generate_dataset.py    # Draws synthetic training patterns using PIL
│   ├── train.py              # CNN trainer in TensorFlow/Keras
│   ├── convert_tflite.py      # TF Keras (.h5) to TF Lite (.tflite) converter
│   └── requirements_ml.txt    # ML dependencies
├── frontend/
│   ├── App.tsx                # React Native Expo app setup and navigators
│   ├── package.json           # Native mobile app dependencies
│   ├── tsconfig.json          # TypeScript config
│   └── src/
│       ├── components/        # GlassCard, ConfidenceGauge
│       ├── screens/           # Home, Scan, Result, Details, History, Settings
│       ├── hooks/             # ThemeContext (Dark/Light), TranslationContext
│       └── services/          # api.ts (backend bridge), localization.ts (string library)
└── README.md                  # This documentation
```

---

## 1. Machine Learning Pipeline (ml/)

If you want to train and export the CNN image classification model:

### Prerequisites:
Install Python 3.9+ and setup dependencies:
```bash
pip install -r ml/requirements_ml.txt
```

### Steps:
1. **Generate Synthetic Grain Images:**
   Runs a Pillow script to generate visual representations (~100 images per class) for training.
   ```bash
   python ml/generate_dataset.py
   ```
2. **Train Convolutional Neural Network (CNN):**
   Loads images, applies data augmentation (flips, rotations), trains the CNN model for 10 epochs, and outputs `ml/models/grain_model.h5`.
   ```bash
   python ml/train.py
   ```
3. **Convert to TensorFlow Lite:**
   Loads the trained model and converts it to `ml/models/grain_model.tflite` for mobile/server deployment:
   ```bash
   python ml/convert_tflite.py
   ```

---

## 2. Running the FastAPI Backend Server (backend/)

The backend hosts the SQLite database, stores user scan history, serves static uploads, and performs image inference.

### Steps:
1. **Launch Server:**
   Double-click the `start_backend.bat` script or run:
   ```bash
   pip install -r backend/requirements.txt
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   ```
2. **Access API Documentation (Swagger):**
   Open [http://localhost:8000/docs](http://localhost:8000/docs) in your browser.
<img width="1835" height="873" alt="image" src="https://github.com/user-attachments/assets/bf0bac72-4f3c-4c2d-9e65-6411ce530f3e" />

---

## 3. Running the Mobile Application (frontend/)

The app is built using **React Native with Expo** for fast compiling and modern UI overlays.

### Steps:
1. **Navigate and Install Dependencies:**
   ```bash
   cd frontend
   npm install
   ```
2. **Run the App:**
   - Run in web preview:
     ```bash
     npm run web
     ```
   - Run on mobile device:
     Install the **Expo Go** app on your phone, run `npx expo start`, and scan the QR code.
3. **Configure API Server IP (Optional):**
   If testing on a physical phone, go to **Settings** in the app, disable **Offline Prediction**, and enter your computer's local LAN IP address (e.g. `192.168.1.55:8000`).

---

## 4. Mobile Compilation & APK Generation Steps

To build a standalone Android package (`.apk`):

### Option A: Using Expo Application Services (EAS Build - Recommended)
1. **Install EAS CLI globally:**
   ```bash
   npm install -g eas-cli
   ```
2. **Login to Expo Account:**
   ```bash
   eas login
   ```
3. **Initialize project configuration:**
   ```bash
   eas project:init
   ```
4. **Configure `eas.json` for APK generation:**
   Add a build profile in `eas.json`:
   ```json
   {
     "build": {
       "preview": {
         "android": {
           "buildType": "apk"
         }
       }
     }
   }
   ```
5. **Start EAS Build:**
   ```bash
   eas build -p android --profile preview
   ```
   This will compile your project in the cloud and output a download link for the completed `.apk` file!

### Option B: Local Android Studio Build (Pre-build eject)
1. **Pre-build native directories:**
   ```bash
   npx expo prebuild
   ```
   This generates the `/android` directory.
2. **Build Release APK using Gradle:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   The compiled APK will be located at: `android/app/build/outputs/apk/release/app-release.apk`



   Team mumbers:
   B Vasudeva reddy    KUB23CSE019
   B M Lokesha         KUB23CSE020
   B Y Sanjay          KUB23CSE021
