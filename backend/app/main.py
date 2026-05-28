import os
import shutil
import uuid
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime

from .database import engine, Base, get_db
from . import models, schemas, auth
from .seed_data import seed_db
from .classifier import classifier

# Initialize Database
Base.metadata.create_all(bind=engine)
# Seed Database
db = next(get_db())
seed_db(db)

app = FastAPI(
    title="Grain Vision API", 
    description="Machine Learning Powered Grain Identification API",
    version="1.0.0"
)

# CORS Configuration - essential for React Native connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOADS_DIR), name="uploads")


# --- AUTHENTICATION ROUTES ---

@app.post("/api/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_pwd = auth.hash_password(user_data.password)
    new_user = models.User(
        email=user_data.email,
        hashed_password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user_data: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if not user or not auth.verify_password(user_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = auth.create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


# --- GRAIN LIBRARY ROUTES ---

@app.get("/api/grains", response_model=List[schemas.GrainDetailResponse])
def get_grains(db: Session = Depends(get_db)):
    return db.query(models.GrainDetail).all()

@app.get("/api/grains/{name}", response_model=schemas.GrainDetailResponse)
def get_grain(name: str, db: Session = Depends(get_db)):
    grain = db.query(models.GrainDetail).filter(models.GrainDetail.name.ilike(name)).first()
    if not grain:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grain detail for '{name}' not found"
        )
    return grain


# --- PREDICTION ROUTE ---

@app.post("/api/predict")
async def predict_grain(
    file: UploadFile = File(...),
    notes: Optional[str] = Form(None),
    token: Optional[str] = Depends(auth.oauth2_scheme),
    db: Session = Depends(get_db)
):
    # Determine current user if token is valid
    user = None
    if token:
        user = auth.get_current_user(token=token, db=db)

    # Read file content
    contents = await file.read()
    
    # Classify image
    grain_type, confidence = classifier.predict(contents)
    
    # Generate unique filename for saving
    file_ext = os.path.splitext(file.filename)[1] or ".jpg"
    filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOADS_DIR, filename)
    
    # Save the file locally
    with open(file_path, "wb") as buffer:
        buffer.write(contents)
        
    # Relative path for serving
    web_image_path = f"/uploads/{filename}"
    
    # Retrieve details of identified grain
    grain_info = db.query(models.GrainDetail).filter(models.GrainDetail.name.ilike(grain_type)).first()
    
    # Save to history database (anonymous if not authenticated, or link to user)
    db_scan = models.Scan(
        user_id=user.id if user else None,
        grain_type=grain_type,
        confidence=confidence,
        image_path=web_image_path,
        notes=notes
    )
    db.add(db_scan)
    db.commit()
    db.refresh(db_scan)
    
    return {
        "id": db_scan.id,
        "grain_type": grain_type,
        "confidence": confidence,
        "image_path": web_image_path,
        "notes": notes,
        "created_at": db_scan.created_at,
        "grain_details": grain_info
    }


# --- SCAN HISTORY ROUTES ---

@app.get("/api/history", response_model=List[schemas.ScanResponse])
def get_scan_history(
    token: Optional[str] = Depends(auth.oauth2_scheme), 
    db: Session = Depends(get_db)
):
    user = auth.get_current_user(token=token, db=db) if token else None
    
    # Query history
    if user:
        scans = db.query(models.Scan).filter(models.Scan.user_id == user.id).order_by(models.Scan.created_at.desc()).all()
    else:
        # Fallback for anonymous users: return last 50 anonymous scans
        scans = db.query(models.Scan).filter(models.Scan.user_id == None).order_by(models.Scan.created_at.desc()).limit(50).all()
        
    return scans

@app.post("/api/history", response_model=schemas.ScanResponse)
def save_scan_history(
    scan: schemas.ScanCreate,
    token: Optional[str] = Depends(auth.oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = auth.get_current_user(token=token, db=db) if token else None
    
    new_scan = models.Scan(
        user_id=user.id if user else None,
        grain_type=scan.grain_type,
        confidence=scan.confidence,
        image_path=scan.image_path,
        notes=scan.notes
    )
    db.add(new_scan)
    db.commit()
    db.refresh(new_scan)
    return new_scan

@app.delete("/api/history/{scan_id}", status_code=status.HTTP_200_OK)
def delete_scan(
    scan_id: int,
    token: Optional[str] = Depends(auth.oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = auth.get_current_user(token=token, db=db) if token else None
    
    query = db.query(models.Scan).filter(models.Scan.id == scan_id)
    scan = query.first()
    
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan record not found"
        )
        
    # Security: user can only delete their own scans
    if user and scan.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this scan"
        )
        
    # Delete image file from storage if it exists
    if scan.image_path.startswith("/uploads/"):
        img_filename = scan.image_path.replace("/uploads/", "")
        local_file_path = os.path.join(UPLOADS_DIR, img_filename)
        if os.path.exists(local_file_path):
            try:
                os.remove(local_file_path)
            except Exception as e:
                print(f"Error deleting file: {e}")
                
    query.delete(synchronize_session=False)
    db.commit()
    return {"detail": "Scan deleted successfully"}


# --- ANALYTICS DASHBOARD ROUTE ---

@app.get("/api/analytics", response_model=schemas.AnalyticsResponse)
def get_analytics(
    token: Optional[str] = Depends(auth.oauth2_scheme),
    db: Session = Depends(get_db)
):
    user = auth.get_current_user(token=token, db=db) if token else None
    
    # Base query filter
    base_query = db.query(models.Scan)
    if user:
        base_query = base_query.filter(models.Scan.user_id == user.id)
    else:
        base_query = base_query.filter(models.Scan.user_id == None)
        
    scans = base_query.all()
    
    total_scans = len(scans)
    
    if total_scans == 0:
        return {
            "total_scans": 0,
            "average_confidence": 0.0,
            "class_distribution": {},
            "scan_history_by_date": {}
        }
        
    # Calculate avg confidence
    total_conf = sum([s.confidence for s in scans])
    avg_conf = float(total_conf / total_scans)
    
    # Class distribution
    dist = {}
    for s in scans:
        dist[s.grain_type] = dist.get(s.grain_type, 0) + 1
        
    # Daily scan history (past 7 days or all dates)
    history_by_date = {}
    for s in scans:
        date_str = s.created_at.strftime("%Y-%m-%d")
        history_by_date[date_str] = history_by_date.get(date_str, 0) + 1
        
    return {
        "total_scans": total_scans,
        "average_confidence": avg_conf,
        "class_distribution": dist,
        "scan_history_by_date": history_by_date
    }
