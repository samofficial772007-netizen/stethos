# \# Stethos — Machine Acoustic Anomaly Detection

# 

# Stethos is a software project in development that aims to identify unusual patterns in machine sounds using audio processing and machine learning.

# 

# \## Current Progress

# 

# \- HTML, CSS and JavaScript frontend

# \- FastAPI backend

# \- Health-check endpoint

# \- WAV audio-upload testing endpoint

# \- Interactive API documentation

# 

# \## Technology Stack

# 

# \- \*\*Frontend:\*\* HTML, CSS, JavaScript

# \- \*\*Backend:\*\* Python, FastAPI

# \- \*\*Audio processing:\*\* Librosa, NumPy (planned for feature extraction)

# \- \*\*Machine learning:\*\* Scikit-learn Isolation Forest (planned)

# \- \*\*Database:\*\* SQLite (planned)

# 

# \## Run Locally

# 

# 1\. Clone the repository:

# 

# &#x20;  ```bash

# &#x20;  git clone https://github.com/samofficial772007-netizen/stethos.git

# &#x20;  cd stethos

# &#x20;  ```

# 

# 2\. Create and activate a Python virtual environment.

# 

# &#x20;  On Windows:

# 

# &#x20;  ```powershell

# &#x20;  python -m venv .venv

# &#x20;  .\\.venv\\Scripts\\Activate.ps1

# &#x20;  ```

# 

# 3\. Install the project dependencies:

# 

# &#x20;  ```bash

# &#x20;  pip install -r requirements.txt

# &#x20;  ```

# 

# 4\. Start the backend:

# 

# &#x20;  ```bash

# &#x20;  python -m uvicorn app.main:app --reload

# &#x20;  ```

# 

# 5\. Open the application:

# 

# &#x20;  - Frontend: http://127.0.0.1:8000

# &#x20;  - Health check: http://127.0.0.1:8000/api/health

# &#x20;  - API documentation: http://127.0.0.1:8000/docs

# 

# \## Roadmap

# 

# \- \[ ] Verify WAV audio uploads

# \- \[ ] Extract acoustic features from recordings

# \- \[ ] Build and evaluate an anomaly-detection model

# \- \[ ] Connect model predictions to the frontend

# \- \[ ] Store analysis history

# 

# \## Project Status

# 

# \*\*Early prototype.\*\* The frontend and backend are running. Real machine-anomaly detection is still under development; the current upload endpoint does not diagnose machine faults.

# 

# \## Disclaimer

# 

# Stethos is a development project and is not currently a validated industrial safety or predictive-maintenance system.

