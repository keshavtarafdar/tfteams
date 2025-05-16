import os
from dotenv import load_dotenv
from fastapi import FastAPI
import requests

load_dotenv()
RIOT_KEY = os.getenv("RIOT_API_KEY")
BASE_URL = "https://na1.api.riotgames.com"
app = FastAPI()

# @app is a path operation decorator - tells FastAPI that ping()
# handles get operations at the path "/api/ping"
@app.get("/api/ping")
def ping():
    return {"message": "pong"}