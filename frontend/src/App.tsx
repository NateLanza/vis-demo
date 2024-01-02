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

function stringToOptions(str: string[]): Array<Option> {
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
  let defaults = stringToOptions(DEFAULT_ATTS);

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
          value={defaults}
          labelledBy='Select'
          />
        )}
        <br />
        {!playerData.loaded ? (
          <h4>Loading player data...</h4>
        ) : (
          <Table className="data" striped bordered hover>
            <thead>
              <tr>
                {DEFAULT_ATTS.map((att) => (
                  <th>{att}</th>
                ))}
              </tr>
            </thead>
          <tbody>
            {playerData.data.map((player: any) => (
              <tr>
                {DEFAULT_ATTS.map((att) => (
                  <td>{player[att]}</td>
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
