"""
SkillPilot - Synthetic Student Skill & Career Intelligence Dataset Generator
Generates realistic, internally consistent student records across 8 engineering departments.
Supports configurable scale (default: 5,000 records).
"""

import os
import json
import random
import numpy as np
import pandas as pd
from typing import Dict, List, Any

# Set random seeds for reproducibility
SEED = 42
random.seed(SEED)
np.random.seed(SEED)

DATASET_SIZE = int(os.environ.get("DATASET_SIZE", 5000))
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_CSV = os.path.join(BASE_DIR, "students_dataset.csv")
OUTPUT_META = os.path.join(BASE_DIR, "dataset_metadata.json")

DEPARTMENTS = [
    "Computer Science and Engineering (CSE)",
    "Information Technology (IT)",
    "Artificial Intelligence & Machine Learning (AI/ML)",
    "Artificial Intelligence & Data Science (AI & DS)",
    "Electronics and Communication Engineering (ECE)",
    "Electrical and Electronics Engineering (EEE)",
    "Mechanical Engineering",
    "Civil Engineering"
]

DEPT_CODES = {
    "Computer Science and Engineering (CSE)": "CSE",
    "Information Technology (IT)": "IT",
    "Artificial Intelligence & Machine Learning (AI/ML)": "AIML",
    "Artificial Intelligence & Data Science (AI & DS)": "AIDS",
    "Electronics and Communication Engineering (ECE)": "ECE",
    "Electrical and Electronics Engineering (EEE)": "EEE",
    "Mechanical Engineering": "MECH",
    "Civil Engineering": "CIVIL"
}

FIRST_NAMES = [
    "Aarav", "Aditi", "Aditya", "Akash", "Ananya", "Aniket", "Anushka", "Arjun",
    "Bhavya", "Chetan", "Deepika", "Dev", "Divya", "Gaurav", "Harsh", "Ishaan",
    "Kavya", "Kiran", "Manish", "Meera", "Neha", "Nikhil", "Pooja", "Pranav",
    "Priya", "Rahul", "Riya", "Rohan", "Sanjay", "Siddharth", "Sneha", "Tanvi",
    "Tarun", "Varun", "Vikram", "Yash", "Zoya", "Alex", "Elena", "Marcus"
]

LAST_NAMES = [
    "Sharma", "Verma", "Patel", "Reddy", "Nair", "Iyer", "Rao", "Gupta",
    "Singh", "Kumar", "Joshi", "Deshmukh", "Kulkarni", "Bhat", "Mehta",
    "Chopra", "Das", "Menon", "Sen", "Pillai", "Agarwal", "Banerjee", "Kapoor"
]

PROGRAMMING_LANGS = ["C", "C++", "Java", "Python", "JavaScript", "SQL"]

DSA_TOPICS = [
    "Arrays", "Strings", "Linked Lists", "Stack", "Queue",
    "Hashing", "Searching", "Sorting", "Recursion", "Trees",
    "Graphs", "Greedy", "Dynamic Programming", "Backtracking", "Complexity"
]

APTITUDE_TOPICS = [
    "Number System", "HCF & LCM", "Ratio & Proportion", "Percentage",
    "Average", "Profit & Loss", "Simple Interest", "Compound Interest",
    "Time & Work", "Time & Distance", "Probability", "Permutation & Combination",
    "Data Interpretation", "Mixtures & Alligations", "Ages", "Algebra", "Geometry"
]

LOGICAL_TOPICS = [
    "Number Series", "Alphabet Series", "Coding-Decoding", "Blood Relations",
    "Directions", "Ranking", "Seating Arrangement", "Syllogism",
    "Statement & Conclusion", "Analogy", "Clock & Calendar", "Cubes & Dice", "Puzzles"
]

VERBAL_TOPICS = [
    "Grammar", "Vocabulary", "Reading Comprehension", "Sentence Correction",
    "Para Jumbles", "Synonyms & Antonyms", "Fill in the Blanks"
]

def clamp(val, min_val=0.0, max_val=100.0):
    return max(min_val, min(max_val, val))

