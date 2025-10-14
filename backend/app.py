import os, requests, asyncio, httpx
from typing import List
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

# Custom data model for summoner data 
class SearchData(BaseModel):
    region: str
    gameName: str
    tagLine: str
    start: int = 0

# Custom data model for matches
class MatchIdList(BaseModel):
    match_ids: List[str]
    region: str

PLATFORM_MAP = {
    "americas": "na1",
    "europe": "euw1",
    "asia": "kr",
    "sea": "sg2"
}

API_KEY = os.getenv("RIOT_API_KEY")

# Path option decorator that defines lookup() as handling requests to the route /api/lookup
@app.post("/api/lookup")
async def get_player_data(data:SearchData):
    headers = { "X-Riot-Token": API_KEY }
    account_url = f"https://{data.region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/{data.gameName}/{data.tagLine}"    

    async with httpx.AsyncClient() as client:
        # Get the puuid first, for the following requests
        try:
            account_response = await client.get(account_url, headers=headers)
            account_response.raise_for_status()
            puuid = account_response.json().get('puuid')
        except httpx.HTTPStatusError as e:
            if e.response.status_code == 404:
                raise HTTPException(status_code=404, detail=f"Riot account '{data.gameName}#{data.tagLine}' not found.")
            raise HTTPException(status_code=500, detail=f"An error occurred with the Riot API: {e}")
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"A network/async error occurred: {e}")
        
        platform = PLATFORM_MAP.get(data.region.lower(), "na1")
        league_url = f"https://{platform}.api.riotgames.com/tft/league/v1/by-puuid/{puuid}"
        summoner_url = f"https://{platform}.api.riotgames.com/tft/summoner/v1/summoners/by-puuid/{puuid}"
        matches_url = f"https://{data.region}.api.riotgames.com/tft/match/v1/matches/by-puuid/{puuid}/ids?start={data.start}&count=20"

        try:
            task1 = client.get(league_url, headers=headers)
            task2 = client.get(summoner_url, headers=headers)
            task3 = client.get(matches_url, headers=headers)
            responses = await asyncio.gather(task1, task2, task3, return_exceptions=True)
            league_res, summoner_res, matches_res = responses

            summoner_data = summoner_res.json() if not isinstance(summoner_res, Exception) and summoner_res.status_code == 200 else {}
            league_data = league_res.json() if not isinstance(league_res, Exception) and league_res.status_code == 200 else []
            match_ids = matches_res.json() if not isinstance(matches_res, Exception) and matches_res.status_code == 200 else []
        except Exception as e:
            raise HTTPException(status_code=503, detail=f"A network/async error occurred during parallel fetch: {e}")

    # tftleague_data is a list of the different game modes, so just grab ranked from there
    # NOTE: if you ever care about league-id, it's a part of the TFT-LEAGUE-V1 call
    ranked_data = next((entry for entry in league_data if entry.get("queueType") == "RANKED_TFT"), None)

    if ranked_data:
        return {
            "puuid": puuid,
            "profileIconId": summoner_data.get("profileIconId"),
            "summonerLevel": summoner_data.get("summonerLevel"),
            "match_ids": match_ids,
            "tier": ranked_data.get("tier"),
            "rank": ranked_data.get("rank"),
            "leaguePoints": ranked_data.get("leaguePoints"),
            "wins": ranked_data.get("wins"),
            "losses": ranked_data.get("losses"),
        }
    else:
        return {
            "puuid": puuid,
            "profileIconId": summoner_data.get("profileIconId"),
            "summonerLevel": summoner_data.get("summonerLevel"),
            "match_ids": match_ids,
            "tier": "Unranked",
            "rank": "",
            "leaguePoints": 0,
            "wins": 0,
            "losses": 0,
        }

@app.post("/api/match-details")
def get_match_details(data:MatchIdList):
    match_details = []
    headers = { "X-Riot-Token": API_KEY }

    for id in data.match_ids:
        request_url = f"https://{data.region}.api.riotgames.com/tft/match/v1/matches/{id}/"
        try:
            response = requests.get(request_url, headers=headers)
            response.raise_for_status()
            match_details.append(response.json())
        except requests.exceptions.HTTPError as e:
            print(f"Match ID #{id} not found: {e}")
            continue # to next match
        except requests.exceptions.RequestException as e:
            raise HTTPException(status_code=503, detail=f"A network error occurred: {e}")
    
    return match_details