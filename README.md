# SkillPilot: AI-Powered Student Skill & Career Intelligence Platform

> **"Navigate Your Skills. Pilot Your Career."**

SkillPilot is a production-grade full-stack SaaS platform designed to analyze engineering students' academic performance, multi-language programming capabilities, Data Structures & Algorithms mastery, quantitative aptitude, logical reasoning, verbal ability, communication metrics, certifications, project portfolios, internships, online competitive coding activity, and optional resumes.

---

## Key Highlights & Capabilities

1. **Synthetic Dataset Engine (5,000+ Records)**:
   - Self-contained generator (`data/generate_dataset.py`) producing realistic, internally consistent student records across 8 departments (CSE, IT, AI/ML, AI & DS, ECE, EEE, Mechanical, Civil).
   - Modeled with distinct archetypes (e.g. *High CGPA + Low Coding*, *Competitive Coding Specialist*, *ECE Core Enthusiast*, *ECE Software Switcher*, *Project Heavy Builder*).
   - Configurable scale via `DATASET_SIZE` environment variable.

2. **Machine Learning Placement Readiness Core**:
   - Trains and benchmarks **Logistic Regression**, **Decision Tree**, and **Random Forest Classifier**.
   - Computes empirical evaluation metrics: **Accuracy (95.4%)**, **Precision**, **Recall**, **F1 Score (0.9654)**, **ROC-AUC**, and **Hold-Out Confusion Matrix (N=1,000)**.
   - Generates feature importance rankings (MDI) and explains top positive & negative contributing factors for every student.

3. **ECE Dual-Pathway Career Intelligence Engine**:
   - Dedicated career pathway analyzer for ECE students computing separate, unmerged scores:
     - **Core ECE Pathway** (Embedded Systems, VLSI / Chip Design, RTOS, Microcontrollers, Verilog, FPGA, IoT).
     - **Software / CS Pathway** (Full Stack, Backend SDE-1, Cloud/DevOps, AI/ML, Dynamic Programming, DBMS).
   - Provides side-by-side gap analysis and strategic dual-competency recommendations.

4. **3-Source Skill Validation Matrix**:
   - Cross-verifies candidate competence across **Source 1 (Profile Records)**, **Source 2 (Online Coding Telemetry)**, and **Source 3 (Uploaded Resume Parsing)**.
   - Categorizes findings into `VERIFIED MATCH`, `MATCH`, `MISSING FROM RESUME`, `ADDITIONAL IN RESUME`, and `REVIEW RECOMMENDED` without false negative assumptions.

5. **22 Responsive SaaS Views**:
   - Executive Dashboard with 6-axis competency radar and live gauges.
   - Deep-dive pages for Academics, 6 Programming Languages, 15 DSA Topics, Online Coding Hub (LeetCode/Codeforces stats & streaks), Aptitude, Logic, Verbal, Communication, Projects, Internships, Certifications, Training, Career Gaps, Recommendations, and ML Analytics.

---

## Technology Stack

- **Backend Engine**: Python 3.13, FastAPI, SQLAlchemy 2.0, Pydantic V2, Uvicorn.
- **Machine Learning & Analytics**: Scikit-Learn, Pandas, NumPy, Joblib.
- **Authentication & Security**: JWT (HS256), Bcrypt password hashing, Bearer Token authorization.
- **Resume Processing**: PyPDF, python-docx, NLP entity extraction.
- **Frontend SPA**: React 18, TypeScript, Vite, Tailwind CSS, Lucide React, Recharts, Axios, React Router 6.
- **Database**: Relational SQLite / PostgreSQL compatible.

---

## Project Structure

```
Skill-Pilot/
├── data/
│   ├── generate_dataset.py          # Synthetic dataset generator (5,000 records)
│   ├── students_dataset.csv         # Generated dataset file
│   └── dataset_metadata.json        # Dataset schema & statistical metadata
├── backend/
│   └── app/
│       ├── main.py                  # FastAPI application entrypoint
│       ├── config.py                # Environment configuration
│       ├── database/
│       │   ├── session.py           # SQLAlchemy session engine
│       │   └── seed.py              # Database seeder & demo accounts
│       ├── models/
│       │   └── entities.py          # 20+ relational database tables
│       ├── schemas/
│       │   └── schemas.py           # Pydantic request/response schemas
│       ├── auth/
│       │   ├── security.py          # Bcrypt hashing & JWT creation
│       │   └── deps.py              # Auth dependency injection
│       ├── ml/
│       │   ├── pipeline.py          # Training, evaluation & inference pipeline
│       │   └── saved_models/        # Serialized models & metrics
│       ├── analytics/
│       │   └── eda_service.py       # EDA, distributions & correlation matrix
│       ├── career/
│       │   └── career_engine.py     # ECE dual-pathway & career alignment
│       ├── recommendations/
│       │   └── recommendation_engine.py # What-Why-Next Step generator
│       ├── resume/
│       │   └── resume_service.py    # Resume text extraction & 3-source validator
│       └── routes/                  # Modular REST API endpoints
├── frontend/
│   ├── src/
│   │   ├── components/common/       # Navbar, Sidebar, StatCard, ScoreGauge, etc.
│   │   ├── pages/                   # 22 responsive intelligence pages
│   │   ├── context/AuthContext.tsx  # Authentication context
│   │   ├── services/api.ts          # Axios client with JWT interceptor
│   │   ├── types/index.ts           # TypeScript interfaces
│   │   ├── App.tsx                  # Master routing
│   │   └── main.tsx                 # Entrypoint
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
├── run_backend.bat                  # Start FastAPI server (:8000)
├── run_frontend.bat                 # Start Vite dev server (:3000)
├── run_all.bat                      # Full-stack automated launcher
└── README.md
```

