from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import Dict, Any, List
from app.database.session import get_db
from app.models.entities import Student, SkillGap
from app.career.career_engine import career_engine
from app.auth.deps import get_current_student

router = APIRouter(prefix="/career", tags=["Career Opportunities & ECE Dual-Pathway"])

@router.get("/domains")
def get_career_domains_analysis(
    current_student: Student = Depends(get_current_student)
):
    analysis = career_engine.calculate_student_career_alignment(current_student)
    return analysis

@router.get("/ece-dual-track")
def get_ece_dual_track(
    current_student: Student = Depends(get_current_student)
):
    analysis = career_engine.calculate_student_career_alignment(current_student)
    return analysis["ece_dual_track"]

@router.get("/skill-gaps")
def get_skill_gaps(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    gaps = db.query(SkillGap).filter(SkillGap.student_id == current_student.id).all()
    results = []
    for g in gaps:
        results.append({
            "id": g.id,
            "target_career_role": g.target_career_role,
            "skill_name": g.skill_name,
            "current_level": g.current_level,
            "required_level": g.required_level,
            "gap_severity": g.gap_severity,
            "priority": g.priority,
            "reason": g.reason,
            "recommended_action": g.recommended_action
        })
    return {
        "total_gaps": len(results),
        "gaps": results
    }
