import React from "react";
import { Card, Typography, Box } from "@mui/material";

const data = [
  { year: "2014", a: 50, b: 40, c: 30, d: 20 },
  { year: "2015", a: 60, b: 30, c: 20, d: 20 },
  { year: "2016", a: 80, b: 40, c: 30, d: 20 },
  { year: "2017", a: 100, b: 50, c: 40, d: 30 },
];

const colors = [
  "rgba(251,191,36,1)",
  "rgb(167, 133, 21)",
  "rgba(239,68,68,1)",
  "rgba(162,28,175,1)",
];
const labels = ["Label 1", "Label 2", "Label 3", "Label 4"];

const barHeight = 60;
const barGap = 48;
const chartWidth = 350;
const yAxisWidth = 70;

// --- Podesivo ---
const overlapRadius = 30; //  PREKLAPANJE
const framePadding = 15; // RAZMAK OKVIRA OD BARA
// ---------------

const keys = ["a", "b", "c", "d"];
const totals = data.map((row) => keys.reduce((sum, k) => sum + row[k], 0));
const maxTotal = Math.max(...totals);


function StackedBarRow({ row, y, maxTotal, chartWidth, overlapRadius, framePadding , strokeWidth = 4}) {
  const total = keys.reduce((sum, k) => sum + row[k], 0);
  const barWidth = (total / maxTotal) * chartWidth;
  let acc = 0;
  const segmentPositions = [];

  keys.forEach((k, idx) => {
    const value = row[k];
    const start = acc;
    acc += value;
    const x = (start / total) * barWidth + yAxisWidth;
    const w = (value / total) * barWidth;
    segmentPositions.push({ x, w });
  });

  return (
    <g>
              <rect
        x={yAxisWidth - framePadding}
        y={y - framePadding}
        width={barWidth + overlapRadius + framePadding * 2}
        height={barHeight + framePadding * 2}
        rx={overlapRadius + framePadding}
        fill="none"
        stroke="#64748b"
        strokeWidth={2}
        strokeDasharray="8 6"
      />
      {/* Segmenti sa bijelim okvirom */}
      {keys
        .map((k, idx) => {
          const { x, w } = segmentPositions[idx];
          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={w + overlapRadius}
              height={barHeight}
              rx={overlapRadius}
              fill={colors[idx]}
              stroke="#fff"
              strokeWidth={strokeWidth}
            />
          );
        })
        .reverse()}
    </g>
  );
}

  

export default function CustomStackedBarChart() {
  const chartHeight = data.length * (barHeight + barGap);
  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 3,
        maxWidth: 540,
        margin: "2rem auto",
        bgcolor: "#e3dcdc"
      }}
    >
      <Typography variant="h6" fontWeight={880} mb={3}>
        Combination Charts
      </Typography>
      <svg
        width={chartWidth + yAxisWidth + framePadding * 2 + 20}
        height={chartHeight + 20}
      >
        {/* Godine na Y osi*/}
        {data.map((row, i) => (
          <text
            key={row.year}
            x={yAxisWidth - 22}
            y={i * (barHeight + barGap) + barHeight / 2 + 16}
            textAnchor="end"
            fontSize="16"
            fontWeight="bold"
            fill="#222"
            alignmentBaseline="middle"
            dominantBaseline="middle"
          >
            {row.year}
          </text>
        ))}
        {/* Barovi */}
        {data.map((row, i) => (
          <StackedBarRow
            key={row.year}
            row={row}
            y={i * (barHeight + barGap) + 15}
            maxTotal={maxTotal}
            chartWidth={chartWidth}
            overlapRadius={overlapRadius}
            framePadding={framePadding}
            strokeWidth={3}
          />
        ))}
      </svg>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 2,
          flexWrap: "wrap",
        }}
      >
        {labels.map((label, idx) => (
          <Box
            key={label}
            sx={{ display: "flex", alignItems: "center", mr: 3, mb: 1 }}
          >
            <Box
              sx={{
                width: 18,
                height: 18,
                bgcolor: colors[idx],
                borderRadius: "50%",
                mr: 1,
              }}
            />
            <Typography variant="caption">{label}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
