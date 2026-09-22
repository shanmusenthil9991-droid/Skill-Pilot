from typing import List, Optional, Dict, Any
from pydantic import BaseModel, EmailStr

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    student_id: Optional[str] = None
    name: Optional[str] = None
    department: Optional[str] = None

class TokenPayload(BaseModel):
    sub: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str
    student_id: str
    department: str
    year: int = 3
    semester: int = 6

class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    token: str
    new_password: str

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

# Student Profile Schemas
class StudentUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    bio: Optional[str] = None
    career_interests: Optional[List[str]] = None
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    leetcode_handle: Optional[str] = None
    codeforces_handle: Optional[str] = None

class StudentProfileResponse(BaseModel):
    id: int
    student_id: str
    name: str
    email: str
    department: str
    dept_code: str
    year: int
    semester: int
    cgpa: float
    attendance_pct: float
    backlogs: int
    career_interests: List[str]
    phone: str
    bio: str
    github_url: str
    linkedin_url: str
    leetcode_handle: str
    codeforces_handle: str

# Programming Schemas
class ProgrammingProgressSchema(BaseModel):
    id: int
    language_name: str
    icon_name: str
    topics_completed: int
    total_topics: int
    completion_pct: float
    assessment_score: float
    questions_attempted: int
    questions_solved: int
    accuracy_pct: float
    skill_level: str
    completed_topics_list: List[str]
    pending_topics_list: List[str]

# DSA Schemas
class DSAProgressSchema(BaseModel):
    id: int
    topic_name: str
    category: str
    completed_problems: int
    total_problems: int
    completion_pct: float
    accuracy_pct: float
    assessment_score: float
    skill_level: str
    status: str

# Aptitude, Logical & Verbal
class AptitudeItemSchema(BaseModel):
    id: int
    topic_name: str
    completed_modules: int
    total_modules: int
    accuracy_pct: float
    assessment_score: float
    questions_attempted: int
    questions_solved: int
    strength_level: str

class LogicalItemSchema(BaseModel):
    id: int
    topic_name: str
    completed_modules: int
    total_modules: int
    accuracy_pct: float
    assessment_score: float
    status: str
    strength_level: str

class VerbalItemSchema(BaseModel):
    id: int
    topic_name: str
    completion_pct: float
    accuracy_pct: float
    assessment_score: float
    is_weak_topic: bool

class CommunicationSchema(BaseModel):
    overall_score: float
    current_level: str
    speaking_score: float
    listening_score: float
    writing_score: float
    presentation_score: float
    interview_comm_score: float
    strengths: List[str]
    weaknesses: List[str]
    recommendations: List[str]

# Online Coding Platform
class CodingActivitySchema(BaseModel):
    platform_name: str
    handle: str
    total_attempted: int
    total_solved: int
    easy_solved: int
    medium_solved: int
    hard_solved: int
    accuracy_pct: float
    contest_rating: int
    contests_count: int
    global_rank: str
    coding_streak_days: int
    recent_activity: List[Dict[str, Any]]
    topic_distribution: Dict[str, Any]
    language_distribution: Dict[str, Any]

# Experience: Projects, Internships, Certifications, Training
class ProjectSchema(BaseModel):
    id: int
    title: str
    domain: str
    problem_statement: str
    technologies: List[str]
    languages: List[str]
    frameworks: List[str]
    database: str
    apis_used: List[str]
    ai_ml_components: str
    deployment_platform: str
    completion_pct: float
    student_role: str
    github_url: str
    live_url: str
    completed_components: List[str]
    pending_components: List[str]

class InternshipSchema(BaseModel):
    id: int
    company: str
    role: str
    domain: str
    duration: str
    start_date: str
    end_date: str
    technologies: List[str]
    responsibilities: str
    skills_acquired: List[str]
    completed_tasks: List[str]
    pending_tasks: List[str]
    completion_pct: float

class CertificationSchema(BaseModel):
    id: int
    name: str
    provider: str
    domain: str
    issue_date: str
    credential_id: str
    credential_url: str
    status: str

class TrainingSchema(BaseModel):
    id: int
    training_name: str
    domain: str
    completed_hours: int
    total_hours: int
    completion_pct: float
    assessment_score: float
    modules_list: List[str]

# Career & ECE Dual-Track
class CareerDomainScore(BaseModel):
    domain_name: str
    category: str
    alignment_score: float
    matching_skills: List[str]
    missing_skills: List[str]
    recommended_roles: List[str]
    growth_index: float

class ECEDualTrackResponse(BaseModel):
    department: str
    is_ece: bool
    core_ece_alignment_pct: float
    software_cs_alignment_pct: float
    core_ece_domains: List[CareerDomainScore]
    software_cs_domains: List[CareerDomainScore]
    core_ece_gaps: List[Dict[str, Any]]
    software_cs_gaps: List[Dict[str, Any]]
    primary_recommendation: str

# Skill Gap & Recommendations
class SkillGapSchema(BaseModel):
    id: int
    target_career_role: str
    skill_name: str
    current_level: str
    required_level: str
    gap_severity: str
    priority: int
    reason: str
    recommended_action: str

class RecommendationSchema(BaseModel):
    id: int
    category: str
    title: str
    what: str
    why: str
    next_step: str
    priority: str
    is_completed: bool

# Resume & 3-Source Validation
class ValidationMatrixItem(BaseModel):
    skill: str
    profile_status: str
    profile_level: str
    resume_status: str
    coding_platform_evidence: str
    overall_verdict: str
    note: str

class ResumeAnalysisResponse(BaseModel):
    id: int
    file_name: str
    version: int
    upload_date: str
    identified_domain: str
    overall_fit_score: float
    matching_skills: List[str]
    missing_from_resume_skills: List[str]
    additional_resume_skills: List[str]
    inconsistencies: List[str]
    parsed_projects_count: int
    parsed_internships_count: int
    parsed_certifications_count: int
    validation_matrix: List[ValidationMatrixItem]

# Placement Readiness & ML Analytics
class PlacementReadinessResponse(BaseModel):
    readiness_score: float
    readiness_status: str
    confidence_level: float
    model_used: str
    top_positive_factors: List[Dict[str, Any]]
    top_negative_factors: List[Dict[str, Any]]
    feature_contributions: Dict[str, float]
    disclaimer: str

class MLAnalyticsResponse(BaseModel):
    dataset_scale: Dict[str, Any]
    feature_importance: Dict[str, float]
    models_comparison: List[Dict[str, Any]]
    confusion_matrix: List[List[int]]
    correlation_data: Dict[str, Any]
    eda_summary: Dict[str, Any]
