/**
 * All code in this file shamelessly copied from
 * https://www.react-graph-gallery.com/density-plot
 * I do not claim ownership nor authorship.
 * All credit goes to Yan Holtz.
 * Some modifications by me so that it works
 * in strict typescript and works for my data.
 * Changes include:
 *  - Adding type annotations
 *  - Scaling the x axis to the data
 *    - Requires scaling the domain by a factor
 * @author Yan Holtz
 * @see https://www.react-graph-gallery.com/density-plot
 */

import { useMemo } from "react";
import * as d3 from "d3";
import { ScaleLinear } from "d3";

// Plot margin
const MARGIN = { top: 30, right: 30, bottom: 50, left: 50 };
// Length of ticks on the x axis
const TICK_LENGTH = 6;
// Scale factor for x axis above max value
const X_SCALE_FACTOR = 1.2;

type DensityChartProps = {
  width: number;
  height: number;
  color: string;
  data: number[];
  highlight?: number;
};

/**
 * 
 * @param width Width of the chart in px
 * @param height Height of the chart in px
 * @param data Data to display as an array of numbers
 * @param highlight Optional value to highlight on the chart with a vertical line
 * @returns 
 */
export const DensityChart = ({ width, height, color, data, highlight }: DensityChartProps) => {
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    return d3
      .scaleLinear()
      // Domain must be scaled because the final point on the SVG path
      // draws a line to the first point- so the final point should be
      // 0. This is done by scaling the domain by a factor of 1.2
      // to get well above the max, where the est density should be 0
      .domain([0, Math.max(...data) * X_SCALE_FACTOR])
      .range([10, boundsWidth - 10]);
  }, [data, width]);

  // Compute kernel density estimation
  const density = useMemo(() => {
    const kde = kernelDensityEstimator(kernelEpanechnikov(7), xScale.ticks(40));
    return kde(data);
  }, [xScale]);

  const yScale = useMemo(() => {
    const max = Math.max(...density.map((d) => d[1]));
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, max]);
  }, [data, height]);

  const path = useMemo(() => {
    const lineGenerator = d3
      .line()
      .x((d) => xScale(d[0]))
      .y((d) => yScale(d[1]))
      .curve(d3.curveBasis);
    return lineGenerator(density);
  }, [density]);

  return (
    <svg width={width} height={height}>
      <g
        width={boundsWidth}
        height={boundsHeight}
        transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
      >
      <path
        d={path || undefined}
        fill={color}
        opacity={0.3}
        stroke="black"
        strokeWidth={2}
        strokeLinejoin="round"
      />
      {/* Highlight line */}
      {highlight && (
        <line
          x1={xScale(highlight)}
          x2={xScale(highlight)}
          y1={0}
          y2={boundsHeight}
          stroke={color}
          strokeWidth={2}
        />
      )}
        {/* X axis, use an additional translation to appear at the bottom */}
        <g transform={`translate(0, ${boundsHeight})`}>
          <AxisBottom xScale={xScale} pixelsPerTick={40} />
        </g>
      </g>
    </svg>
  );
};

// Function to compute density
function kernelDensityEstimator(kernel: (x: number) => number, X: number[]): 
    (V: number[]) => [number, number][] 
{
  return function (V: number[]): [number, number][] {
    return X.map(function (x): [number, number] {
      return [
        x,
        d3.mean(V, function (v: number) {
          return kernel(x - v);
        }) || 0, // Add a default value of 0 for undefined values
      ];
    });
  };
}

function kernelEpanechnikov(k: number) {
  return function (v: number) {
    return Math.abs((v /= k)) <= 1 ? (0.75 * (1 - v * v)) / k : 0;
  };
}

type AxisBottomProps = {
  xScale: ScaleLinear<number, number>;
  pixelsPerTick: number;
};

const AxisBottom = ({ xScale, pixelsPerTick }: AxisBottomProps) => {
  const range = xScale.range();

  const ticks = useMemo(() => {
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [xScale]);

  return (
    <>
      {/* Main horizontal line */}
      <path
        d={["M", range[0], 0, "L", range[1], 0].join(" ")}
        fill="none"
        stroke="currentColor"
      />

      {/* Ticks and labels */}
      {ticks.map(({ value, xOffset }) => (
        <g key={value} transform={`translate(${xOffset}, 0)`}>
          <line y2={TICK_LENGTH} stroke="currentColor" />
          <text
            key={value}
            style={{
              fontSize: "10px",
              textAnchor: "middle",
              transform: "translateY(20px)",
            }}
          >
            {value}
          </text>
        </g>
      ))}
    </>
  );
};