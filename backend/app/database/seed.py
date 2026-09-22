import os
import sys
import random
import datetime

# Ensure backend root directory is in sys.path
BACKEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
if BACKEND_DIR not in sys.path:
    sys.path.insert(0, BACKEND_DIR)

from sqlalchemy.orm import Session
from app.database.session import SessionLocal, engine, Base
from app.models.entities import (
    User, Student, AcademicRecord, Subject,
    ProgrammingLanguage, ProgrammingTopic, ProgrammingProgress,
    DSATopic, DSAProgress,
    AptitudeProgress, LogicalProgress, VerbalProgress, CommunicationRecord,
    CodingActivity, Certification, Project, Internship, TrainingRecord,
    CareerDomain, SkillGap, Recommendation, Resume, PlacementPrediction
)
from app.auth.security import get_password_hash
from app.ml.pipeline import ml_pipeline

# Reference curriculum data
PROGRAMMING_LANGS_DATA = {
    "Python": {
        "icon": "python",
        "desc": "High-level language for AI, data science, web services, and automation.",
        "topics": ["Variables & Data Types", "Operators & Expressions", "Control Flow (If/Else)", "Loops (For/While)", "Functions & Lambda", "Lists & Tuples", "Dictionaries & Sets", "Object-Oriented Programming (OOP)", "File Handling & I/O", "Exception Handling"]
    },
    "Java": {
        "icon": "coffee",
        "desc": "Enterprise OOP language used in backend architectures and Android systems.",
        "topics": ["JVM Architecture", "Data Types & Variables", "Control Structures", "Classes & Objects", "Inheritance & Polymorphism", "Interfaces & Abstract Classes", "Collections Framework", "Generics", "Multithreading", "File I/O & Streams"]
    },
    "C++": {
        "icon": "cpu",
        "desc": "High-performance language for competitive programming and systems engineering.",
        "topics": ["Pointers & Memory", "Data Types & Operators", "Control Statements", "Functions & References", "Arrays & Vectors", "Strings & C-Strings", "Classes & Constructors", "STL (Standard Template Library)", "Templates", "Dynamic Memory Allocation"]
    },
    "C": {
        "icon": "terminal",
        "desc": "Foundational low-level systems and embedded firmware language.",
        "topics": ["Variables & Types", "Operators", "Conditional Logic", "Loops", "Functions & Scope", "Pointers & Addressing", "Arrays & Strings", "Structures & Unions", "File Operations", "Bitwise Operations"]
    },
    "JavaScript": {
        "icon": "code-2",
        "desc": "Universal language for client and modern asynchronous server applications.",
        "topics": ["Variables (let/const)", "Data Types & Type Coercion", "Functions & Arrow Functions", "DOM Manipulation", "Promises & Async/Await", "ES6+ Modern Syntax", "Array Methods (map/filter)", "Objects & Prototypes", "Event Loop", "Fetch & REST APIs"]
    },
    "SQL": {
        "icon": "database",
        "desc": "Standard relational database query and data manipulation language.",
        "topics": ["Relational Concepts", "SELECT & WHERE Filters", "GROUP BY & HAVING", "INNER & OUTER JOINs", "Subqueries & CTEs", "Data Modification (INSERT/UPDATE)", "Indexes & Performance", "Transactions (ACID)", "Stored Procedures", "Views & Triggers"]
    }
}

DSA_TOPICS_LIST = [
    ("Arrays", "Fundamentals", 10),
    ("Strings", "Fundamentals", 10),
    ("Linked Lists", "Core", 10),
    ("Stack", "Core", 10),
    ("Queue", "Core", 10),
    ("Hashing", "Core", 10),
    ("Searching", "Algorithms", 10),
    ("Sorting", "Algorithms", 10),
    ("Recursion", "Algorithms", 10),
    ("Trees", "Advanced", 10),
    ("Graphs", "Advanced", 10),
    ("Greedy", "Algorithms", 10),
    ("Dynamic Programming", "Advanced", 10),
    ("Backtracking", "Advanced", 10),
    ("Complexity Analysis", "Fundamentals", 10)
]

APTITUDE_TOPICS_LIST = [
    "Number System", "HCF & LCM", "Ratio & Proportion", "Percentage",
    "Average", "Profit & Loss", "Simple Interest", "Compound Interest",
    "Time & Work", "Time & Distance", "Probability", "Permutation & Combination",
    "Data Interpretation", "Mixtures & Alligations", "Ages", "Algebra", "Geometry"
]

