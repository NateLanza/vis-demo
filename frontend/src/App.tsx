import './App.css';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { MultiSelect, Option } from "react-multi-select-component";
import { DataVis } from './DataVis';

// URL to fetch data from
const DATA_ENDPOINT: string = "/api";

// URL to fetch attributes from
const ATTS_ENDPOINT: string = "/api/attributes";

// Default attributes to display
// 'Preffered' is a typo, just not mine- see soccer_small.json
const DEFAULT_ATTS: string[] = 
  ["Name", "Nationality", "National_Position", "Club", "Height",
   "Preffered_Foot", "Age", "Rating", "Weight"];

const DEFAULT_SORTBY: string = "Name";

/**
 * Width of the visualization column in px
 * Also needs to be updated in App.css
 */
const VIS_WIDTH: number = 400;

/**
 * Result of fetching data from the backend
 * 
 * @property data - Data fetched from backend; never[] while loading
 * @property loaded - Whether data has been fetched from backend
 */
type DataFetch = {
  data: never[];
  loaded: boolean;
};

/**
 * Custom hook to fetch data from backend
 * 
 * @param endpointURL - URL to fetch data from
 * @returns DataFetch object
 */
function useFetchData(endpointURL: string): DataFetch {
  // State to track whether data has been fetched
  const [loaded, setLoaded] = useState(false);
  // State to contain data
  const [data, setData] = useState([]);

  // Fetching data from backend
  useEffect(() => {
    fetch(endpointURL).then(
      (res: Response) => res.json()
    ).then(
      (data: React.SetStateAction<never[]>) => {
        setData(data);
        setLoaded(true);
      }
    );
  }, [loaded, endpointURL]); // Dependency array

  return { data, loaded };
}

/**
 * Converts an array of strings to an array of options
 * @param str - Array of strings to convert to options
 * @returns Array of options
 */
function stringToOptions(str: string[]): Option[] {
  return str.map((s: string) => ({label: s, value: s}));
}
  
function App() {
  // Fetch data from backend
  const playerData: DataFetch = useFetchData(DATA_ENDPOINT);
  const attsFetch: DataFetch = useFetchData(ATTS_ENDPOINT);

  // Convert atts to proper format for MultiSelect
  let atts: Array<{label: string, value: string}> = [];
  if (attsFetch.loaded) {
    atts = stringToOptions(attsFetch.data as string[]);
  }

  // Now lets handle multiselect changes
  const [selected, setSelected] = useState(stringToOptions(DEFAULT_ATTS));
  // Use a closure to give the callback access to the state
  // Probably not the cleanest way to do this, but it works for a small app
  const handleMultiSelectChange = (newSelect: Option[]) => {
    setSelected(newSelect);
  }

  // Now allow sorting
  const [sortBy, setSortBy] = useState(DEFAULT_SORTBY);
  // Sort direction- true for ascending, false for descending
  const [sortDir, setSortDir] = useState(true);
  // Again using a closure to give the callback access to the state
  const onClickSort = (att: string) => {
    if (att === sortBy) {
      setSortDir(!sortDir);
    } else {
      setSortDir(true); // Default ascending
      setSortBy(att);
    }
  }
  // Sort the data
  if (playerData.loaded) {
    playerData.data.sort((a: any, b: any) => {
      // This simple comparison sorts alphabetically,
      // which ends up being odd for number fields,
      // as ascending alphabetical sort is descending numerical sort
      if (a[sortBy] < b[sortBy]) {
        return sortDir ? -1 : 1;
      } else if (a[sortBy] > b[sortBy]) {
        return sortDir ? 1 : -1;
      } else {
        return 0;
      }
    });
  }

  // Render
  return (
    <div className="App">
      <section className='half'>
        <h1>Soccer Player Data</h1>
        {!attsFetch.loaded ? (
          <h4>Loading attributes...</h4>
        ) : (
          <MultiSelect
          options={atts}
          value={selected}
          labelledBy='Select'
          onChange={handleMultiSelectChange}
          />
        )}
        <br />
        {!playerData.loaded ? (
          <h4>Loading player data...</h4>
        ) : (
          <Table className="data" striped bordered hover>
            <thead>
              <tr>
                {selected.map((att) => (
                    <th onClick={() => onClickSort(att.value)}>{att.label}</th>
                ))}
              </tr>
            </thead>
          <tbody>
            {playerData.data.map((player: any) => (
              <tr>
                {selected.map((att) => (
                  <td>{player[att.label]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        )}
      </section>
      <section>
        <DataVis 
        playerName={null}
        playerData={playerData.loaded ? playerData.data : null}
        selectedAtts={selected.map((att) => att.value)}
        width={VIS_WIDTH}
        />
      </section>
    </div>
  );
}

export default App;
