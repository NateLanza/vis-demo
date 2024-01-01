import http
from django.http import HttpResponse
from flask import Flask, render_template
from .db import Database # Mock database
from urllib.parse import unquote_plus

app = Flask(__name__)

db = Database()

@app.route('/api')
def index():
    '''
    Returns a list of all players.
    '''
    return db.get_players()

@app.route('/api/player/<name>')
def get_player(name: str) -> dict | None:
    '''
    Returns the player with the given name.
    '''
    return db.get_player(unquote_plus(name))

@app.route('/api/country/<country>')
def get_country_players(country: str) -> list[dict]:
    '''
    Returns a list of all players from the given country.
    '''
    return db.get_country_players(unquote_plus(country))

@app.route('/api/club/<club>')
def get_club_players(club: str) -> list[dict]:
    '''
    Returns a list of all players from the given club.
    '''
    return db.get_club_players(unquote_plus(club))

@app.route('/api/attributes')
def get_attributes() -> list[str]:
    '''
    Returns a list of all attributes.
    '''
    return db.get_attributes()