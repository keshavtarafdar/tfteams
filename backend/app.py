import os
from dotenv import load_dotenv
from fastapi import FastAPI
import requests


# const [msg, setMsg] = useState('Loading...')
# useEffect(() => {
#    fetch('/api/ping')
#      .then(res => res.json())
#      .then(data => setMsg(data.message))
# }, [])

load_dotenv()
app = FastAPI()

api_key = os.getenv("RIOT_API_KEY")
region = "na1"
BASE_URL = "https://{region}.api.riotgames.com"

# @app is a path operation decorator - tells FastAPI that ping()
# handles get operations at the path "/api/ping"
@app.get("/api/ping")
def ping():
    return {"message": "pong"}