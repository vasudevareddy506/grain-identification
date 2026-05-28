from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict
from datetime import datetime

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    created_at: datetime

    class Config:
        from_attributes = True

# Scan Schemas
class ScanCreate(BaseModel):
    grain_type: str
    confidence: float
    image_path: str
    notes: Optional[str] = None

class ScanResponse(BaseModel):
    id: int
    user_id: Optional[int] = None
    grain_type: str
    confidence: float
    image_path: str
    notes: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True

# Grain Detail Schemas
class GrainDetailResponse(BaseModel):
    id: int
    name: str
    description: str
    nutrition_calories: float
    nutrition_protein: float
    nutrition_carbs: float
    nutrition_fat: float
    nutrition_fiber: float
    cultivation_info: str
    uses: str
    translations_json: Optional[str] = None

    class Config:
        from_attributes = True

# Analytics Response Schema
class AnalyticsResponse(BaseModel):
    total_scans: int
    average_confidence: float
    class_distribution: Dict[str, int]
    scan_history_by_date: Dict[str, int]
