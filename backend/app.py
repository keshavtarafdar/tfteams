import os, requests, json
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
    region: str
    gameName: str
    tagLine: str

API_KEY = os.getenv("RIOT_API_KEY")
print(API_KEY)

leagueId = None

# Path option decorator that defines lookup() as handling requests to the route /api/lookup
@app.post("/api/lookup")
def get_puuid(data:SearchData):
    request_url = f"https://{data.region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{data.gameName}/{data.tagLine}"    
    headers = {
        "X-Riot-Token": API_KEY
    }

    try:
        response = requests.get(request_url, headers=headers)
        response.raise_for_status() # Raises an HTTPError if request is unsuccessful
    except requests.exceptions.HTTPError as e: # Catches the HTTPError from above
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Riot account '{data.gameName}#{data.tagLine}' not found.")
        raise HTTPException(status_code=500, detail=f"An error occurred with the Riot API: {e}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Could not connect to Riot API: {e}")
    
    puuid = response.json()['puuid']
    return get_match_history(puuid, data.region)

def get_leagueId(puuid:str):
    request_url = f"https://na1.api.riotgames.com/tft/league/v1/by-puuid/{puuid}"
    headers = {
        "X-Riot-Token": API_KEY
    }

    try:
        response = requests.get(request_url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Summoner with PUUID '{puuid}' not found.")
        raise HTTPException(status_code=500, detail=f"An error occurred with the Riot API: {e}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Could not connect to Riot API: {e}")
    
    leagueId = response.json()['leagueId']

def get_match_history(puuid:str, region: str):
    # TODO manually adding the start and end headers to this request...
    request_url = f"https://{region}.api.riotgames.com/tft/match/v1/matches/by-puuid/{puuid}/ids?start=0&count=20"
    headers = {
        "X-Riot-Token": API_KEY
    }

    try:
        response = requests.get(request_url, headers=headers)
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        if e.response.status_code == 404:
            raise HTTPException(status_code=404, detail=f"Summoner with PUUID '{puuid}' not found.")
        raise HTTPException(status_code=500, detail=f"An error occurred with the Riot API: {e}")
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=503, detail=f"Could not connect to Riot API: {e}")
    
    return response.json()