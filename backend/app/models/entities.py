import datetime
from sqlalchemy import (
    Column, Integer, String, Float, Boolean, Text, ForeignKey, DateTime, JSON
)
from sqlalchemy.orm import relationship
from app.database.session import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    
    # 1-to-1 relationship with Student profile
    student = relationship("Student", back_populates="user", uselist=False, cascade="all, delete-orphan")

class Student(Base):
    __tablename__ = "students"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    student_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False)
    department = Column(String(150), nullable=False)
    dept_code = Column(String(20), nullable=False)
    year = Column(Integer, default=3)
    semester = Column(Integer, default=6)
    cgpa = Column(Float, default=0.0)
    attendance_pct = Column(Float, default=0.0)
    backlogs = Column(Integer, default=0)
    career_interests = Column(JSON, default=list) # List of target roles
    phone = Column(String(30), default="+91 98765 43210")
    bio = Column(Text, default="Passionate engineering student striving to excel in technology, algorithms, and domain solutions.")
    github_url = Column(String(255), default="https://github.com/student-pilot")
    linkedin_url = Column(String(255), default="https://linkedin.com/in/student-pilot")
    leetcode_handle = Column(String(100), default="pilot_coder")
    codeforces_handle = Column(String(100), default="pilot_cf")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student")
    academic_records = relationship("AcademicRecord", back_populates="student", cascade="all, delete-orphan")
    programming_progress = relationship("ProgrammingProgress", back_populates="student", cascade="all, delete-orphan")
    dsa_progress = relationship("DSAProgress", back_populates="student", cascade="all, delete-orphan")
    aptitude_progress = relationship("AptitudeProgress", back_populates="student", cascade="all, delete-orphan")
    logical_progress = relationship("LogicalProgress", back_populates="student", cascade="all, delete-orphan")
    verbal_progress = relationship("VerbalProgress", back_populates="student", cascade="all, delete-orphan")
    communication = relationship("CommunicationRecord", back_populates="student", uselist=False, cascade="all, delete-orphan")
    certifications = relationship("Certification", back_populates="student", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="student", cascade="all, delete-orphan")
    internships = relationship("Internship", back_populates="student", cascade="all, delete-orphan")
    training_records = relationship("TrainingRecord", back_populates="student", cascade="all, delete-orphan")
    coding_activities = relationship("CodingActivity", back_populates="student", cascade="all, delete-orphan")
    skill_gaps = relationship("SkillGap", back_populates="student", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="student", cascade="all, delete-orphan")
    resumes = relationship("Resume", back_populates="student", cascade="all, delete-orphan")
    placement_prediction = relationship("PlacementPrediction", back_populates="student", uselist=False, cascade="all, delete-orphan")

# ----------------- ACADEMICS -----------------
class AcademicRecord(Base):
    __tablename__ = "academic_records"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    semester_number = Column(Integer, nullable=False)
    sgpa = Column(Float, nullable=False)
    credits_earned = Column(Integer, default=24)
    credits_total = Column(Integer, default=24)
    attendance_pct = Column(Float, default=85.0)
    backlogs = Column(Integer, default=0)
    
    student = relationship("Student", back_populates="academic_records")
    subjects = relationship("Subject", back_populates="academic_record", cascade="all, delete-orphan")

class Subject(Base):
    __tablename__ = "subjects"
    
    id = Column(Integer, primary_key=True, index=True)
    academic_record_id = Column(Integer, ForeignKey("academic_records.id"), nullable=False)
    subject_code = Column(String(50), nullable=False)
    subject_name = Column(String(150), nullable=False)
    grade = Column(String(5), nullable=False) # S, A, B, C, D, F
    marks_pct = Column(Float, nullable=False)
    credits = Column(Integer, default=4)
    attendance_pct = Column(Float, default=88.0)
    
    academic_record = relationship("AcademicRecord", back_populates="subjects")

# ----------------- PROGRAMMING LANGUAGES & TOPICS -----------------
class ProgrammingLanguage(Base):
    __tablename__ = "programming_languages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    icon_name = Column(String(50), default="code")
    description = Column(Text, default="")
    total_topics_count = Column(Integer, default=10)
    
    topics = relationship("ProgrammingTopic", back_populates="language", cascade="all, delete-orphan")
    progress_entries = relationship("ProgrammingProgress", back_populates="language", cascade="all, delete-orphan")

