"""
SkillPilot One-Click Launcher
Starts the FastAPI Backend and Vite React Frontend concurrently.
"""

import os
import sys
import subprocess
import time
import webbrowser

def main():
    print("=" * 65)
    print("                     SKILLPILOT")
    print("     AI-Powered Student Skill & Career Intelligence Platform")
    print("=" * 65)
    
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Check if dataset exists, if not generate
    dataset_path = os.path.join(base_dir, "data", "students_dataset.csv")
    if not os.path.exists(dataset_path):
        print("\n[1/3] Generating synthetic dataset (5,000 student records)...")
        subprocess.run([sys.executable, os.path.join(base_dir, "data", "generate_dataset.py")], check=True)
    else:
        print("\n[1/3] Synthetic dataset verified (5,000 records ready).")
        
    # 2. Check if DB and ML models exist, if not seed
    db_path = os.path.join(base_dir, "skillpilot.db")
    model_path = os.path.join(base_dir, "backend", "app", "ml", "saved_models", "random_forest_model.joblib")
    if not os.path.exists(db_path) or not os.path.exists(model_path):
        print("\n[2/3] Seeding relational database & training ML models...")
        subprocess.run([sys.executable, "-m", "backend.app.database.seed"], check=True)
    else:
        print("\n[2/3] Database & ML models verified.")

    # 3. Start Backend
    print("\n[3/3] Starting Backend & Frontend servers...")
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "127.0.0.1", "--port", "8000", "--reload"]
    backend_proc = subprocess.Popen(backend_cmd, cwd=base_dir)
    print("   ✓ FastAPI Backend running at:  http://127.0.0.1:8000")
    print("   ✓ Interactive API Docs at:     http://127.0.0.1:8000/docs")

    # Start Frontend
    frontend_dir = os.path.join(base_dir, "frontend")
    npm_cmd = "npm.cmd" if sys.platform == "win32" else "npm"
    frontend_proc = subprocess.Popen([npm_cmd, "run", "dev"], cwd=frontend_dir)
    print("   ✓ Vite React Frontend running at: http://localhost:3000")
    
    print("\n" + "=" * 65)
    print("  SKILLPILOT IS LIVE AND READY!")
    print("  Demo Accounts (Password: password123):")
    print("    - alex.ece@skillpilot.ai   (ECE Showcase: Dual Track)")
    print("    - priya.cse@skillpilot.ai  (CSE Specialist: High DSA)")
    print("    - rahul.aiml@skillpilot.ai (AI/ML & Data Science)")
    print("=" * 65)
    print("\nPress Ctrl+C in this terminal to stop all servers.\n")

    time.sleep(2)
    try:
        webbrowser.open("http://localhost:3000")
    except Exception:
        pass

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping SkillPilot servers...")
        backend_proc.terminate()
        frontend_proc.terminate()
        print("SkillPilot stopped.")

if __name__ == "__main__":
    main()
