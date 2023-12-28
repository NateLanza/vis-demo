import http
from django.http import HttpResponse
from flask import Flask, render_template
from .db import Database # Mock database

app = Flask(__name__)

db = Database()

@app.route('/api')
def index():
    return db.get_player_names()