from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import User, Student
from app.schemas.schemas import (
    Token, UserLogin, UserRegister, ForgotPasswordRequest, ResetPasswordRequest, ChangePasswordRequest
)
from app.auth.security import verify_password, get_password_hash, create_access_token
from app.auth.deps import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    if not user.is_active:
        raise HTTPException(status_code=400, detail="User account is inactive")
        
    access_token = create_access_token(subject=user.email)
    student = db.query(Student).filter(Student.user_id == user.id).first()
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "student_id": student.student_id if student else "SP-UNKNOWN",
        "name": student.name if student else user.email.split("@")[0],
        "department": student.department if student else "Engineering"
    }

@router.post("/register", response_model=Token)
def register(reg_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.email == reg_data.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    existing_student = db.query(Student).filter(Student.student_id == reg_data.student_id).first()
    if existing_student:
        raise HTTPException(status_code=400, detail="Student ID already registered")

    dept_code = "CSE"
    if "ECE" in reg_data.department or "Electronics" in reg_data.department:
        dept_code = "ECE"
    elif "AI" in reg_data.department:
        dept_code = "AIML"
    elif "IT" in reg_data.department:
        dept_code = "IT"
    elif "Mech" in reg_data.department:
        dept_code = "MECH"
        
    user = User(
        email=reg_data.email,
        hashed_password=get_password_hash(reg_data.password),
        is_active=True
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    student = Student(
        user_id=user.id,
        student_id=reg_data.student_id,
        name=reg_data.name,
        email=reg_data.email,
        department=reg_data.department,
        dept_code=dept_code,
        year=reg_data.year,
        semester=reg_data.semester,
        cgpa=8.45,
        attendance_pct=88.5,
        backlogs=0,
        career_interests=["Full Stack Software Engineer", "AI/ML Engineer"] if dept_code != "ECE" else ["Embedded Systems Engineer", "Full Stack Software Engineer"]
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    
    access_token = create_access_token(subject=user.email)
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "student_id": student.student_id,
        "name": student.name,
        "department": student.department
    }

@router.post("/forgot-password")
def forgot_password(req: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == req.email).first()
    if not user:
        # Avoid user enumeration in production; return success message
        return {"message": "If that email exists, a password reset token has been dispatched."}
    reset_token = create_access_token(subject=user.email)
    return {
        "message": "Password reset token generated successfully (for demonstration)",
        "reset_token": reset_token
    }

@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    from app.auth.security import decode_access_token
    payload = decode_access_token(req.token)
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")
    email = payload["sub"]
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password has been successfully updated"}

@router.get("/me")
def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    student = db.query(Student).filter(Student.user_id == current_user.id).first()
    return {
        "id": current_user.id,
        "email": current_user.email,
        "is_active": current_user.is_active,
        "student": {
            "id": student.id if student else None,
            "student_id": student.student_id if student else None,
            "name": student.name if student else None,
            "department": student.department if student else None,
            "dept_code": student.dept_code if student else None,
            "cgpa": student.cgpa if student else 0.0,
            "year": student.year if student else 3,
            "semester": student.semester if student else 6,
            "attendance_pct": student.attendance_pct if student else 0.0
        }
    }
