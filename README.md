## Prerequisites
Python 3.10+, Node 16+

## Install
git clone … && cd TFTeams
# backend
cd backend && python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
# frontend
cd ../frontend && npm install

## Run
# in one shell (backend)
cd backend && source venv/bin/activate && uvicorn app:app --reload
# in another (frontend)
cd frontend && npm run dev