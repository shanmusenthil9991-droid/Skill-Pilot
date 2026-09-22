from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.entities import (
    Student, AptitudeProgress, LogicalProgress, VerbalProgress, CommunicationRecord
)
from app.auth.deps import get_current_student

router = APIRouter(prefix="/cognitive", tags=["Aptitude, Logical, Verbal & Communication"])

@router.get("/aptitude")
def get_aptitude_analysis(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    records = db.query(AptitudeProgress).filter(
        AptitudeProgress.student_id == current_student.id
    ).order_by(AptitudeProgress.id.asc()).all()
    
    topics = []
    for a in records:
        topics.append({
            "id": a.id,
            "topic_name": a.topic_name,
            "completed_modules": a.completed_modules,
            "total_modules": a.total_modules,
            "accuracy_pct": a.accuracy_pct,
            "assessment_score": a.assessment_score,
            "questions_attempted": a.questions_attempted,
            "questions_solved": a.questions_solved,
            "strength_level": a.strength_level
        })
        
    avg_score = round(sum(t["assessment_score"] for t in topics) / max(1, len(topics)), 1)
    avg_accuracy = round(sum(t["accuracy_pct"] for t in topics) / max(1, len(topics)), 1)
    
    return {
        "overall_aptitude_score": avg_score,
        "overall_accuracy_pct": avg_accuracy,
        "topics": topics,
        "strong_topics_count": len([t for t in topics if t["strength_level"] == "Strong"]),
        "weak_topics_count": len([t for t in topics if t["strength_level"] == "Weak"])
    }

@router.get("/logical")
def get_logical_reasoning_analysis(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    records = db.query(LogicalProgress).filter(
        LogicalProgress.student_id == current_student.id
    ).order_by(LogicalProgress.id.asc()).all()
    
    topics = []
    for l in records:
        topics.append({
            "id": l.id,
            "topic_name": l.topic_name,
            "completed_modules": l.completed_modules,
            "total_modules": l.total_modules,
            "accuracy_pct": l.accuracy_pct,
            "assessment_score": l.assessment_score,
            "status": l.status,
            "strength_level": l.strength_level
        })
        
    avg_score = round(sum(t["assessment_score"] for t in topics) / max(1, len(topics)), 1)
    return {
        "overall_logical_score": avg_score,
        "topics": topics
    }

@router.get("/verbal")
def get_verbal_ability_analysis(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    records = db.query(VerbalProgress).filter(
        VerbalProgress.student_id == current_student.id
    ).order_by(VerbalProgress.id.asc()).all()
    
    topics = []
    for v in records:
        topics.append({
            "id": v.id,
            "topic_name": v.topic_name,
            "completion_pct": v.completion_pct,
            "accuracy_pct": v.accuracy_pct,
            "assessment_score": v.assessment_score,
            "is_weak_topic": v.is_weak_topic
        })
        
    avg_score = round(sum(t["assessment_score"] for t in topics) / max(1, len(topics)), 1)
    return {
        "overall_verbal_score": avg_score,
        "topics": topics
    }

@router.get("/communication")
def get_communication_analysis(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    comm = db.query(CommunicationRecord).filter(
        CommunicationRecord.student_id == current_student.id
    ).first()
    
    if not comm:
        return {
            "overall_score": 74.0,
            "current_level": "Intermediate",
            "speaking_score": 72.0,
            "listening_score": 78.0,
            "writing_score": 75.0,
            "presentation_score": 70.0,
            "interview_comm_score": 75.0,
            "strengths": ["Structured technical articulation", "Active listening during team standups"],
            "weaknesses": ["Hesitation in impromptu technical Q&A", "Filler word frequency"],
            "recommendations": ["Participate in weekly mock behavioral interviews", "Practice STAR method responses"]
        }
        
    return {
        "overall_score": comm.overall_score,
        "current_level": comm.current_level,
        "speaking_score": comm.speaking_score,
        "listening_score": comm.listening_score,
        "writing_score": comm.writing_score,
        "presentation_score": comm.presentation_score,
        "interview_comm_score": comm.interview_comm_score,
        "strengths": comm.strengths or [],
        "weaknesses": comm.weaknesses or [],
        "recommendations": comm.recommendations or []
    }