class ProgrammingTopic(Base):
    __tablename__ = "programming_topics"
    
    id = Column(Integer, primary_key=True, index=True)
    language_id = Column(Integer, ForeignKey("programming_languages.id"), nullable=False)
    topic_name = Column(String(100), nullable=False)
    order_index = Column(Integer, default=1)
    
    language = relationship("ProgrammingLanguage", back_populates="topics")

class ProgrammingProgress(Base):
    __tablename__ = "programming_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    language_id = Column(Integer, ForeignKey("programming_languages.id"), nullable=False)
    topics_completed = Column(Integer, default=0)
    total_topics = Column(Integer, default=10)
    completion_pct = Column(Float, default=0.0)
    assessment_score = Column(Float, default=0.0)
    questions_attempted = Column(Integer, default=0)
    questions_solved = Column(Integer, default=0)
    accuracy_pct = Column(Float, default=0.0)
    skill_level = Column(String(50), default="Beginner") # Beginner, Intermediate, Advanced, Proficient
    completed_topics_list = Column(JSON, default=list) # Strings of completed topics
    pending_topics_list = Column(JSON, default=list) # Strings of pending topics

    student = relationship("Student", back_populates="programming_progress")
    language = relationship("ProgrammingLanguage", back_populates="progress_entries")

# ----------------- DSA -----------------
class DSATopic(Base):
    __tablename__ = "dsa_topics"
    
    id = Column(Integer, primary_key=True, index=True)
    topic_name = Column(String(100), unique=True, nullable=False)
    category = Column(String(50), default="Core") # Fundamentals, Advanced, Algorithms
    total_curriculum_problems = Column(Integer, default=10)

class DSAProgress(Base):
    __tablename__ = "dsa_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    topic_name = Column(String(100), nullable=False)
    category = Column(String(50), default="Core")
    completed_problems = Column(Integer, default=0)
    total_problems = Column(Integer, default=10)
    completion_pct = Column(Float, default=0.0)
    accuracy_pct = Column(Float, default=0.0)
    assessment_score = Column(Float, default=0.0)
    skill_level = Column(String(50), default="Developing") # Needs Improvement, Developing, Proficient, Mastered
    status = Column(String(50), default="In Progress")

    student = relationship("Student", back_populates="dsa_progress")

# ----------------- COGNITIVE APTITUDE, LOGICAL & VERBAL -----------------
class AptitudeProgress(Base):
    __tablename__ = "aptitude_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    topic_name = Column(String(100), nullable=False)
    completed_modules = Column(Integer, default=5)
    total_modules = Column(Integer, default=10)
    accuracy_pct = Column(Float, default=0.0)
    assessment_score = Column(Float, default=0.0)
    questions_attempted = Column(Integer, default=0)
    questions_solved = Column(Integer, default=0)
    strength_level = Column(String(50), default="Moderate") # Weak, Moderate, Strong

    student = relationship("Student", back_populates="aptitude_progress")

class LogicalProgress(Base):
    __tablename__ = "logical_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    topic_name = Column(String(100), nullable=False)
    completed_modules = Column(Integer, default=5)
    total_modules = Column(Integer, default=10)
    accuracy_pct = Column(Float, default=0.0)
    assessment_score = Column(Float, default=0.0)
    status = Column(String(50), default="In Progress")
    strength_level = Column(String(50), default="Moderate")

    student = relationship("Student", back_populates="logical_progress")

class VerbalProgress(Base):
    __tablename__ = "verbal_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    topic_name = Column(String(100), nullable=False)
    completion_pct = Column(Float, default=0.0)
    accuracy_pct = Column(Float, default=0.0)
    assessment_score = Column(Float, default=0.0)
    is_weak_topic = Column(Boolean, default=False)

    student = relationship("Student", back_populates="verbal_progress")

