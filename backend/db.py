import json
import string

class Database:
  '''
  A mock database class.
  Doesn't actually connect to a database,
  but simulates a DB API for use by the rest
  of the app.
  '''

  def __init__(self):
    self.jsonpath: str = 'soccer_small.json'
    self.data: dict = self._load_data()
  
  def _load_data(self) -> dict:
    '''
    Loads the data from the JSON file.
    '''
    with open(file=self.jsonpath, mode='r', encoding='utf-8') as f:
      data: dict = json.load(f)
    return data
  
  def get_player(self, name: str) -> dict | None:
    '''
    Returns the player with the given name.
    Case-insensitive.
    '''
    name = name.lower()
    for player in self.data:
      if player['Name'].lower() == name:
        return player 
    return None
  
  def get_players(self) -> list[dict]:
    '''
    Returns a list of all players as dictionaries.
    '''
    return [player for player in self.data]
  
  def get_country_players(self, country: str) -> list[dict]:
    '''
    Returns a list of all players from the given country.
    Case-insensitive.
    '''
    country = country.lower()
    return [player for player in self.data if player['Nationality'].lower() == country]
  
  def get_club_players(self, club: str) -> list[dict]:
    '''
    Returns a list of all players from the given club.
    Case-insensitive.
    '''
    club = club.lower()
    return [player for player in self.data if player['Club'].lower() == club]
  
  def get_attributes(self) -> list[str]:
    '''
    Returns a list of all attributes.
    '''
    return self.data[0].keys()