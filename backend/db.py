import json

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
    '''
    for player in self.data:
      if player['name'] == name:
        return player 
    return None
  
  def get_player_names(self) -> list[str]:
    '''
    Returns a list of the names of all players.
    '''
    return [player['Name'] for player in self.data]