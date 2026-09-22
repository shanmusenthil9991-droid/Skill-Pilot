from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.entities import Student, Project, Internship, Certification, TrainingRecord
from app.auth.deps import get_current_student

router = APIRouter(prefix="/experience", tags=["Experience: Projects, Internships, Certifications, Training"])

@router.get("/projects")
def get_student_projects(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    projects = db.query(Project).filter(Project.student_id == current_student.id).all()
    results = []
    for p in projects:
        results.append({
            "id": p.id,
            "title": p.title,
            "domain": p.domain,
            "problem_statement": p.problem_statement,
            "technologies": p.technologies or [],
            "languages": p.languages or [],
            "frameworks": p.frameworks or [],
            "database": p.database,
            "apis_used": p.apis_used or [],
            "ai_ml_components": p.ai_ml_components,
            "deployment_platform": p.deployment_platform,
            "completion_pct": p.completion_pct,
            "student_role": p.student_role,
            "github_url": p.github_url,
            "live_url": p.live_url,
            "completed_components": p.completed_components or [],
            "pending_components": p.pending_components or []
        })
    return {
        "total_projects": len(results),
        "avg_completion_pct": round(sum(p["completion_pct"] for p in results) / max(1, len(results)), 1),
        "projects": results
    }

@router.get("/internships")
def get_student_internships(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    internships = db.query(Internship).filter(Internship.student_id == current_student.id).all()
    results = []
    for i in internships:
        results.append({
            "id": i.id,
            "company": i.company,
            "role": i.role,
            "domain": i.domain,
            "duration": i.duration,
            "start_date": i.start_date,
            "end_date": i.end_date,
            "technologies": i.technologies or [],
            "responsibilities": i.responsibilities,
            "skills_acquired": i.skills_acquired or [],
            "completed_tasks": i.completed_tasks or [],
            "pending_tasks": i.pending_tasks or [],
            "completion_pct": i.completion_pct
        })
    return {
        "total_internships": len(results),
        "internships": results
    }

@router.get("/certifications")
def get_student_certifications(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    certs = db.query(Certification).filter(Certification.student_id == current_student.id).all()
    results = []
    for c in certs:
        results.append({
            "id": c.id,
            "name": c.name,
            "provider": c.provider,
            "domain": c.domain,
            "issue_date": c.issue_date,
            "credential_id": c.credential_id,
            "credential_url": c.credential_url,
            "status": c.status
        })
    return {
        "total_certifications": len(results),
        "certifications": results
    }

@router.get("/training")
def get_student_training(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    trainings = db.query(TrainingRecord).filter(TrainingRecord.student_id == current_student.id).all()
    results = []
    total_completed_hours = 0
    total_hours_sum = 0
    for t in trainings:
        total_completed_hours += t.completed_hours
        total_hours_sum += t.total_hours
        results.append({
            "id": t.id,
            "training_name": t.training_name,
            "domain": t.domain,
            "completed_hours": t.completed_hours,
            "total_hours": t.total_hours,
            "completion_pct": t.completion_pct,
            "assessment_score": t.assessment_score,
            "modules_list": t.modules_list or []
        })
    return {
        "total_programs": len(results),
        "total_completed_hours": total_completed_hours,
        "total_scheduled_hours": total_hours_sum,
        "overall_completion_pct": round((total_completed_hours / max(1, total_hours_sum)) * 100, 1),
        "trainings": results
    }