LOGICAL_TOPICS_LIST = [
    "Number Series", "Alphabet Series", "Coding-Decoding", "Blood Relations",
    "Directions", "Ranking", "Seating Arrangement", "Syllogism",
    "Statement & Conclusion", "Analogy", "Clock & Calendar", "Cubes & Dice", "Puzzles"
]

VERBAL_TOPICS_LIST = [
    "Grammar", "Vocabulary", "Reading Comprehension", "Sentence Correction",
    "Para Jumbles", "Synonyms & Antonyms", "Fill in the Blanks"
]

def seed_database():
    print("[SkillPilot DB Seeder] Recreating database tables...")
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(User).filter(User.email == "alex.ece@skillpilot.ai").first():
            print("[SkillPilot DB Seeder] Database already seeded with demo accounts.")
            return

        # 1. Seed Programming Languages & Topics
        print("[SkillPilot DB Seeder] Seeding programming languages and curriculum topics...")
        lang_entity_map = {}
        for lang_name, info in PROGRAMMING_LANGS_DATA.items():
            pl = ProgrammingLanguage(
                name=lang_name,
                icon_name=info["icon"],
                description=info["desc"],
                total_topics_count=len(info["topics"])
            )
            db.add(pl)
            db.flush()
            lang_entity_map[lang_name] = pl
            
            for idx, top in enumerate(info["topics"]):
                pt = ProgrammingTopic(
                    language_id=pl.id,
                    topic_name=top,
                    order_index=idx + 1
                )
                db.add(pt)
                
        # 2. Seed DSA Master Topics
        for top_name, cat, count in DSA_TOPICS_LIST:
            dt = DSATopic(topic_name=top_name, category=cat, total_curriculum_problems=count)
            db.add(dt)
            
        db.commit()
        
        # 3. Create Key Demo Students Representing Specific Archetypes
        print("[SkillPilot DB Seeder] Creating key archetype demo accounts...")
        
        demo_profiles = [
            {
                "email": "alex.ece@skillpilot.ai",
                "name": "Alex Chen",
                "student_id": "SP2026ECE0042",
                "dept": "Electronics and Communication Engineering (ECE)",
                "dept_code": "ECE",
                "year": 4,
                "semester": 7,
                "cgpa": 8.75,
                "attendance": 91.2,
                "bio": "ECE final year undergraduate with dual passion for Embedded Systems / IoT firmware and Full Stack cloud platforms.",
                "interests": ["Embedded Systems Engineer", "Full Stack Software Engineer", "IoT & Robotics Specialist"],
                "leetcode": "alex_embedded",
                "is_ece_showcase": True
            },
            {
                "email": "priya.cse@skillpilot.ai",
                "name": "Priya Sharma",
                "student_id": "SP2026CSE0108",
                "dept": "Computer Science and Engineering (CSE)",
                "dept_code": "CSE",
                "year": 4,
                "semester": 7,
                "cgpa": 9.15,
                "attendance": 94.0,
                "bio": "Competitive programmer (LeetCode Knight, 1850+ rating) and full stack developer specializing in distributed microservices.",
                "interests": ["Full Stack Software Engineer", "Data Scientist & AI/ML Engineer"],
                "leetcode": "priya_algo",
                "is_ece_showcase": False
            },
            {
                "email": "rahul.aiml@skillpilot.ai",
                "name": "Rahul Verma",
                "student_id": "SP2026AIML0023",
                "dept": "Artificial Intelligence & Machine Learning (AI/ML)",
                "dept_code": "AIML",
                "year": 3,
                "semester": 6,
                "cgpa": 8.42,
                "attendance": 88.0,
                "bio": "AI/ML researcher and engineer focused on LLMs, computer vision, and predictive statistical modeling.",
                "interests": ["Data Scientist & AI/ML Engineer", "Full Stack Software Engineer"],
                "leetcode": "rahul_ml",
                "is_ece_showcase": False
            }
        ]
        
        for p in demo_profiles:
            # Create User
            u = User(
                email=p["email"],
                hashed_password=get_password_hash("password123"),
                is_active=True
            )
            db.add(u)
            db.flush()
            
            # Create Student
            s = Student(
                user_id=u.id,
                student_id=p["student_id"],
                name=p["name"],
                email=p["email"],
                department=p["dept"],
                dept_code=p["dept_code"],
                year=p["year"],
                semester=p["semester"],
                cgpa=p["cgpa"],
                attendance_pct=p["attendance"],
                backlogs=0,
                career_interests=p["interests"],
                bio=p["bio"],
                leetcode_handle=p["leetcode"],
                github_url=f"https://github.com/{p['leetcode']}",
                linkedin_url=f"https://linkedin.com/in/{p['leetcode']}"
            )
            db.add(s)
            db.flush()
            
            # 4. Create Academic Semesters & Subjects
            ECE_SEMESTER_CURRICULUM = {
                1: [
                    ("MA101", "Calculus & Linear Algebra", "A", 88.0, 4),
                    ("PH102", "Engineering Physics (Semiconductor Physics)", "A", 85.0, 4),
                    ("EC103", "Basic Electrical & Circuit Theory", "S", 91.0, 3),
                    ("CS104", "Problem Solving & Programming in C", "S", 94.0, 3),
                    ("EC105", "Basic Electronics & Instrumentation Lab", "S", 96.0, 2),
                    ("EN106", "Technical English & Communication", "A", 86.0, 2)
                ],
                2: [
                    ("MA201", "Differential Equations & Vector Calculus", "A", 84.0, 4),
                    ("EC202", "Electronic Devices & Circuit Theory", "A", 89.0, 4),
                    ("EC203", "Digital Logic Design & Verilog Intro", "S", 93.0, 4),
                    ("EC204", "Network Analysis & Synthesis", "B", 82.0, 3),
                    ("EC205", "Analog Circuits Simulation Lab", "S", 92.0, 2),
                    ("EC206", "Digital Electronics Workshop Lab", "S", 95.0, 2),
                    ("HS207", "Environmental Science & Engineering", "A", 88.0, 2)
                ],
                3: [
                    ("EC301", "Analog Integrated Circuits & Op-Amps", "A", 86.0, 4),
                    ("EC302", "Signals & Systems (Continuous & Discrete)", "A", 88.0, 4),
                    ("EC303", "Electromagnetic Fields & Waveguides", "B", 80.0, 3),
                    ("CS304", "Data Structures & Algorithm Design", "S", 91.0, 4),
                    ("EC305", "Linear Integrated Circuits Lab", "S", 94.0, 2),
                    ("EC306", "Data Structures & Programming Lab", "S", 93.0, 2),
                    ("MA307", "Numerical Methods & Transform Techniques", "A", 85.0, 3)
                ],
                4: [
                    ("EC401", "Microprocessor & ARM Microcontrollers", "S", 92.0, 4),
                    ("EC402", "Digital Signal Processing (DSP Architecture)", "A", 87.0, 4),
                    ("EC403", "Analog & Digital Communication Systems", "A", 84.0, 4),
                    ("EC404", "Control Systems Engineering", "A", 89.0, 3),
                    ("EC405", "Microcontroller Interfacing & RTOS Lab", "S", 96.0, 2),
                    ("EC406", "DSP & Signal Simulation Lab", "S", 94.0, 2),
                    ("HS407", "Professional Ethics & Human Values", "S", 90.0, 2)
                ],
                5: [
                    ("EC501", "VLSI Architecture & CMOS RTL Design", "S", 94.0, 4),
                    ("EC502", "Embedded Systems & FreeRTOS Architecture", "S", 95.0, 4),
                    ("EC503", "Antenna Design & Microwave Engineering", "B", 81.0, 3),
                    ("CS504", "Computer Communication Networks & IoT", "S", 90.0, 3),
                    ("EC505", "VLSI CAD & FPGA Synthesis Lab", "S", 97.0, 2),
                    ("EC506", "Embedded Drivers & IoT Hardware Lab", "S", 96.0, 2),
                    ("MG507", "Engineering Economics & Project Management", "A", 86.0, 3)
                ],
                6: [
                    ("EC601", "System-on-Chip (SoC) Design & Verification", "S", 91.0, 4),
                    ("EC602", "Wireless & Mobile Communication (5G/LTE)", "A", 88.0, 3),
                    ("EC603", "Edge AI & Machine Learning on Hardware", "S", 93.0, 3),
                    ("EC604", "Optical Fiber Communications", "A", 85.0, 3),
                    ("EC605", "Advanced Hardware Prototyping Lab", "S", 98.0, 2),
                    ("EC606", "Capstone Project Phase I", "S", 95.0, 4),
                    ("EC607", "Industrial Internship Assessment", "S", 96.0, 2)
                ]
            }

            CSE_SEMESTER_CURRICULUM = {
                1: [
                    ("MA101", "Linear Algebra & Calculus", "A", 89.0, 4),
                    ("PH102", "Physics for Information Science", "A", 86.0, 4),
                    ("CS103", "Programming in C & Data Types", "S", 95.0, 3),
                    ("EE104", "Basic Electrical & Electronics", "A", 84.0, 3),
                    ("CS105", "C Programming & Linux CLI Lab", "S", 96.0, 2),
                    ("EN106", "Technical Communication Skills", "A", 88.0, 2)
                ],
                2: [
                    ("MA201", "Discrete Mathematics & Graph Theory", "S", 92.0, 4),
                    ("CS202", "Object-Oriented Programming (Java/C++)", "S", 94.0, 4),
                    ("CS203", "Digital Systems & Logic Design", "A", 87.0, 3),
                    ("CS204", "Computer Organization & Architecture", "A", 85.0, 3),
                    ("CS205", "Java & OOP Development Lab", "S", 95.0, 2),
                    ("CS206", "Data Structures Fundamentals Lab", "S", 96.0, 2),
                    ("HS207", "Environmental Studies & Ecology", "A", 89.0, 2)
                ],
                3: [
                    ("CS301", "Data Structures & Algorithm Design", "S", 95.0, 4),
                    ("CS302", "Database Management Systems (SQL/NoSQL)", "A", 89.0, 4),
                    ("CS303", "Theory of Computation & Automata", "A", 84.0, 3),
                    ("CS304", "Software Engineering Methodologies", "A", 88.0, 3),
                    ("CS305", "Advanced Data Structures Lab", "S", 96.0, 2),
                    ("CS306", "RDBMS & Database Design Lab", "S", 93.0, 2),
                    ("MA307", "Probability & Statistics for Computing", "A", 86.0, 3)
                ],
                4: [
                    ("CS401", "Operating Systems & Concurrency", "A", 89.0, 4),
                    ("CS402", "Computer Networks & Sockets", "A", 87.0, 4),
                    ("CS403", "Design & Analysis of Algorithms", "S", 93.0, 4),
                    ("CS404", "Microprocessors & Interfacing", "B", 82.0, 3),
                    ("CS405", "Operating Systems & Shell Scripting Lab", "S", 94.0, 2),
                    ("CS406", "Algorithm Benchmark & Contest Lab", "S", 97.0, 2),
                    ("HS407", "Professional Ethics & Cybersecurity Law", "S", 91.0, 2)
                ],
                5: [
                    ("CS501", "Full Stack Web Technologies (React & APIs)", "S", 96.0, 4),
                    ("CS502", "Compiler Design & Code Optimization", "A", 86.0, 4),
                    ("CS503", "Machine Learning Foundations", "S", 92.0, 4),
                    ("CS504", "Cloud Computing & Distributed Storage", "A", 88.0, 3),
                    ("CS505", "Full Stack Web Development Lab", "S", 98.0, 2),
                    ("CS506", "Machine Learning & Data Science Lab", "S", 95.0, 2),
                    ("MG507", "Product Management & Entrepreneurship", "A", 87.0, 2)
                ],
                6: [
                    ("CS601", "Distributed Systems & Microservices", "S", 93.0, 4),
                    ("CS602", "Artificial Intelligence & Deep Learning", "S", 94.0, 4),
                    ("CS603", "Cryptography & Network Security", "A", 87.0, 3),
                    ("CS604", "Big Data Analytics & Spark", "A", 89.0, 3),
                    ("CS605", "Cloud Deployment & DevOps Lab", "S", 97.0, 2),
                    ("CS606", "Capstone Project Phase I", "S", 96.0, 4),
                    ("CS607", "Industry Internship Evaluation", "S", 95.0, 2)
                ]
            }

            for sem in range(1, p["semester"] + 1):
                curriculum_map = ECE_SEMESTER_CURRICULUM if p["dept_code"] == "ECE" else CSE_SEMESTER_CURRICULUM
                sem_subjects = curriculum_map.get(sem, curriculum_map[1])
                
                total_sem_credits = sum(s[4] for s in sem_subjects)
                # Calculate semester SGPA based on weighted grades
                grade_pts = {"S": 10.0, "A": 9.0, "B": 8.0, "C": 7.0}
                total_pts = sum(grade_pts.get(s[2], 8.5) * s[4] for s in sem_subjects)
                sem_sgpa = round(total_pts / max(1, total_sem_credits), 2)
                
                ar = AcademicRecord(
                    student_id=s.id,
                    semester_number=sem,
                    sgpa=sem_sgpa,
                    credits_earned=total_sem_credits,
                    credits_total=total_sem_credits,
                    attendance_pct=round(min(98.0, max(80.0, p["attendance"] + random.uniform(-3, 3))), 1),
                    backlogs=0
                )
                db.add(ar)
                db.flush()
                
                for scode, sname, grade, marks, creds in sem_subjects:
                    subj = Subject(
                        academic_record_id=ar.id,
                        subject_code=scode,
                        subject_name=sname,
                        grade=grade,
                        marks_pct=marks,
                        credits=creds,
                        attendance_pct=ar.attendance_pct
                    )
                    db.add(subj)

            # 5. Programming Progress
            for lang_name, pl in lang_entity_map.items():
                topics_list = PROGRAMMING_LANGS_DATA[lang_name]["topics"]
                if lang_name in ["Python", "C++"] or (lang_name == "C" and p["is_ece_showcase"]):
                    comp_count = 9
                    score = random.uniform(84.0, 95.0)
                    acc = random.uniform(85.0, 94.0)
                    lvl = "Advanced"
                elif lang_name in ["Java", "JavaScript", "SQL"]:
                    comp_count = 8
                    score = random.uniform(78.0, 88.0)
                    acc = random.uniform(80.0, 90.0)
                    lvl = "Proficient"
                else:
                    comp_count = 6
                    score = random.uniform(68.0, 78.0)
                    acc = random.uniform(70.0, 80.0)
                    lvl = "Intermediate"
                    
                prog = ProgrammingProgress(
                    student_id=s.id,
                    language_id=pl.id,
                    topics_completed=comp_count,
                    total_topics=len(topics_list),
                    completion_pct=round((comp_count / len(topics_list)) * 100.0, 1),
                    assessment_score=round(score, 1),
                    questions_attempted=comp_count * 15,
                    questions_solved=int(comp_count * 15 * (acc / 100.0)),
                    accuracy_pct=round(acc, 1),
                    skill_level=lvl,
                    completed_topics_list=topics_list[:comp_count],
                    pending_topics_list=topics_list[comp_count:]
                )
                db.add(prog)

            # 6. DSA Progress
            for top_name, cat, total_p in DSA_TOPICS_LIST:
                if top_name in ["Arrays", "Strings", "Linked Lists", "Stack", "Queue", "Searching", "Sorting"]:
                    comp = 10
                    acc = random.uniform(88.0, 96.0)
                    sc = random.uniform(86.0, 95.0)
                    lvl = "Mastered"
                    status = "Completed"
                elif top_name in ["Trees", "Hashing", "Greedy", "Recursion"]:
                    comp = 8
                    acc = random.uniform(78.0, 88.0)
                    sc = random.uniform(76.0, 86.0)
                    lvl = "Proficient"
                    status = "In Progress"
                else: # Graphs, DP, Backtracking
                    comp = 6 if not p["is_ece_showcase"] else 4
                    acc = random.uniform(62.0, 78.0)
                    sc = random.uniform(60.0, 75.0)
                    lvl = "Developing"
                    status = "In Progress"

                dsap = DSAProgress(
                    student_id=s.id,
                    topic_name=top_name,
                    category=cat,
                    completed_problems=comp,
                    total_problems=total_p,
                    completion_pct=round((comp / total_p) * 100.0, 1),
                    accuracy_pct=round(acc, 1),
                    assessment_score=round(sc, 1),
                    skill_level=lvl,
                    status=status
                )
                db.add(dsap)

            # 7. Cognitive: Aptitude, Logical, Verbal & Communication
            for apt_topic in APTITUDE_TOPICS_LIST:
                acc = random.uniform(70.0, 94.0)
                apt = AptitudeProgress(
                    student_id=s.id,
                    topic_name=apt_topic,
                    completed_modules=8,
                    total_modules=10,
                    accuracy_pct=round(acc, 1),
                    assessment_score=round(acc * 0.95, 1),
                    questions_attempted=40,
                    questions_solved=int(40 * (acc / 100.0)),
                    strength_level="Strong" if acc >= 80.0 else "Moderate"
                )
                db.add(apt)

            for log_topic in LOGICAL_TOPICS_LIST:
                acc = random.uniform(72.0, 92.0)
                logp = LogicalProgress(
                    student_id=s.id,
                    topic_name=log_topic,
                    completed_modules=9,
                    total_modules=10,
                    accuracy_pct=round(acc, 1),
                    assessment_score=round(acc * 0.94, 1),
                    status="Completed" if acc >= 80.0 else "In Progress",
                    strength_level="Strong" if acc >= 80.0 else "Moderate"
                )
                db.add(logp)

            for verb_topic in VERBAL_TOPICS_LIST:
                acc = random.uniform(75.0, 90.0)
                verb = VerbalProgress(
                    student_id=s.id,
                    topic_name=verb_topic,
                    completion_pct=85.0,
                    accuracy_pct=round(acc, 1),
                    assessment_score=round(acc * 0.96, 1),
                    is_weak_topic=acc < 70.0
                )
                db.add(verb)

            comm = CommunicationRecord(
                student_id=s.id,
                overall_score=82.5,
                current_level="Professional",
                speaking_score=80.0,
                listening_score=86.0,
                writing_score=84.0,
                presentation_score=81.0,
                interview_comm_score=83.0,
                strengths=["Crisp technical articulation", "Structured problem explanation", "Excellent presentation pace"],
                weaknesses=["Occasional technical jargon without context", "Needs slight polish in high-pressure behavioral scenarios"],
                recommendations=["Conduct 3 STAR-format behavioral mock interviews", "Practice executive-summary project walkthroughs"]
            )
            db.add(comm)

            # 8. Online Coding Activity
            coding_act = CodingActivity(
                student_id=s.id,
                platform_name="LeetCode",
                handle=s.leetcode_handle,
                total_attempted=310 if not p["is_ece_showcase"] else 180,
                total_solved=265 if not p["is_ece_showcase"] else 145,
                easy_solved=130 if not p["is_ece_showcase"] else 75,
                medium_solved=115 if not p["is_ece_showcase"] else 60,
                hard_solved=20 if not p["is_ece_showcase"] else 10,
                accuracy_pct=85.4,
                contest_rating=1820 if not p["is_ece_showcase"] else 1580,
                contests_count=18 if not p["is_ece_showcase"] else 9,
                global_rank="Top 8.5%" if not p["is_ece_showcase"] else "Top 22%",
                coding_streak_days=24 if not p["is_ece_showcase"] else 14,
                recent_activity=[
                    {"date": "2026-03-20", "count": 4, "problems": ["Two Sum", "Course Schedule", "LRU Cache", "Binary Tree Level Order"]},
                    {"date": "2026-03-19", "count": 3, "problems": ["Valid Palindrome", "Word Break", "Merge K Sorted Lists"]},
                    {"date": "2026-03-18", "count": 5, "problems": ["Coin Change", "Rotting Oranges", "Clone Graph", "Subsets", "3Sum"]}
                ],
                topic_distribution={
                    "Arrays": {"attempted": 65, "solved": 60, "accuracy": 92.3},
                    "Strings": {"attempted": 45, "solved": 40, "accuracy": 88.8},
                    "Linked List": {"attempted": 30, "solved": 28, "accuracy": 93.3},
                    "Trees": {"attempted": 50, "solved": 42, "accuracy": 84.0},
                    "Graphs": {"attempted": 40, "solved": 32, "accuracy": 80.0},
                    "Dynamic Programming": {"attempted": 45, "solved": 31, "accuracy": 68.8},
                    "Greedy": {"attempted": 25, "solved": 22, "accuracy": 88.0}
                },
                language_distribution={
                    "Python": {"attempted": 140, "solved": 125, "accuracy": 89.2},
                    "C++": {"attempted": 110, "solved": 95, "accuracy": 86.3},
                    "Java": {"attempted": 60, "solved": 45, "accuracy": 75.0}
                }
            )
            db.add(coding_act)

            # 9. Projects
            if p["is_ece_showcase"]:
                projects_data = [
                    {
                        "title": "Smart IoT Microcontroller Firmware & Telemetry Gateway",
                        "domain": "Embedded Systems & IoT",
                        "problem": "Real-time industrial telemetry monitoring with fault detection and edge MQTT payload processing.",
                        "tech": ["Embedded C", "FreeRTOS", "ESP32", "MQTT", "Python", "FastAPI", "PostgreSQL"],
                        "completed_comp": ["Firmware Driver Architecture", "FreeRTOS Task Scheduler", "MQTT Gateway", "Cloud REST API", "Web Dashboard"],
                        "pending_comp": ["Hardware-in-the-Loop Testing", "OTA Secure Firmware Updates"],
                        "comp_pct": 85.0
                    },
                    {
                        "title": "AI Resume & Portfolio Intelligence Engine",
                        "domain": "Full Stack & AI",
                        "problem": "Multi-tenant platform analyzing engineering competencies, resume text extraction, and predictive placement readiness.",
                        "tech": ["React", "TypeScript", "Python", "FastAPI", "Scikit-Learn", "Tailwind CSS"],
                        "completed_comp": ["Frontend UI Components", "FastAPI REST API", "NLP Parser", "ML Classification Pipeline"],
                        "pending_comp": ["Automated CI/CD Deployment", "End-to-end Cypress Testing"],
                        "comp_pct": 80.0
                    }
                ]
            else:
                projects_data = [
                    {
                        "title": "Distributed Cloud Scalable Microservices Architecture",
                        "domain": "Full Stack & Cloud",
                        "problem": "High-throughput asynchronous order matching engine capable of handling 5,000+ requests per second.",
                        "tech": ["Java", "Spring Boot", "React", "Kafka", "Docker", "PostgreSQL", "Redis"],
                        "completed_comp": ["API Gateway", "Auth Microservice", "Kafka Message Pipeline", "React Frontend", "Database Sharding"],
                        "pending_comp": ["Kubernetes Helm Deployment", "Prometheus Monitoring"],
                        "comp_pct": 90.0
                    },
                    {
                        "title": "AI-Powered Adaptive Learning & Code Evaluation Platform",
                        "domain": "Artificial Intelligence & Web",
                        "problem": "Automatic code vulnerability detection and algorithm optimization recommendations using AST parsing and ML.",
                        "tech": ["Python", "FastAPI", "PyTorch", "TypeScript", "Docker", "Tailwind CSS"],
                        "completed_comp": ["AST Parsing Engine", "Evaluation Sandbox", "REST APIs", "Modern Dashboard UI"],
                        "pending_comp": ["Distributed Worker Queue", "Benchmarking Suite"],
                        "comp_pct": 85.0
                    }
                ]

            for prj in projects_data:
                db_prj = Project(
                    student_id=s.id,
                    title=prj["title"],
                    domain=prj["domain"],
                    problem_statement=prj["problem"],
                    technologies=prj["tech"],
                    languages=["Python", "C++", "JavaScript", "Embedded C" if p["is_ece_showcase"] else "Java"],
                    frameworks=["React", "FastAPI", "FreeRTOS" if p["is_ece_showcase"] else "Spring Boot"],
                    database="PostgreSQL",
                    apis_used=["REST API", "MQTT WebSocket"],
                    ai_ml_components="Scikit-Learn / Predictive Classification",
                    deployment_platform="AWS ECS & Docker",
                    completion_pct=prj["comp_pct"],
                    student_role="Lead Full Stack & Systems Developer",
                    github_url="https://github.com/skillpilot/demo-project",
                    live_url="https://demo-project.skillpilot.app",
                    completed_components=prj["completed_comp"],
                    pending_components=prj["pending_comp"]
                )
                db.add(db_prj)

            # 10. Internships
            intern = Internship(
                student_id=s.id,
                company="Apex Embedded Systems & Tech" if p["is_ece_showcase"] else "AlphaScale Software Technologies",
                role="Firmware & Systems Intern" if p["is_ece_showcase"] else "Software Engineering Intern",
                domain="Embedded Engineering" if p["is_ece_showcase"] else "Software Development",
                duration="3 Months (Summer 2025)",
                start_date="June 2025",
                end_date="August 2025",
                technologies=["C/C++", "FreeRTOS", "UART/SPI", "Python", "Git"] if p["is_ece_showcase"] else ["Python", "FastAPI", "React", "Docker", "PostgreSQL"],
                responsibilities="Collaborated with core engineering team to design, test, and ship production-ready modules with 99.8% uptime.",
                skills_acquired=["Production Code Review", "Low-level Hardware Debugging" if p["is_ece_showcase"] else "Microservices Architecture", "Automated Testing", "CI/CD Pipeline"],
                completed_tasks=["Task 1: Architecture Specification Review", "Task 2: Core Algorithm & Protocol Implementation", "Task 3: Integration & Unit Testing", "Task 4: Production Deployment"],
                pending_tasks=["Task 5: Long-term Performance Benchmarking"],
                completion_pct=80.0
            )
            db.add(intern)

            # 11. Certifications
            certs_list = [
                ("AWS Certified Cloud Practitioner", "Amazon Web Services", "Cloud Computing", "2025-09-15", "AWS-CCP-84920"),
                ("Deep Learning & Algorithms Specialization", "DeepLearning.AI / Coursera", "AI/ML", "2025-11-20", "DL-SPEC-39210"),
                ("Advanced Embedded Systems & RTOS Design", "ARM / edX", "Core ECE", "2025-12-10", "ARM-RTOS-10294") if p["is_ece_showcase"] else ("Full Stack Web Development & Microservices", "Meta / Coursera", "Software Engineering", "2025-12-10", "META-FS-49210")
            ]
            for cname, cprov, cdom, cdate, cid in certs_list:
                cert = Certification(
                    student_id=s.id,
                    name=cname,
                    provider=cprov,
                    domain=cdom,
                    issue_date=cdate,
                    credential_id=cid,
                    credential_url="https://skillpilot.edu/verify/cert",
                    status="Completed"
                )
                db.add(cert)

            # 12. Training
            trainings_list = [
                ("Advanced Data Structures & Competitive Coding", "Algorithmic Engineering", 45, 45, 100.0, 92.0, ["Bit Manipulation", "Segment Trees", "Disjoint Set Union", "DP on Trees"]),
                ("Enterprise Full Stack & Cloud Engineering", "Cloud & Backend", 40, 45, 88.8, 88.0, ["Docker Containerization", "FastAPI / Node Backend", "PostgreSQL Optimization", "JWT Security"]),
                ("RTOS & Microcontroller Hardware Design", "Core Hardware", 35, 40, 87.5, 86.0, ["FreeRTOS Task Management", "SPI & I2C Handshakes", "Interrupt Service Routines"]) if p["is_ece_showcase"] else ("Machine Learning & Data Intelligence", "AI Systems", 35, 40, 87.5, 89.0, ["Feature Engineering", "Ensemble Models", "Model Evaluation Metrics"])
            ]
            for tname, tdom, chrs, thrs, tcomp, tscore, tmods in trainings_list:
                tr = TrainingRecord(
                    student_id=s.id,
                    training_name=tname,
                    domain=tdom,
                    completed_hours=chrs,
                    total_hours=thrs,
                    completion_pct=tcomp,
                    assessment_score=tscore,
                    modules_list=tmods
                )
                db.add(tr)

            # 13. Skill Gaps
            if p["is_ece_showcase"]:
                gaps_data = [
                    ("Embedded Systems Engineer", "Verilog & RTL Simulation", "Novice", "Proficient", "High", 1, "RTL simulation is mandatory for digital design verification.", "Complete FPGA modeling module and simulate testbenches in ModelSim."),
                    ("Embedded Systems Engineer", "FreeRTOS Mutex & Semaphores", "Developing", "Advanced", "Medium", 2, "Real-time task synchronization prevents race conditions in automotive firmware.", "Implement producer-consumer circular queue with FreeRTOS binary semaphores."),
                    ("Full Stack Software Engineer", "Advanced Dynamic Programming", "Developing", "Proficient", "High", 3, "Essential for top-tier software engineering elimination rounds.", "Solve 15 2D DP problems on LeetCode.")
                ]
            else:
                gaps_data = [
                    ("Full Stack Software Engineer", "Distributed System Design", "Novice", "Intermediate", "High", 1, "High-scale backend architectures require knowledge of caching, load balancers, and CAP theorem.", "Design a URL shortener and live chat system architecture."),
                    ("Data Scientist & AI/ML Engineer", "Deep Learning Deployment & ONNX", "Developing", "Proficient", "Medium", 2, "Deploying PyTorch models into low-latency production APIs is a top differentiator.", "Export transformer model to ONNX runtime and build FastAPI inference worker."),
                    ("Full Stack Software Engineer", "Advanced Graph Algorithms", "Intermediate", "Proficient", "Medium", 3, "Top product companies screen heavily on Shortest Path, Dijkstra, and Topological Sort.", "Practice 10 Graph contest problems.")
                ]
            for role, sname, cur_lvl, req_lvl, sev, prio, rsn, act in gaps_data:
                sg = SkillGap(
                    student_id=s.id,
                    target_career_role=role,
                    skill_name=sname,
                    current_level=cur_lvl,
                    required_level=req_lvl,
                    gap_severity=sev,
                    priority=prio,
                    reason=rsn,
                    recommended_action=act
                )
                db.add(sg)

        db.commit()
        print("[SkillPilot DB Seeder] Seeding completed successfully!")
        
        # Train ML models immediately if dataset exists
        print("[SkillPilot DB Seeder] Training and saving ML models...")
        ml_pipeline.train_and_evaluate()
        
    except Exception as e:
        db.rollback()
        print(f"[SkillPilot DB Seeder] Error during seeding: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
