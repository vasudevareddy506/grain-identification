from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    scans = relationship("Scan", back_populates="owner")

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    grain_type = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    image_path = Column(String, nullable=False)  # Local URL or base64 data
    notes = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    owner = relationship("User", back_populates="scans")

class GrainDetail(Base):
    __tablename__ = "grain_details"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True, nullable=False)
    description = Column(String, nullable=False)
    
    # Nutrition per 100g
    nutrition_calories = Column(Float, default=0.0)
    nutrition_protein = Column(Float, default=0.0)
    nutrition_carbs = Column(Float, default=0.0)
    nutrition_fat = Column(Float, default=0.0)
    nutrition_fiber = Column(Float, default=0.0)
    
    cultivation_info = Column(String, nullable=False)
    uses = Column(String, nullable=False)
    
    # Translations stored as JSON string (e.g. key-value for Spanish, French, Hindi)
    translations_json = Column(String, nullable=True)
