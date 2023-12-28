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
    self.data: dict = self.load_data()
  
  def load_data(self) -> dict:
    '''
    Loads the data from the JSON file.
    '''
    with open(self.jsonpath, 'r') as f:
      data: dict = json.load(f)
    return data