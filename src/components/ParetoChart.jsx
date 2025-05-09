import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  Legend,
} from 'recharts';
import { Box, Typography } from '@mui/material';

const data = [
  { time: '07.00', clicks: 100, views: 300, conversions: 150 },
  { time: '07.30', clicks: 150, views: 350, conversions: 180 },
  { time: '08.00', clicks: 200, views: 400, conversions: 200 },
  { time: '08.30', clicks: 300, views: 500, conversions: 350 },
  { time: '09.00', clicks: 250, views: 450, conversions: 300 },
  { time: '09.30', clicks: 350, views: 550, conversions: 400 },
  { time: '10.00', clicks: 400, views: 600, conversions: 450 },
  { time: '10.30', clicks: 350, views: 550, conversions: 420 },
  { time: '11.00', clicks: 300, views: 500, conversions: 400 },
  { time: '11.30', clicks: 320, views: 520, conversions: 410 },
];

const ParetoChart = () => {
  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        borderRadius: '24px',
        padding: '30px',
        boxShadow: 3,
        width: '585px',
        height: '480px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant='h6'
        sx={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#333',
          marginBottom: '20px',
        }}
      >
        Pareto Chart
      </Typography>
      <ResponsiveContainer width='100%' height={350}>
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 30, left: 10, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray='3 3' vertical={false} />
          <XAxis dataKey='time' />
          <YAxis />
          <Tooltip
            contentStyle={{
              backgroundColor: '#333',
              color: '#fff',
              borderRadius: '8px',
              padding: '10px 15px',
              border: 'none',
              fontSize: '14px',
              boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
            }}
            cursor={{ fill: 'rgba(0,0,0,0.05)' }}
          />
          <Legend
            wrapperStyle={{
              bottom: -10,
              fontSize: '14px',
              fontWeight: 600,
            }}
            iconSize={14}
          />
          <Area
            type='monotone'
            dataKey='views'
            fill='#9c88ff'
            stroke='#9c88ff'
            fillOpacity={0.2}
          />
          <Bar dataKey='clicks' barSize={30} fill='#333333' />
          <Line
            type='monotone'
            dataKey='conversions'
            stroke='#4A90E2'
            strokeWidth={3}
            dot={{ r: 6, fill: '#fff', stroke: '#4A90E2', strokeWidth: 3 }}
            activeDot={{
              r: 8,
              fill: '#fff',
              stroke: '#4A90E2',
              strokeWidth: 3,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default ParetoChart;
