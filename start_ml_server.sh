#!/bin/bash
# Script to start the Python API server for custom ML models

# Check if we're in the right directory
if [ ! -f "ml_models/api_server.py" ]; then
    echo "Error: api_server.py not found. Please run this script from the project root directory."
    exit 1
fi

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed."
    exit 1
fi

# Check if required packages are installed
if ! python3 -c "import flask" &> /dev/null; then
    echo "Installing required Python packages..."
    pip install -r ml_models/api_requirements.txt
fi

# Start the API server
echo "Starting Python API server for custom ML models..."
echo "Server will be available at http://localhost:5000"
python3 ml_models/api_server.py