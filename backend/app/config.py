import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SkillPilot"
    PROJECT_TAGLINE: str = "Navigate Your Skills. Pilot Your Career."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    SECRET_KEY: str = os.environ.get("SECRET_KEY", "skillpilot-super-secret-production-jwt-key-2026-xyz-ai-flow")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Defaults to local SQLite database, seamlessly converts to PostgreSQL if DATABASE_URL is set
    DATABASE_URL: str = os.environ.get("DATABASE_URL", "sqlite:///./skillpilot.db")
    
    # ML and Dataset paths
    DATASET_PATH: str = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "data", "students_dataset.csv")
    MODELS_DIR: str = os.path.join(os.path.dirname(os.path.abspath(__file__)), "ml", "saved_models")
    UPLOAD_DIR: str = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uploads", "resumes")
    
    CORS_ORIGINS: list = ["*"]
    
    class Config:
        case_sensitive = True

settings = Settings()
