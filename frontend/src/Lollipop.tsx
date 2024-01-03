/**
 * Code shamelessly copied from
 * https://www.react-graph-gallery.com/lollipop-plot
 * I do not claim ownership nor authorship.
 * All credit goes to Yan Holtz.
 * Some modifications by me so that it works
 * in strict typescript and for my data.
 * Changes include:
 * - Adding type annotations
 * @author Yan Holtz
 * @see https://www.react-graph-gallery.com/lollipop-plot
 */

import { useMemo } from "react";
import * as d3 from "d3";
import * as C from "./Constants";

const MARGIN = { top: 30, right: 30, bottom: 30, left: 100 };

/**
 * A single category on the lollipop plot
 * @property name Name of the category
 * @property value Count of items in the category
 */
export type LolliPoint = {
  name: string;
  value: number;
}

type LollipopProps = {
  width: number;
  height: number;
  color: string;
  selectedColor: string;
  data: LolliPoint[];
  selected?: string; // Category to select
};

export const Lollipop = ({ width, height, color, selectedColor, data, selected}: LollipopProps) => {
  // bounds = area inside the graph axis = calculated by substracting the margins
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  // Y axis is for groups since the barplot is horizontal
  const groups = data.sort((a, b) => b.value - a.value).map((d) => d.name);
  const yScale = useMemo(() => {
    return d3.scaleBand().domain(groups).range([0, boundsHeight]);
  }, [data, height]);

  // X axis
  const xScale = useMemo(() => {
    const [min, max] = d3.extent(data.map((d) => d.value));
    return d3
      .scaleLinear()
      .domain([0, max || 10])
      .range([0, boundsWidth]);
  }, [data, width]);

  // Build the shapes
  const allShapes = data.map((d, i) => {
    const y = (yScale(d.name) as number) + yScale.bandwidth() / 2;

    const currColor: string = selected && 
      selected === d.name ? selectedColor : color;

    return (
      <g key={i}>
        <line
          x1={xScale(0)}
          y1={y}
          y2={y}
          x2={xScale(d.value)}
          opacity={0.7}
          stroke={currColor}
          strokeWidth={C.LINE_THICK}
        />
        <circle
          cy={y}
          cx={xScale(d.value)}
          opacity={0.7}
          stroke={currColor}
          fill={currColor}
          strokeWidth={1}
          r={C.CIRCLE_RADIUS}
        />
        <text
          x={xScale(0) - 7}
          y={y}
          textAnchor="end"
          alignmentBaseline="central"
          fontSize={C.FONT_SIZE}
        >
          {d.name}
        </text>
      </g>
    );
  });

  const grid = xScale
    .ticks(5)
    .slice(1)
    .map((value, i) => (
      <g key={i}>
        <line
          x1={xScale(value)}
          x2={xScale(value)}
          y1={0}
          y2={boundsHeight}
          stroke={C.AXIS_COLOR}
          opacity={0.2}
          strokeWidth={C.LINE_THICK}
        />
        <text
          x={xScale(value)}
          y={boundsHeight}
          textAnchor="middle"
          alignmentBaseline="central"
          fontSize={C.FONT_SIZE}
          stroke={C.AXIS_COLOR}
          opacity={0.8}
        >
          {value}
        </text>
      </g>
    ));

  return (
    <div>
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {grid}
          {allShapes}
        </g>
      </svg>
    </div>
  );
};
