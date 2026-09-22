# SkillPilot - Run All PowerShell Launcher
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "       SKILLPILOT FULL-STACK APPLICATION LAUNCHER" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan

Write-Host "Step 1: Checking Synthetic Dataset..." -ForegroundColor Yellow
python data/generate_dataset.py

Write-Host "Step 2: Checking Database & ML Models..." -ForegroundColor Yellow
python -m backend.app.database.seed

Write-Host "Step 3: Launching Backend and Frontend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location frontend; npm run dev"

Write-Host "SkillPilot servers started!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "Backend:  http://127.0.0.1:8000/docs" -ForegroundColor White
