import os
import re
import datetime
from typing import Dict, List, Any, Tuple
import pypdf
from app.config import settings
from app.models.entities import Student, Resume

# Common technical skill tokens for robust NLP extraction
SKILL_TAXONOMY = [
    "Python", "Java", "C++", "C", "JavaScript", "TypeScript", "SQL", "HTML", "CSS",
    "React", "Node.js", "FastAPI", "Django", "Flask", "Express", "Spring Boot",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Docker", "Kubernetes", "AWS", "Git",
    "Linux", "Embedded C", "ARM", "Microcontrollers", "Arduino", "ESP32", "RTOS", "FreeRTOS",
    "Verilog", "SystemVerilog", "FPGA", "VHDL", "Digital Electronics", "Analog Electronics",
    "PCB Design", "IoT", "MQTT", "Machine Learning", "Deep Learning", "NLP", "Computer Vision",
    "TensorFlow", "PyTorch", "Scikit-Learn", "Pandas", "NumPy", "Data Structures", "Algorithms",
    "OOP", "REST APIs", "GraphQL", "CI/CD", "Tailwind CSS"
]

class ResumeService:
    def __init__(self):
        self.upload_dir = settings.UPLOAD_DIR
        os.makedirs(self.upload_dir, exist_ok=True)

    def extract_text_from_file(self, file_path: str) -> str:
        text = ""
        ext = os.path.splitext(file_path)[1].lower()
        
        if ext == ".pdf":
            try:
                reader = pypdf.PdfReader(file_path)
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
            except Exception as e:
                print(f"[ResumeService] PDF extraction error: {e}")
        elif ext in [".docx", ".doc"]:
            try:
                import docx
                doc = docx.Document(file_path)
                for p in doc.paragraphs:
                    text += p.text + "\n"
            except Exception as e:
                print(f"[ResumeService] DOCX extraction error: {e}")
        else: # Plain text fallback
            try:
                with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                    text = f.read()
            except Exception as e:
                print(f"[ResumeService] Plain text read error: {e}")
                
        return text.strip()

    def parse_resume_entities(self, text: str) -> Dict[str, Any]:
        text_lower = text.lower()
        extracted_skills = []
        for skill in SKILL_TAXONOMY:
            pattern = r'\b' + re.escape(skill.lower()) + r'\b'
            if re.search(pattern, text_lower):
                extracted_skills.append(skill)
                
        # Detect sections
        has_projects = bool(re.search(r'\b(projects|academic projects|key projects)\b', text_lower))
        has_internships = bool(re.search(r'\b(internship|experience|work experience|employment)\b', text_lower))
        has_certifications = bool(re.search(r'\b(certifications|certificates|licenses|credentials)\b', text_lower))
        has_education = bool(re.search(r'\b(education|academic background|b\.tech|bachelor)\b', text_lower))
        
        # Domain Identification
        if any(s in extracted_skills for s in ["Embedded C", "Verilog", "ARM", "FPGA", "RTOS", "IoT"]):
            domain = "Embedded Systems & Core Hardware Engineering"
        elif any(s in extracted_skills for s in ["Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "NLP"]):
            domain = "Artificial Intelligence & Data Science"
        else:
            domain = "Full Stack & Cloud Software Engineering"
            
        return {
            "extracted_skills": extracted_skills,
            "has_projects": has_projects,
            "has_internships": has_internships,
            "has_certifications": has_certifications,
            "has_education": has_education,
            "identified_domain": domain
        }

    def generate_three_source_validation_matrix(
        self, student: Student, resume_skills: List[str]
    ) -> List[Dict[str, Any]]:
        """
        SOURCE 1: Student Profile
        SOURCE 2: Online Coding Activity
        SOURCE 3: Uploaded Resume
        Cross-verifies consistency without false accusations.
        """
        matrix = []
        
        # Collect profile skills
        profile_skills_map = {}
        if student.programming_progress:
            for p in student.programming_progress:
                if p.language:
                    profile_skills_map[p.language.name] = {
                        "level": p.skill_level,
                        "score": p.assessment_score,
                        "completion": p.completion_pct
                    }
                    
        # Add core DSA and project skills
        if student.dsa_progress:
            profile_skills_map["Data Structures & Algorithms"] = {"level": "Proficient", "score": 80.0}
        for prj in student.projects:
            for tech in (prj.technologies or []):
                profile_skills_map[tech] = {"level": "Applied Project Experience", "score": prj.completion_pct}
                
        # Coding activity evidence
        online_solved_total = 0
        coding_lang_evidence = {}
        if student.coding_activities:
            ca = student.coding_activities[0]
            online_solved_total = ca.total_solved
            coding_lang_evidence = ca.language_distribution or {}
            
        # Evaluate primary skills
        key_evaluation_skills = ["Python", "Java", "C++", "C", "SQL", "JavaScript", "React", "Embedded C", "DSA"]
        
        for skill in key_evaluation_skills:
            in_profile = skill in profile_skills_map or any(skill.lower() in k.lower() for k in profile_skills_map.keys())
            prof_level = profile_skills_map.get(skill, {}).get("level", "Intermediate") if in_profile else "Not in Profile"
            
            in_resume = skill in resume_skills or any(skill.lower() in s.lower() for s in resume_skills)
            
            # Coding platform evidence
            prob_solved = coding_lang_evidence.get(skill, {}).get("solved", 0) if isinstance(coding_lang_evidence, dict) else 0
            if skill == "DSA" and online_solved_total > 0:
                prob_solved = online_solved_total
                
            if prob_solved > 50:
                coding_evidence = f"Strong Evidence: {prob_solved} problems solved"
            elif prob_solved > 0:
                coding_evidence = f"Moderate Evidence: {prob_solved} problems solved"
            elif online_solved_total > 100:
                coding_evidence = "Indirect Evidence: Active on coding platform"
            else:
                coding_evidence = "Limited Platform Records"

            # Compute 3-source verdict
            if in_profile and in_resume and prob_solved > 20:
                verdict = "VERIFIED MATCH"
                note = "Strong multi-source consistency across Profile, Resume, and Online Coding platform."
            elif in_profile and in_resume:
                verdict = "MATCH"
                note = "Claimed in profile and validated in resume keywords."
            elif in_profile and not in_resume:
                verdict = "MISSING FROM RESUME"
                note = "Skill verified in profile curriculum but omitted in uploaded resume document."
            elif not in_profile and in_resume:
                verdict = "ADDITIONAL IN RESUME"
                note = "Present in resume but not tracked in student academic profile."
            else:
                verdict = "REVIEW RECOMMENDED"
                note = "Skill requires additional project or assessment validation."
                
            matrix.append({
                "skill": skill,
                "profile_status": "Present" if in_profile else "Not Listed",
                "profile_level": prof_level,
                "resume_status": "Detected" if in_resume else "Not Detected",
                "coding_platform_evidence": coding_evidence,
                "overall_verdict": verdict,
                "note": note
            })
            
        return matrix

    def analyze_resume_fit(self, student: Student, resume_text: str) -> Dict[str, Any]:
        parsed = self.parse_resume_entities(resume_text)
        resume_skills = parsed["extracted_skills"]
        
        # Profile skill set
        profile_skills = set()
        if student.programming_progress:
            for p in student.programming_progress:
                if p.language:
                    profile_skills.add(p.language.name)
        for prj in student.projects:
            for tech in (prj.technologies or []):
                profile_skills.add(tech)
                
        matching = [s for s in resume_skills if s in profile_skills or any(s.lower() == p.lower() for p in profile_skills)]
        missing_from_resume = [s for s in profile_skills if s not in resume_skills and not any(s.lower() == r.lower() for r in resume_skills)]
        additional_in_resume = [s for s in resume_skills if s not in profile_skills and not any(s.lower() == p.lower() for p in profile_skills)]
        
        inconsistencies = []
        if len(student.projects) > 0 and not parsed["has_projects"]:
            inconsistencies.append("Profile lists completed projects, but project section was not detected in resume.")
        if len(student.internships) > 0 and not parsed["has_internships"]:
            inconsistencies.append("Profile records an internship, but no work experience section was detected in resume.")
        if len(missing_from_resume) > 2:
            inconsistencies.append(f"High profile skills ({', '.join(missing_from_resume[:3])}) are missing from your resume.")

        # Fit score
        total_eval = max(1, len(profile_skills) + len(resume_skills))
        fit_score = round(min(98.0, max(45.0, (len(matching) * 2 / total_eval) * 100.0 + (15.0 if parsed['has_projects'] else 0.0))), 1)

        val_matrix = self.generate_three_source_validation_matrix(student, resume_skills)

        return {
            "extracted_skills": resume_skills,
            "identified_domain": parsed["identified_domain"],
            "overall_fit_score": fit_score,
            "matching_skills": matching,
            "missing_from_resume_skills": missing_from_resume,
            "additional_resume_skills": additional_in_resume,
            "inconsistencies": inconsistencies,
            "validation_matrix": val_matrix,
            "parsed_projects_count": len(student.projects),
            "parsed_internships_count": len(student.internships),
            "parsed_certifications_count": len(student.certifications)
        }

resume_service = ResumeService()
