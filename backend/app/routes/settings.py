from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.models.entities import User, Student
from app.schemas.schemas import ChangePasswordRequest
from app.auth.security import verify_password, get_password_hash
from app.auth.deps import get_current_user, get_current_student

router = APIRouter(prefix="/settings", tags=["Student Account & Settings"])

@router.post("/change-password")
def change_password(
    req: ChangePasswordRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not verify_password(req.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect"
        )
    current_user.hashed_password = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password updated successfully"}

@router.get("/preferences")
def get_preferences(current_student: Student = Depends(get_current_student)):
    return {
        "email_notifications": True,
        "placement_alerts": True,
        "weekly_coding_digest": True,
        "target_career_paths": current_student.career_interests or []
    }
