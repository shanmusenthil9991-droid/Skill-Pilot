@echo off
echo ========================================================
echo        SKILLPILOT FULL-STACK APPLICATION LAUNCHER
echo ========================================================
echo Step 1: Initializing synthetic dataset (if needed)...
python data/generate_dataset.py

echo Step 2: Seeding relational database & training ML models...
python backend/app/database/seed.py

echo Step 3: Starting Backend & Frontend servers...
start "SkillPilot Backend" cmd /k run_backend.bat
start "SkillPilot Frontend" cmd /k run_frontend.bat

echo ========================================================
echo SkillPilot is launching!
echo Backend:  http://127.0.0.1:8000 (Docs: /docs)
echo Frontend: http://localhost:3000
echo ========================================================