# ----------------- COMMUNICATION -----------------
class CommunicationRecord(Base):
    __tablename__ = "communication_records"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True, nullable=False)
    overall_score = Column(Float, default=70.0)
    current_level = Column(String(50), default="Intermediate") # Novice, Intermediate, Fluent, Professional
    speaking_score = Column(Float, default=70.0)
    listening_score = Column(Float, default=75.0)
    writing_score = Column(Float, default=72.0)
    presentation_score = Column(Float, default=68.0)
    interview_comm_score = Column(Float, default=70.0)
    strengths = Column(JSON, default=list) # List of strengths
    weaknesses = Column(JSON, default=list) # List of weaknesses
    recommendations = Column(JSON, default=list) # Qualitative improvement items

    student = relationship("Student", back_populates="communication")

# ----------------- ONLINE CODING PLATFORM -----------------
class CodingActivity(Base):
    __tablename__ = "coding_activities"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    platform_name = Column(String(50), default="LeetCode") # LeetCode, Codeforces, HackerRank, GeeksforGeeks
    handle = Column(String(100), default="student_pilot")
    total_attempted = Column(Integer, default=0)
    total_solved = Column(Integer, default=0)
    easy_solved = Column(Integer, default=0)
    medium_solved = Column(Integer, default=0)
    hard_solved = Column(Integer, default=0)
    accuracy_pct = Column(Float, default=0.0)
    contest_rating = Column(Integer, default=1400)
    contests_count = Column(Integer, default=0)
    global_rank = Column(String(50), default="Top 15%")
    coding_streak_days = Column(Integer, default=7)
    recent_activity = Column(JSON, default=list) # Array of {date, count, problems}
    topic_distribution = Column(JSON, default=dict) # { "Arrays": { attempted, solved, accuracy }, ... }
    language_distribution = Column(JSON, default=dict) # { "Python": { attempted, solved, accuracy }, ... }

    student = relationship("Student", back_populates="coding_activities")

# ----------------- EXPERIENCE: PROJECTS, INTERNSHIPS, CERTS, TRAINING -----------------
class Certification(Base):
    __tablename__ = "certifications"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    name = Column(String(200), nullable=False)
    provider = Column(String(150), nullable=False)
    domain = Column(String(100), nullable=False)
    issue_date = Column(String(50), default="2025-11-10")
    credential_id = Column(String(100), default="CERT-SP-9821")
    credential_url = Column(String(255), default="https://skillpilot.edu/verify/cert")
    status = Column(String(50), default="Completed") # Completed, Expired, In Progress

    student = relationship("Student", back_populates="certifications")

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    title = Column(String(200), nullable=False)
    domain = Column(String(100), nullable=False)
    problem_statement = Column(Text, default="")
    technologies = Column(JSON, default=list)
    languages = Column(JSON, default=list)
    frameworks = Column(JSON, default=list)
    database = Column(String(100), default="PostgreSQL")
    apis_used = Column(JSON, default=list)
    ai_ml_components = Column(String(150), default="None")
    deployment_platform = Column(String(100), default="AWS / Docker")
    completion_pct = Column(Float, default=80.0)
    student_role = Column(String(150), default="Full Stack Developer / Architect")
    github_url = Column(String(255), default="https://github.com/skillpilot/project-demo")
    live_url = Column(String(255), default="https://project-demo.skillpilot.app")
    completed_components = Column(JSON, default=list)
    pending_components = Column(JSON, default=list)

    student = relationship("Student", back_populates="projects")

class Internship(Base):
    __tablename__ = "internships"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    company = Column(String(200), nullable=False)
    role = Column(String(150), nullable=False)
    domain = Column(String(100), nullable=False)
    duration = Column(String(50), default="3 Months")
    start_date = Column(String(50), default="June 2025")
    end_date = Column(String(50), default="August 2025")
    technologies = Column(JSON, default=list)
    responsibilities = Column(Text, default="")
    skills_acquired = Column(JSON, default=list)
    completed_tasks = Column(JSON, default=list)
    pending_tasks = Column(JSON, default=list)
    completion_pct = Column(Float, default=100.0)

    student = relationship("Student", back_populates="internships")

