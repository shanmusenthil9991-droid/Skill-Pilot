from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.entities import Student, Recommendation
from app.recommendations.recommendation_engine import recommendation_engine
from app.auth.deps import get_current_student

router = APIRouter(prefix="/recommendations", tags=["Personalized Recommendations"])

@router.get("")
def get_student_recommendations(
    current_student: Student = Depends(get_current_student)
):
    recommendations = recommendation_engine.generate_recommendations(current_student)
    return {
        "total_recommendations": len(recommendations),
        "recommendations": recommendations
    }
