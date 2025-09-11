# Overview
A web application to allow Teamfight Tactics players to view player match history and gameplay analytics, 
as well as save and share their favorite compositions.

## Prerequisites
Python 3.10+, Node 16+

## Setup
cd backend && python3 -m venv venv

source venv/bin/activate

pip install -r requirements.txt

cd ../frontend && npm install

# Run
### Backend
cd backend && source venv/bin/activate && uvicorn app:app --reload
### Frontend
cd frontend && npm run dev