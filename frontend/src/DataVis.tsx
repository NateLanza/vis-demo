import { DensityChart } from "./DensityChart";
import { Lollipop, LolliPoint } from "./Lollipop";

/**
 * Generally we can infer whether to use a density chart or a lollipop chart
 * based on int vs string. However, some string datatypes need to be converted
 */
const CONVERTABLE_ATTS: Array<string> = ["Height", "Weight", ]

/**'
 * Atts that don't make sense to visualize with PDs or Lollipops
 */
const NO_VIS_ATTS: string[] = ["Name", "Birth_Date"]

/**
 * Gets a list of all values for a specific attribute in the player data
 * @param playerData  Player data
 * @param att Attribute to get data for
 * @returns List of values for the attribute
 */
function getAttData(playerData: any[], att: string): number[] {
  return playerData.map((player) => player[att]);
}

/**
 * Starting with a categorical attribute, counts
 * every player inside each category and returns
 * a list of counts for each category, as LolliPoints
 * @param playerData Player data
 * @param att Attribute to count categories for
 */
function getCatData(playerData: any[], att: string): LolliPoint[] {
  const counts: { [key: string]: number } = {};
  playerData.forEach((player) => {
    const cat = player[att];
    if (cat in counts) {
      counts[cat] += 1;
    } else {
      counts[cat] = 1;
    }
  });
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}


/**
 * Defines a visualization of data for a player
 * 
 * @param playerName Name of player to highlight data for; null for no highlight
 */
export const DataVis = (props: {
  playerName: string | null,
  playerData: any[],
  selectedAtts: string[],
}) => {
  return (
    <section>
      <DensityChart
        width={600}
        height={400}
        color="#f00"
        data={getAttData(props.playerData, "Marking")}
        highlight={30}
      />
      <Lollipop
        width={600}
        height={400}
        data={getCatData(props.playerData, "Club")}
      />
    </section>
  )
};