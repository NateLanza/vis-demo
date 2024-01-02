import './App.css';
import { useEffect, useState } from 'react';

// URL to fetch data from
const DATA_ENDPOINT: string = "/api";

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
  
function App() {
  const playerData: DataFetch = useFetchData(DATA_ENDPOINT);
  
  return (
    <div className="App">
      <section>
        {!playerData.loaded ? ( // If not loaded, <h4>, else table
          <h4>Loading player data...</h4>
        ) : (
          <table className="data">
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
        </table>
        )}
      </section>
    </div>
  );
}

export default App;
