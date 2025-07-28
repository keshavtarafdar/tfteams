import os, requests
from dotenv import load_dotenv
from pydantic import BaseModel
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()

# The list of origins that are allowed to make requests to this backend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# CORS allows frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all methods
    allow_headers=["*"], # Allows all headers
)

# Define a data model 
class SearchData(BaseModel):
    gameName: str
    tagLine: str

API_KEY = os.getenv("RIOT_API_KEY")

# Path option decorator that defines lookup() as handling requests to the route /api/lookup
@app.post("/api/lookup")
def lookup(data:SearchData):
    base_url = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/"
    request_url = "{}{}/{}".format(base_url, data.gameName, data.tagLine)
    headers = {
        "X-Riot-Token": API_KEY
    }

    try:
        riot_response = requests.get(request_url, headers=headers)
        riot_response.raise_for_status() # Raises an HTTPError if request is unsuccessful
    except requests.exceptions.RequestException as e: # Catches the HTTPError from above
        if riot_response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Riot account '{data.gameName}#{data.tagLine}' not found.")
        raise HTTPException(status_code=500, detail=f"An error occurred with the Riot API: {e}")
    
    return riot_response.json()