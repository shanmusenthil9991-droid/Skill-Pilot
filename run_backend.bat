@echo off
echo ========================================================
echo         SKILLPILOT BACKEND SERVER LAUNCHER
echo ========================================================
echo Starting FastAPI application on http://127.0.0.1:8000
echo API Documentation: http://127.0.0.1:8000/docs
echo ========================================================

cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
