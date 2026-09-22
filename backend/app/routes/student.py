from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.database.session import get_db
from app.models.entities import Student, AcademicRecord, Subject
from app.schemas.schemas import StudentUpdate, StudentProfileResponse
from app.auth.deps import get_current_student

router = APIRouter(prefix="/student", tags=["Student Profile & Academics"])

@router.get("/profile", response_model=StudentProfileResponse)
def get_profile(current_student: Student = Depends(get_current_student)):
    return {
        "id": current_student.id,
        "student_id": current_student.student_id,
        "name": current_student.name,
        "email": current_student.email,
        "department": current_student.department,
        "dept_code": current_student.dept_code,
        "year": current_student.year,
        "semester": current_student.semester,
        "cgpa": current_student.cgpa,
        "attendance_pct": current_student.attendance_pct,
        "backlogs": current_student.backlogs,
        "career_interests": current_student.career_interests or [],
        "phone": current_student.phone or "+91 98765 43210",
        "bio": current_student.bio or "",
        "github_url": current_student.github_url or "",
        "linkedin_url": current_student.linkedin_url or "",
        "leetcode_handle": current_student.leetcode_handle or "",
        "codeforces_handle": current_student.codeforces_handle or ""
    }

@router.put("/profile", response_model=StudentProfileResponse)
def update_profile(
    update_data: StudentUpdate,
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    if update_data.name is not None:
        current_student.name = update_data.name
    if update_data.phone is not None:
        current_student.phone = update_data.phone
    if update_data.bio is not None:
        current_student.bio = update_data.bio
    if update_data.career_interests is not None:
        current_student.career_interests = update_data.career_interests
    if update_data.github_url is not None:
        current_student.github_url = update_data.github_url
    if update_data.linkedin_url is not None:
        current_student.linkedin_url = update_data.linkedin_url
    if update_data.leetcode_handle is not None:
        current_student.leetcode_handle = update_data.leetcode_handle
    if update_data.codeforces_handle is not None:
        current_student.codeforces_handle = update_data.codeforces_handle
        
    db.commit()
    db.refresh(current_student)
    return current_student

@router.get("/academics")
def get_academic_performance(
    current_student: Student = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    records = db.query(AcademicRecord).filter(AcademicRecord.student_id == current_student.id).order_by(AcademicRecord.semester_number.asc()).all()
    
    semesters_data = []
    cgpa_trend = []
    cumulative_points = 0.0
    cumulative_credits = 0
    
    for r in records:
        cumulative_points += r.sgpa * r.credits_earned
        cumulative_credits += r.credits_earned
        current_calculated_cgpa = round(cumulative_points / max(1, cumulative_credits), 2)
        
        subjects_data = []
        for s in r.subjects:
            subjects_data.append({
                "subject_code": s.subject_code,
                "subject_name": s.subject_name,
                "grade": s.grade,
                "marks_pct": s.marks_pct,
                "credits": s.credits,
                "attendance_pct": s.attendance_pct
            })
            
        semesters_data.append({
            "semester_number": r.semester_number,
            "sgpa": r.sgpa,
            "calculated_cgpa": current_calculated_cgpa,
            "credits_earned": r.credits_earned,
            "credits_total": r.credits_total,
            "attendance_pct": r.attendance_pct,
            "backlogs": r.backlogs,
            "subjects": subjects_data
        })
        
        cgpa_trend.append({
            "semester": f"Sem {r.semester_number}",
            "sgpa": r.sgpa,
            "cgpa": current_calculated_cgpa,
            "attendance": r.attendance_pct
        })

    return {
        "overall_cgpa": current_student.cgpa,
        "overall_attendance_pct": current_student.attendance_pct,
        "total_backlogs": current_student.backlogs,
        "current_semester": current_student.semester,
        "cgpa_trend": cgpa_trend,
        "semesters": semesters_data
    }
