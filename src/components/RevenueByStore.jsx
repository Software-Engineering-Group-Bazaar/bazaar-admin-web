import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { name: 'TechWorld', value: 13800 },
  { name: 'FashionZone', value: 9200 },
  { name: 'BookNest', value: 6400 },
  { name: 'HealthyMart', value: 4600 },
  { name: 'Tools4U', value: 3100 },
];

const barColor = '#6366F1';

const RevenueByStore = () => (
  <Card
    sx={{
      borderRadius: 3,
      boxShadow: 3,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <CardContent sx={{ flexShrink: 0 }}>
      <Typography variant='h6' align='center'>
        Revenue by Store
      </Typography>
    </CardContent>
    <Box sx={{ flexGrow: 1, px: 2 }}>
      <ResponsiveContainer width='100%' height='100%'>
        <BarChart
          layout='vertical'
          data={data}
          margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
        >
          <XAxis
            type='number'
            domain={[0, 'dataMax + 2000']}
            tickFormatter={(v) => `$${(v / 1000).toFixed(1)}K`}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            dataKey='name'
            type='category'
            axisLine={false}
            tickLine={false}
            width={80}
            tick={{ fontSize: 14 }}
          />
          <Tooltip formatter={(val) => `$${val}`} />
          <Bar
            dataKey='value'
            fill={barColor}
            barSize={16}
            radius={[0, 8, 8, 0]}
          >
            {data.map((entry, idx) => (
              <Cell key={idx} fill={barColor} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Box>
    <Box sx={{ flexShrink: 0, px: 2, pb: 2, textAlign: 'right' }}>
      {/** Prikažemo vrijednosti na kraju svakog bara */}
      {data.map((entry) => (
        <Typography
          key={entry.name}
          variant='caption'
          sx={{
            position: 'absolute',
            right: 16,
            // ovako se label bolje poravna, ali može i Recharts LabelList
          }}
        >
          ${entry.value.toLocaleString()}
        </Typography>
      ))}
    </Box>
  </Card>
);

export default RevenueByStore;