class TrainingRecord(Base):
    __tablename__ = "training_records"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    training_name = Column(String(200), nullable=False)
    domain = Column(String(100), nullable=False)
    completed_hours = Column(Integer, default=30)
    total_hours = Column(Integer, default=30)
    completion_pct = Column(Float, default=100.0)
    assessment_score = Column(Float, default=85.0)
    modules_list = Column(JSON, default=list)

    student = relationship("Student", back_populates="training_records")

# ----------------- CAREER & ECE DUAL-PATHWAY -----------------
class CareerDomain(Base):
    __tablename__ = "career_domains"
    
    id = Column(Integer, primary_key=True, index=True)
    domain_name = Column(String(150), unique=True, nullable=False)
    category = Column(String(50), default="Software") # Software, Core ECE, Core EEE, Core Mech, Core Civil, AI/Data
    description = Column(Text, default="")
    required_skills = Column(JSON, default=list)
    typical_roles = Column(JSON, default=list)
    growth_index = Column(Float, default=8.5)

class SkillGap(Base):
    __tablename__ = "skill_gaps"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    target_career_role = Column(String(150), nullable=False)
    skill_name = Column(String(100), nullable=False)
    current_level = Column(String(50), default="Novice")
    required_level = Column(String(50), default="Proficient")
    gap_severity = Column(String(50), default="Medium") # Low, Medium, High, Critical
    priority = Column(Integer, default=1)
    reason = Column(Text, default="")
    recommended_action = Column(Text, default="")

    student = relationship("Student", back_populates="skill_gaps")

class Recommendation(Base):
    __tablename__ = "recommendations"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    category = Column(String(50), default="Skills") # Coding, DSA, Aptitude, Core ECE, Resume, Experience
    title = Column(String(200), nullable=False)
    what = Column(Text, nullable=False)
    why = Column(Text, nullable=False)
    next_step = Column(Text, nullable=False)
    priority = Column(String(50), default="High") # High, Medium, Low
    is_completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="recommendations")

# ----------------- RESUME & 3-SOURCE VALIDATION -----------------
class Resume(Base):
    __tablename__ = "resumes"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    version = Column(Integer, default=1)
    upload_date = Column(DateTime, default=datetime.datetime.utcnow)
    extracted_text = Column(Text, default="")
    parsed_skills = Column(JSON, default=list)
    parsed_projects = Column(JSON, default=list)
    parsed_internships = Column(JSON, default=list)
    parsed_certifications = Column(JSON, default=list)
    parsed_education = Column(JSON, default=list)
    identified_domain = Column(String(100), default="Software Engineering")
    overall_fit_score = Column(Float, default=80.0)
    matching_skills = Column(JSON, default=list)
    missing_from_resume_skills = Column(JSON, default=list)
    additional_resume_skills = Column(JSON, default=list)
    inconsistencies = Column(JSON, default=list)
    validation_matrix = Column(JSON, default=list) # 3-source cross-verification records

    student = relationship("Student", back_populates="resumes")

# ----------------- ML PREDICTIONS & ANALYTICS -----------------
class PlacementPrediction(Base):
    __tablename__ = "placement_predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), unique=True, nullable=False)
    readiness_score = Column(Float, nullable=False) # 0.0 to 100.0%
    readiness_status = Column(String(50), nullable=False) # High Readiness, Moderate Readiness, Needs Focused Preparation
    confidence_level = Column(Float, default=0.92)
    model_used = Column(String(100), default="Random Forest Classifier (Ensemble)")
    top_positive_factors = Column(JSON, default=list)
    top_negative_factors = Column(JSON, default=list)
    feature_contributions = Column(JSON, default=dict)
    calculated_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="placement_prediction")

class MLModelRegistry(Base):
    __tablename__ = "ml_models"
    
    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String(100), unique=True, nullable=False)
    model_type = Column(String(100), nullable=False)
    accuracy = Column(Float, nullable=False)
    precision = Column(Float, nullable=False)
    recall = Column(Float, nullable=False)
    f1_score = Column(Float, nullable=False)
    roc_auc = Column(Float, nullable=False)
    confusion_matrix = Column(JSON, default=list)
    feature_importance = Column(JSON, default=dict)
    training_sample_size = Column(Integer, default=5000)
    trained_at = Column(DateTime, default=datetime.datetime.utcnow)
    is_active = Column(Boolean, default=True)
