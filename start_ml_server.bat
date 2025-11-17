@echo off
REM Script to start the Python API server for custom ML models

REM Check if we're in the right directory
if not exist "ml_models\api_server.py" (
    echo Error: api_server.py not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo Error: Python is not installed or not in PATH.
    pause
    exit /b 1
)

REM Check if required packages are installed
python -c "import flask" >nul 2>&1
if errorlevel 1 (
    echo Installing required Python packages...
    pip install -r ml_models\api_requirements.txt
)

REM Start the API server
echo Starting Python API server for custom ML models...
echo Server will be available at http://localhost:5000
python ml_models\api_server.py

pause