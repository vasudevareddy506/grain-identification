import os
import sys

# Add the parent directory to system path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    print("Testing imports...")
    try:
        from app import database, models, schemas, auth, main, classifier
        print("SUCCESS: All backend modules imported successfully.")
    except Exception as e:
        print(f"FAILED: Import error: {e}")
        sys.exit(1)

def test_database():
    print("Testing database connections...")
    try:
        from app.database import SessionLocal, Base, engine
        from app.models import GrainDetail
        
        # Open session
        db = SessionLocal()
        count = db.query(GrainDetail).count()
        print(f"SUCCESS: Connected to database. Found {count} grain details seeded.")
        db.close()
    except Exception as e:
        print(f"FAILED: Database test error: {e}")
        sys.exit(1)

def test_auth():
    print("Testing authentication utilities...")
    try:
        from app.auth import hash_password, verify_password, create_access_token, decode_access_token
        
        pwd = "testpassword123"
        hashed = hash_password(pwd)
        
        # Verify
        assert verify_password(pwd, hashed) == True
        assert verify_password("wrongpassword", hashed) == False
        print("SUCCESS: Hashing and validation tests passed.")
        
        # Tokens
        token_data = {"sub": "test@grainvision.com"}
        token = create_access_token(token_data)
        decoded = decode_access_token(token)
        
        assert decoded is not None
        assert decoded["sub"] == "test@grainvision.com"
        print("SUCCESS: Token encoding/decoding tests passed.")
    except Exception as e:
        print(f"FAILED: Auth test error: {e}")
        sys.exit(1)

def test_classifier():
    print("Testing image classifier...")
    try:
        from app.classifier import classifier
        # Mock image bytes
        mock_bytes = b"fakedataimagebytesgrainclassificationsimulator"
        grain, confidence = classifier.predict(mock_bytes)
        print(f"SUCCESS: Classifier ran successfully. Prediction: {grain} ({confidence*100:.2f}%)")
    except Exception as e:
        print(f"FAILED: Classifier test error: {e}")
        sys.exit(1)

if __name__ == '__main__':
    print("=== STARTING BACKEND INTEGRITY VERIFICATION ===")
    test_imports()
    test_database()
    test_auth()
    test_classifier()
    print("=== ALL INTEGRITY TESTS PASSED SUCCESSFULLY ===")
