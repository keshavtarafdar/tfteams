from fastapi import FastAPI

app = FastAPI()

@app.get("/api/ping")
def ping():
    return {"message": "pong"}