def generate_student_record(idx: int) -> Dict[str, Any]:
    dept = random.choices(
        DEPARTMENTS,
        weights=[0.24, 0.16, 0.14, 0.12, 0.16, 0.08, 0.05, 0.05],
        k=1
    )[0]
    dept_code = DEPT_CODES[dept]
    
    first_name = random.choice(FIRST_NAMES)
    last_name = random.choice(LAST_NAMES)
    student_id = f"SP2026{dept_code[:3].upper()}{idx+1:04d}"
    email = f"{first_name.lower()}.{last_name.lower()}{idx+1}@skillpilot.edu"
    
    year = random.choice([3, 4]) # Pre-final and final year students
    semester = year * 2 - random.choice([0, 1])

    # Archetype selection to model real human skill diversity
    # 0: High CGPA + Low hands-on coding
    # 1: Avg CGPA + Elite competitive programmer & DSA master
    # 2: High Aptitude/Cognitive + Developing Communication
    # 3: ECE Core Specialist (Embedded / VLSI / IoT high, CS moderate)
    # 4: ECE Software Switcher (Web / Python / DSA high, Core low)
    # 5: High Project Builder + Developing Formal Experience
    # 6: Balanced High Achiever Across Dimensions
    # 7: Developing / Emerging Learner
    archetype = random.choices(
        range(8),
        weights=[0.14, 0.14, 0.12, 0.10, 0.10, 0.12, 0.16, 0.12],
        k=1
    )[0]

    # Base academic metrics
    if archetype == 0:
        cgpa = round(random.uniform(8.8, 9.8), 2)
        attendance = round(random.uniform(88.0, 98.0), 1)
        backlogs = 0
        base_coding = random.uniform(35.0, 55.0)
        base_dsa = random.uniform(30.0, 50.0)
        base_aptitude = random.uniform(75.0, 92.0)
        base_comm = random.uniform(65.0, 85.0)
        online_prob_base = random.randint(30, 90)
    elif archetype == 1:
        cgpa = round(random.uniform(6.5, 7.8), 2)
        attendance = round(random.uniform(72.0, 84.0), 1)
        backlogs = random.choice([0, 0, 0, 1])
        base_coding = random.uniform(82.0, 96.0)
        base_dsa = random.uniform(80.0, 95.0)
        base_aptitude = random.uniform(78.0, 90.0)
        base_comm = random.uniform(60.0, 78.0)
        online_prob_base = random.randint(250, 600)
    elif archetype == 2:
        cgpa = round(random.uniform(7.2, 8.5), 2)
        attendance = round(random.uniform(78.0, 90.0), 1)
        backlogs = 0
        base_coding = random.uniform(60.0, 78.0)
        base_dsa = random.uniform(55.0, 75.0)
        base_aptitude = random.uniform(86.0, 98.0)
        base_comm = random.uniform(38.0, 56.0)
        online_prob_base = random.randint(90, 220)
    elif archetype == 3: # ECE Core Specialist
        cgpa = round(random.uniform(7.8, 9.2), 2)
        attendance = round(random.uniform(80.0, 94.0), 1)
        backlogs = 0
        base_coding = random.uniform(50.0, 68.0)
        base_dsa = random.uniform(40.0, 60.0)
        base_aptitude = random.uniform(70.0, 85.0)
        base_comm = random.uniform(65.0, 82.0)
        online_prob_base = random.randint(50, 140)
    elif archetype == 4: # ECE Software Switcher
        cgpa = round(random.uniform(7.0, 8.4), 2)
        attendance = round(random.uniform(75.0, 88.0), 1)
        backlogs = 0
        base_coding = random.uniform(78.0, 92.0)
        base_dsa = random.uniform(72.0, 90.0)
        base_aptitude = random.uniform(72.0, 88.0)
        base_comm = random.uniform(68.0, 85.0)
        online_prob_base = random.randint(180, 420)
    elif archetype == 5: # High projects
        cgpa = round(random.uniform(7.2, 8.6), 2)
        attendance = round(random.uniform(76.0, 88.0), 1)
        backlogs = 0
        base_coding = random.uniform(75.0, 90.0)
        base_dsa = random.uniform(65.0, 80.0)
        base_aptitude = random.uniform(68.0, 82.0)
        base_comm = random.uniform(72.0, 88.0)
        online_prob_base = random.randint(120, 280)
    elif archetype == 6: # Balanced High Achiever
        cgpa = round(random.uniform(8.5, 9.7), 2)
        attendance = round(random.uniform(85.0, 96.0), 1)
        backlogs = 0
        base_coding = random.uniform(85.0, 96.0)
        base_dsa = random.uniform(82.0, 95.0)
        base_aptitude = random.uniform(84.0, 96.0)
        base_comm = random.uniform(80.0, 95.0)
        online_prob_base = random.randint(220, 520)
    else: # Moderate developing
        cgpa = round(random.uniform(6.0, 7.4), 2)
        attendance = round(random.uniform(68.0, 80.0), 1)
        backlogs = random.choice([0, 1, 2])
        base_coding = random.uniform(42.0, 62.0)
        base_dsa = random.uniform(35.0, 55.0)
        base_aptitude = random.uniform(50.0, 68.0)
        base_comm = random.uniform(50.0, 68.0)
        online_prob_base = random.randint(20, 90)

    # Department-level modifiers
    is_cs_it = dept_code in ["CSE", "IT", "AIML", "AIDS"]
    is_ece = dept_code == "ECE"
    is_eee = dept_code == "EEE"
    is_mech_civil = dept_code in ["MECH", "CIVIL"]

    if is_cs_it:
        prog_score = clamp(base_coding + random.uniform(2, 8))
        dsa_score = clamp(base_dsa + random.uniform(2, 8))
        core_ece_score = clamp(random.uniform(20, 45))
        core_mech_score = clamp(random.uniform(15, 35))
    elif is_ece:
        if archetype == 3: # ECE Core Specialist
            core_ece_score = clamp(random.uniform(78, 95))
            prog_score = clamp(base_coding - random.uniform(0, 8))
            dsa_score = clamp(base_dsa - random.uniform(0, 8))
        elif archetype == 4: # ECE Software Switcher
            core_ece_score = clamp(random.uniform(40, 60))
            prog_score = clamp(base_coding + random.uniform(2, 6))
            dsa_score = clamp(base_dsa + random.uniform(2, 6))
        else:
            core_ece_score = clamp(random.uniform(55, 82))
            prog_score = clamp(base_coding)
            dsa_score = clamp(base_dsa)
        core_mech_score = clamp(random.uniform(25, 45))
    elif is_eee:
        core_ece_score = clamp(random.uniform(60, 80))
        prog_score = clamp(base_coding - random.uniform(5, 12))
        dsa_score = clamp(base_dsa - random.uniform(5, 12))
        core_mech_score = clamp(random.uniform(30, 50))
    else: # Mech / Civil
        core_ece_score = clamp(random.uniform(20, 40))
        core_mech_score = clamp(random.uniform(65, 92))
        prog_score = clamp(base_coding - random.uniform(10, 20))
        dsa_score = clamp(base_dsa - random.uniform(10, 20))

    aptitude_score = clamp(base_aptitude + random.uniform(-4, 4))
    logical_score = clamp((aptitude_score * 0.6) + (dsa_score * 0.4) + random.uniform(-5, 5))
    verbal_score = clamp(base_comm + random.uniform(-6, 6))
    comm_score = clamp(base_comm + random.uniform(-4, 4))

    # Experience details
    if archetype == 5:
        project_count = random.randint(3, 5)
        project_completion_pct = round(random.uniform(85.0, 100.0), 1)
        internship_count = random.choice([0, 1])
        internship_completed_tasks = 3 if internship_count > 0 else 0
        cert_count = random.randint(3, 6)
        training_hours = random.randint(80, 150)
    elif archetype == 6:
        project_count = random.randint(3, 4)
        project_completion_pct = round(random.uniform(90.0, 100.0), 1)
        internship_count = random.randint(1, 2)
        internship_completed_tasks = random.randint(4, 5)
        cert_count = random.randint(3, 5)
        training_hours = random.randint(100, 160)
    elif archetype == 1:
        project_count = random.randint(2, 3)
        project_completion_pct = round(random.uniform(75.0, 95.0), 1)
        internship_count = random.choice([0, 1, 2])
        internship_completed_tasks = 4 if internship_count > 0 else 0
        cert_count = random.randint(1, 3)
        training_hours = random.randint(60, 120)
    elif archetype == 0:
        project_count = random.randint(1, 2)
        project_completion_pct = round(random.uniform(60.0, 80.0), 1)
        internship_count = random.choice([0, 0, 1])
        internship_completed_tasks = 2 if internship_count > 0 else 0
        cert_count = random.randint(1, 3)
        training_hours = random.randint(40, 80)
    else:
        project_count = random.randint(1, 3)
        project_completion_pct = round(random.uniform(60.0, 85.0), 1)
        internship_count = random.choice([0, 1])
        internship_completed_tasks = random.randint(2, 4) if internship_count > 0 else 0
        cert_count = random.randint(1, 3)
        training_hours = random.randint(40, 90)

    # Online coding details
    online_solved = online_prob_base
    online_attempted = int(online_solved * random.uniform(1.1, 1.35))
    coding_accuracy = round((online_solved / max(1, online_attempted)) * 100, 1)
    
    easy_solved = int(online_solved * random.uniform(0.40, 0.55))
    medium_solved = int(online_solved * random.uniform(0.35, 0.45))
    hard_solved = max(0, online_solved - easy_solved - medium_solved)
    
    contest_rating = int(1200 + (dsa_score * 7.5) + (online_solved * 0.6) + random.uniform(-50, 50))
    contest_rating = max(1100, min(2400, contest_rating))
    contest_count = max(0, int((contest_rating - 1200) / 45) + random.randint(0, 5))
    coding_streak_days = random.randint(1, 45) if online_solved > 100 else random.randint(0, 12)

    # Language breakdowns (Completion % and Assessment Score)
    lang_stats = {}
    for lang in PROGRAMMING_LANGS:
        if lang in ["Python", "C++", "Java"] and is_cs_it:
            comp = round(clamp(prog_score + random.uniform(-10, 8)), 1)
            score = round(clamp(prog_score + random.uniform(-8, 6)), 1)
        elif lang in ["C", "C++"] and is_ece:
            comp = round(clamp(core_ece_score + random.uniform(-10, 8)), 1)
            score = round(clamp(core_ece_score + random.uniform(-8, 6)), 1)
        else:
            comp = round(clamp(prog_score + random.uniform(-25, 10)), 1)
            score = round(clamp(prog_score + random.uniform(-25, 10)), 1)
        lang_stats[f"{lang.lower()}_completion"] = comp
        lang_stats[f"{lang.lower()}_score"] = score

    # Software vs Core Gaps Count
    software_skill_gap_count = max(0, int((100 - prog_score) / 12) + int((100 - dsa_score) / 14))
    core_ece_skill_gap_count = max(0, int((100 - core_ece_score) / 12)) if is_ece or is_eee else 0

    # Composite placement readiness ground truth formula
    readiness_composite = (
        (cgpa / 10.0 * 100 * 0.20) +
        (prog_score * 0.14) +
        (dsa_score * 0.14) +
        (aptitude_score * 0.10) +
        (logical_score * 0.08) +
        (comm_score * 0.12) +
        (min(100, project_count * 20 + internship_count * 30 + (training_hours / 160.0 * 30)) * 0.18) +
        (min(100, (online_solved / 350.0) * 100) * 0.04) -
        (backlogs * 12.0)
    )
    
    # Sigmoidal readiness probability with light realistic noise
    readiness_prob = 1.0 / (1.0 + np.exp(-(readiness_composite - 68.0) / 7.5))
    is_placement_ready = 1 if (readiness_prob + random.uniform(-0.06, 0.06)) >= 0.50 else 0

    record = {
        "student_id": student_id,
        "name": f"{first_name} {last_name}",
        "email": email,
        "department": dept,
        "dept_code": dept_code,
        "year": year,
        "semester": semester,
        "archetype_id": archetype,
        "cgpa": cgpa,
        "sgpa_current": round(clamp(cgpa + random.uniform(-0.4, 0.4), 4.0, 10.0), 2),
        "attendance_pct": attendance,
        "backlog_count": backlogs,
        "programming_score": round(prog_score, 1),
        "dsa_score": round(dsa_score, 1),
        "aptitude_score": round(aptitude_score, 1),
        "logical_score": round(logical_score, 1),
        "verbal_score": round(verbal_score, 1),
        "communication_score": round(comm_score, 1),
        "core_ece_score": round(core_ece_score, 1),
        "core_mech_score": round(core_mech_score, 1),
        "projects_count": project_count,
        "projects_avg_completion": project_completion_pct,
        "internships_count": internship_count,
        "internships_tasks_completed": internship_completed_tasks,
        "certifications_count": cert_count,
        "training_hours_total": training_hours,
        "online_problems_attempted": online_attempted,
        "online_problems_solved": online_solved,
        "online_easy_solved": easy_solved,
        "online_medium_solved": medium_solved,
        "online_hard_solved": hard_solved,
        "online_coding_accuracy": coding_accuracy,
        "online_contest_rating": contest_rating,
        "online_contests_count": contest_count,
        "online_coding_streak": coding_streak_days,
        "software_skill_gaps": software_skill_gap_count,
        "core_ece_skill_gaps": core_ece_skill_gap_count,
        "readiness_composite_score": round(readiness_composite, 1),
        "is_placement_ready": is_placement_ready
    }
    
    # Merge language breakdown
    record.update(lang_stats)
    return record

