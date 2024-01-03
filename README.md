# Flask/React/D3 Data Visualizer
This is an example program that visualizes numerical and categorical attributes of a dataset. It's currently set up on a small example dataset of soccer players. However, with some modifications it can visualize any dataset of homogenous objects where attributes are categorical or numerical.

## Installation/Running
1. Ensure you have Python, NPM, Typescript, and Node.js on your computer
2. Clone the repo
3. Either create a virtual Python env in the `/backend` folder or use your global environment. Either way, you need Flask installed in the environment that you'll be using- `pip install flask` should work for most Python installs.
4. Install Node dependencies in `/frontend` by running `npm install` in that directory. This should populate a `/frontend/node_modules` folder with the necessary dependencies, which are located in `package.json`.
5. Run the backend by opening your python environment with Flask and executing `flask run` in the `/backend` directory. Ensure port `5000` is open and accessible as the backend runs on this port.
6. Run the frontend by executing `npm start` in the `/frontend` directory. Ensure port `3000` is open and accessible as the frontend runs on this port.
7. If it doesn't open automatically, go to `http://localhost:3000` in your browser to view the data visualization.

## Usage

### GUI
When `localhost:3000` is opened in a browser with the frontend and backend running, it displays a GUI with a table on the left and visualizations on the right. 
- A dropdown menu on the top allows attributes to be selected and deselected. Selecting an attribute adds a column for it to the table and adds a visualization for it on the right (unless it falls into a small subset of attributes which aren't visualized because they aren't categorical or numerical). 
- Clicking the header of any column sorts the entire table by that attribute. Clicking again reverses the sort order. 
- Clicking a player row highlights their position in all data visualizations on the right. For numerical attributes, a vertical line indicates where the player falls in the distribution. For categorical attributes, the category of the selected player is shaded a different color.

### API
The server also handles API calls to the `/api` endpoint, returning results as JSON. These calls can be made to `localhost:3000`, in which case they are proxied to `localhost:5000`, or made directly to `localhost:5000`. All requests are URL-decoded, so `+` will convert to space, etc.

**Endpoints:**
- `/api`: Index endpoint; returns a list of all players and their attribute values
- `/api/player/<name>`: Returns the details of a single player by name. Name is case-insensitive but diacritics are currently matched.
- `/api/country/<country>`: Returns a list of all players and their attribute values from a given country.
- `/api/club/<club>`: Returns a list of all players and their attribute values from a given club.
- `/api/attributes`: Returns a list of all attributes that players have.

## Dev To-Do
I'm hoping to have more time to improve this project, as I really enjoyed writing it and have more ideas to improve it. Current ideas:
- Dark mode!
- Check for and uninstall unused NPM dependencies
- Add `IPlayer` interface so that TS can typecheck Player objects
- Abstract table code from `App.tsx` to its own file
- Move ALL constants to `Constants.tsx`
- Deselect player on 2nd click
- Visualizations in same order as table
- Quantized scrolling of visualizations
- Arrows to indicate sorting in `<th>` elements
- Minus icon in `<th>` to remove column directly from table
- Abstract interfaces and data processing so that any data type can be plugged in as long as a corresponding interface is defined for it.
