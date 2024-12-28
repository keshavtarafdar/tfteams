from flask import Flask
from dotenv import load_dotenv
import os

app = Flask(__name__)
load_dotenv()

RIOT_API_KEY = os.getenv('RIOT_API_KEY')

@app.route('/')
def home():
    return "Flask server is running!"

if __name__ == '__main__':
    app.run(debug=True)