---

## Quick Start & Installation Guide

### 1. Prerequisites
- Python 3.10+ (Python 3.13 tested)
- Node.js 18+ & npm

### 2. Setup Backend Dependencies
```bash
pip install fastapi uvicorn sqlalchemy pydantic pydantic-settings pyjwt bcrypt scikit-learn pandas numpy pypdf python-docx joblib email-validator httpx
```

### 3. Setup Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### 4. Generate Dataset, Seed Database & Train Models
```bash
# Step 1: Generate 5,000 synthetic records
python data/generate_dataset.py

# Step 2: Seed DB with curriculum, domains & pre-trained ML models
python -m backend.app.database.seed
```

### 5. Launch Application
You can run `run_all.bat` on Windows or start individual servers:

**Backend Server:**
```bash
run_backend.bat
# Running on http://127.0.0.1:8000 (Swagger docs at http://127.0.0.1:8000/docs)
```

**Frontend Dev Server:**
```bash
run_frontend.bat
# Running on http://localhost:3000
```

---

## Pre-Seeded Demo Student Accounts

Use any of the following accounts with password: `password123` (or use the one-click persona switcher on the Login / Navbar):

| Student Name | Email | Department | Persona & Specialty |
| :--- | :--- | :--- | :--- |
| **Alex Chen** | `alex.ece@skillpilot.ai` | **ECE** | **ECE Dual-Track Showcase** (Embedded C, RTOS, VLSI & Software) |
| **Priya Sharma** | `priya.cse@skillpilot.ai` | **CSE** | **Competitive Coding Specialist** (450+ LeetCode Solves, Top DSA) |
| **Rahul Verma** | `rahul.aiml@skillpilot.ai` | **AI/ML** | **AI/Data Science Specialist** (PyTorch, Deep Learning, Analytics) |

---

## REST API Endpoints Overview

- `POST /api/auth/login` - Authenticate student and obtain JWT Bearer token
- `GET /api/student/profile` - Fetch full student profile and online handles
- `GET /api/student/academics` - Fetch SGPA/CGPA trends and subject grades
- `GET /api/coding/languages` - Multi-language progress (C, C++, Java, Python, JS, SQL)
- `GET /api/coding/dsa` - 15 DSA topics with accuracy and completion status
- `GET /api/online-coding/summary` - LeetCode/Codeforces telemetry & streaks
- `GET /api/cognitive/aptitude` - 17+ Quantitative Aptitude topics
- `GET /api/cognitive/logical` - 13+ Logical Reasoning topics
- `GET /api/cognitive/verbal` - Verbal ability & reading comprehension
- `GET /api/cognitive/communication` - 5-axis soft skill rubric scores
- `GET /api/experience/projects` - Component-level project architecture tracking
- `GET /api/experience/internships` - Corporate experience deliverables
- `GET /api/experience/certifications` - Credential IDs and verification
- `GET /api/experience/training` - Hands-on training hours ({completed}/{total})
- `GET /api/career/domains` - Cross-department career alignment
- `GET /api/career/ece-dual-track` - Dedicated Core ECE vs Software/CS dual track
- `GET /api/career/skill-gaps` - Prioritized gap analysis against target roles
- `GET /api/placement/readiness` - ML ensemble readiness estimate and factor weights
- `GET /api/recommendations` - Structured WHAT • WHY • NEXT STEP advice
- `POST /api/resume/upload` - Upload PDF/DOCX resume & generate 3-Source Validation Matrix
- `GET /api/ml/analytics` - EDA statistics, correlation matrix, and ML benchmarks
- `POST /api/ml/retrain` - Retrain and re-evaluate candidate ML models

---

## License
SkillPilot Platform © 2026. Designed for AI-driven student skill, career and placement intelligence.