def generate_dataset(size: int = DATASET_SIZE) -> pd.DataFrame:
    print(f"[SkillPilot Dataset Generator] Generating {size} realistic student records...")
    records = [generate_student_record(i) for i in range(size)]
    df = pd.DataFrame(records)
    
    os.makedirs(os.path.dirname(OUTPUT_CSV), exist_ok=True)
    df.to_csv(OUTPUT_CSV, index=False)
    print(f"[SkillPilot Dataset Generator] Successfully saved {len(df)} records to {OUTPUT_CSV}")
    
    # Generate dataset metadata & EDA summary statistics
    meta = {
        "dataset_size": len(df),
        "features_count": len(df.columns),
        "departments_distribution": df["dept_code"].value_counts().to_dict(),
        "placement_ready_ratio": round(float(df["is_placement_ready"].mean()), 4),
        "mean_cgpa": round(float(df["cgpa"].mean()), 2),
        "mean_programming_score": round(float(df["programming_score"].mean()), 2),
        "mean_dsa_score": round(float(df["dsa_score"].mean()), 2),
        "mean_online_problems_solved": round(float(df["online_problems_solved"].mean()), 1),
        "mean_training_hours": round(float(df["training_hours_total"].mean()), 1),
        "archetypes": {
            "0": "High CGPA + Low Hands-on Coding",
            "1": "Average CGPA + Competitive Coding Specialist",
            "2": "High Aptitude/Cognitive + Developing Communication",
            "3": "ECE Core Specialist (Embedded / VLSI / IoT)",
            "4": "ECE Software Switcher (Web / Python / DSA)",
            "5": "Project Heavy Builder + Developing Formal Experience",
            "6": "Balanced High Achiever Across Dimensions",
            "7": "Emerging / Developing Learner"
        },
        "feature_columns": list(df.columns)
    }
    
    with open(OUTPUT_META, "w", encoding="utf-8") as f:
        json.dump(meta, f, indent=2)
    print(f"[SkillPilot Dataset Generator] Dataset metadata written to {OUTPUT_META}")
    
    return df

if __name__ == "__main__":
    generate_dataset(DATASET_SIZE)
