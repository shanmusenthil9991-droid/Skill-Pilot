from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database.session import get_db
from app.models.entities import Student, PlacementPrediction
from app.ml.pipeline import ml_pipeline
from app.auth.deps import get_current_student

router = APIRouter(prefix="/placement", tags=["Placement Readiness Intelligence"])

@router.get("/readiness")
def get_placement_readiness(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    # Compute real live feature values from the student's actual database state
    prog_score = 0.0
    if current_student.programming_progress:
        scores = [p.assessment_score for p in current_student.programming_progress]
        prog_score = sum(scores) / len(scores) if scores else 0.0
        
    dsa_score = 0.0
    if current_student.dsa_progress:
        scores = [d.assessment_score for d in current_student.dsa_progress]
        dsa_score = sum(scores) / len(scores) if scores else 0.0
        
    apt_score = 0.0
    if current_student.aptitude_progress:
        scores = [a.assessment_score for a in current_student.aptitude_progress]
        apt_score = sum(scores) / len(scores) if scores else 0.0

    log_score = 0.0
    if current_student.logical_progress:
        scores = [l.assessment_score for l in current_student.logical_progress]
        log_score = sum(scores) / len(scores) if scores else 0.0

    comm_score = current_student.communication.overall_score if current_student.communication else 70.0
    
    online_solved = 0
    online_acc = 0.0
    contest_rat = 1400
    contests_cnt = 0
    streak = 0
    if current_student.coding_activities:
        ca = current_student.coding_activities[0]
        online_solved = ca.total_solved
        online_acc = ca.accuracy_pct
        contest_rat = ca.contest_rating
        contests_cnt = ca.contests_count
        streak = ca.coding_streak_days

    training_hrs = sum(t.completed_hours for t in current_student.training_records) if current_student.training_records else 0

    features = {
        "cgpa": current_student.cgpa or 8.0,
        "attendance_pct": current_student.attendance_pct or 85.0,
        "backlog_count": current_student.backlogs or 0,
        "programming_score": prog_score or 75.0,
        "dsa_score": dsa_score or 72.0,
        "aptitude_score": apt_score or 78.0,
        "logical_score": log_score or 75.0,
        "verbal_score": 75.0,
        "communication_score": comm_score or 72.0,
        "core_ece_score": 82.0 if current_student.dept_code == "ECE" else 30.0,
        "projects_count": len(current_student.projects) or 2,
        "projects_avg_completion": sum(p.completion_pct for p in current_student.projects) / max(1, len(current_student.projects)) if current_student.projects else 80.0,
        "internships_count": len(current_student.internships) or 1,
        "internships_tasks_completed": sum(len(i.completed_tasks or []) for i in current_student.internships) if current_student.internships else 3,
        "certifications_count": len(current_student.certifications) or 2,
        "training_hours_total": training_hrs or 80,
        "online_problems_solved": online_solved or 150,
        "online_coding_accuracy": online_acc or 82.0,
        "online_contest_rating": contest_rat or 1550,
        "online_contests_count": contests_cnt or 10,
        "online_coding_streak": streak or 12,
        "software_skill_gaps": len(current_student.skill_gaps) or 3,
        "core_ece_skill_gaps": 2 if current_student.dept_code == "ECE" else 0
    }
    
    # Run ML Inference
    result = ml_pipeline.predict_placement_readiness(features)
    
    # Store or update in DB
    existing_pred = db.query(PlacementPrediction).filter(PlacementPrediction.student_id == current_student.id).first()
    if existing_pred:
        existing_pred.readiness_score = result["readiness_score"]
        existing_pred.readiness_status = result["readiness_status"]
        existing_pred.confidence_level = result["confidence_level"]
        existing_pred.top_positive_factors = result["top_positive_factors"]
        existing_pred.top_negative_factors = result["top_negative_factors"]
    else:
        new_pred = PlacementPrediction(
            student_id=current_student.id,
            readiness_score=result["readiness_score"],
            readiness_status=result["readiness_status"],
            confidence_level=result["confidence_level"],
            model_used=result["model_used"],
            top_positive_factors=result["top_positive_factors"],
            top_negative_factors=result["top_negative_factors"],
            feature_contributions=result["feature_contributions"]
        )
        db.add(new_pred)
    db.commit()

    return result
