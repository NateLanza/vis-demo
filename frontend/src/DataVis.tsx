import { DensityChart } from "./DensityChart";

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
 * Defines a visualization of data for a player
 * 
 * @param playerName Name of player to highlight data for; null for no highlight
 */
export const DataVis = (props: {
  playerName: string | null,
  playerData: any[],
  selectedAtts: string[],
}) => {
  console.log(getAttData(props.playerData, "Ranking"));
  return (
    <section>
      <DensityChart
        width={600}
        height={400}
        data={getAttData(props.playerData, "Rating")}
      />
    </section>
  )
};