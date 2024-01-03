import { get } from "http";
import { DensityChart } from "./DensityChart";
import { Lollipop, LolliPoint } from "./Lollipop";

/**
 * Generally we can infer whether to use a density chart or a lollipop chart
 * based on int vs string. However, some string datatypes need to be converted.
 * SHOULD NOT contain any categorical atts.
 */
const CONVERTABLE_ATTS: Array<string> = ["Height", "Weight"]

/**
 * Categorical atts that a player belongs to,
 * should be visualized with a lollipop chart.
 * SHOULD NOT contain any numeric atts or convertable atts.
 */
const CATEGORICAL_ATTS: Array<String> = ["Nationality", "National_Position",
"Club", "Preffered_Foot", "Club_Position", "Preffered_Position", "Work_Rate"]

/**'
 * Atts that don't make sense to visualize with PDs or Lollipops
 */
const NO_VIS_ATTS: string[] = ["Name", "Birth_Date", "Club_Joining"]

/**
 * Height of the visualization in px
 */
const VIS_HEIGHT: number = 400;

/**
 * Gets a list of all values for a specific attribute in the player data.
 * Should only be called on numerical attributes or atts in CONVERTABLE_ATTS, 
 * or return type may be wrong.
 * Converts string values to numbers if necessary.
 * @param playerData  Player data
 * @param att Attribute to get data for
 * @returns List of values for the attribute
 */
function getAttData(playerData: any[], att: string): number[] {
  return playerData.map((player) => {
    if (CONVERTABLE_ATTS.includes(att)) {
      // Conversion string to number only works for height and weight
      return Number((player[att] as string).split(" ")[0]);
    } else {
      return player[att] as number;
    }
  });
}

/**
 * Starting with a categorical attribute, counts
 * every player inside each category and returns
 * a list of counts for each category, as LolliPoints
 * Should only be called on categorical attributes in CATEGORICAL_ATTS.
 * @throws Error if called on non-categorical attribute
 * @param playerData Player data
 * @param att Attribute to count categories for
 */
function getCatData(playerData: any[], att: string): LolliPoint[] {
  if (!CATEGORICAL_ATTS.includes(att)) {
    throw new Error("getCatData called on non-categorical attribute");
  }

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
 * @param playerData Data for all players. Null if data isn't loaded
 * @param selectedAtts List of attributes to visualize
 */
export const DataVis = (props: {
  playerName: string | null,
  playerData: any[] | null,
  selectedAtts: string[],
  width: number,
}) => {
  if (!props.playerData) {
    return <></>;
  }

  return (
    <div>
    {props.selectedAtts.map((att: string) => {
      // Convert atts and select a vis
      if (NO_VIS_ATTS.includes(att)) {
        return null;
      } else {
        return (
          <>
            <h4>{att.replace("_", " ")}</h4>
            {!CATEGORICAL_ATTS.includes(att) ? (
              // Numerical att, use density chart
              <DensityChart
                width={props.width}
                height={VIS_HEIGHT}
                color="#9d174d"
                data={getAttData(props.playerData!, att)}
                highlight={props.playerName ? 
                  Number(props.playerData!.find(
                    (player) => player.Name === props.playerName)[att]) 
                  : undefined
                }
              />
            ) : (
              // String att, use lollipop chart
              <Lollipop
                width={props.width}
                height={VIS_HEIGHT}
                data={getCatData(props.playerData!, att)}
              />
            )}
          </>
        );
      }
    })}
  </div>
  )
};