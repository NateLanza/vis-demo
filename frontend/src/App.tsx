import './App.css';
import { useEffect, useState } from 'react';

// URL to fetch data from
const API_URL: string = "/api";

// Default attributes to display
// Preffered_Position is a typo, just not mine- see soccer_small.json
const DEFAULT_ATTS: string[] = 
  ["Name", "Nationality", "Club", "Age", "Preffered_Position"];
  
function App() {
  // State to track whether data has been fetched
  const [dataLoaded, setDataLoaded] = useState(false);
  // State to contain data
  const [data, setData] = useState([]);

  // Fetching data from backend
  useEffect(() => {
    // Prevent infinite loop
    if (dataLoaded) return;

    fetch(API_URL).then(
      (res: Response) => res.json()
    ).then(
      (data: React.SetStateAction<never[]>) => {
        setData(data);
        setDataLoaded(true);
      }
    );
  }, [dataLoaded]); // Dependency array
  return (
    <div className="App">
      <section>
        {!dataLoaded ? ( // If not loaded, <h4>, else table
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
            {data.map((player: any) => (
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
