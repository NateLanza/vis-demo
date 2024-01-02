import './App.css';
import { useEffect, useState } from 'react';
import Table from 'react-bootstrap/Table';
import { MultiSelect, Option } from "react-multi-select-component";

// URL to fetch data from
const DATA_ENDPOINT: string = "/api";

// URL to fetch attributes from
const ATTS_ENDPOINT: string = "/api/attributes";

// Default attributes to display
// Preffered_Position is a typo, just not mine- see soccer_small.json
const DEFAULT_ATTS: string[] = 
  ["Name", "Nationality", "Club", "Age", "Preffered_Position"];

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

  // Render
  return (
    <div className="App">
      <section>
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
                  <th>{att.label}</th>
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
    </div>
  );
}

export default App;
