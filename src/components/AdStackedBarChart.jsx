import React, { useEffect, useState } from 'react';
import { Card, Typography, Box } from '@mui/material';
import { apiGetAllAdsAsync } from '../api/api.js';
import { format, parseISO } from 'date-fns';
import { useTranslation } from 'react-i18next';

const colors = ['#6366F1', '#F59E0B'];
const labels = ['Fixed', 'PopUp'];

const barHeight = 50;
const barGap = 45;
const chartWidth = 200;
const yAxisWidth = 90;
const overlapRadius = 20;
const framePadding = 10;

function groupByMonthAndType(ads) {
  const byMonth = {};
  ads.forEach((ad) => {
    const date = ad.startTime || ad.endTime;
    if (!date) return;
    const month = format(parseISO(date), 'yyyy-MM');
    if (!byMonth[month]) byMonth[month] = { year: month, Fixed: 0, PopUp: 0 };
    if (ad.adType === 'Fixed') byMonth[month].Fixed += 1;
    if (ad.adType === 'PopUp') byMonth[month].PopUp += 1;
  });

  // Sortiraj po mjesecima
  const sortedMonths = Object.values(byMonth).sort((a, b) =>
    a.year.localeCompare(b.year)
  );

  // Uzmi samo zadnja tri mjeseca
  return sortedMonths.slice(-3);
}


function StackedBarRow({
  row,
  y,
  maxTotal,
  chartWidth,
  overlapRadius,
  framePadding,
  strokeWidth = 4,
}) {
  const keys = ['Fixed', 'PopUp'];
  const total = keys.reduce((sum, k) => sum + row[k], 0);
  const barWidth = total > 0 ? (total / maxTotal) * chartWidth : 0;
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
        fill='none'
        stroke='#64748b'
        strokeWidth={2.5}
        strokeDasharray='8 6'
      />
      {['Fixed', 'PopUp']
        .map((k, idx) => {
          const { x, w } = segmentPositions[idx];
          return (
            <rect
              key={k}
              x={x}
              y={y}
              width={w + overlapRadius}
              height={barHeight}
              rx={overlapRadius}
              fill={colors[idx]}
              stroke='#fff'
              strokeWidth={strokeWidth}
            />
          );
        })
        .reverse()}
    </g>
  );
}

export default function AdStackedBarChart() {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const adsResponse = await apiGetAllAdsAsync();
      const ads = adsResponse.data;
      const grouped = groupByMonthAndType(ads);
      setData(grouped);
    };
    fetchData();
  }, []);

  const keys = ['Fixed', 'PopUp'];
  const totals = data.map((row) => keys.reduce((sum, k) => sum + row[k], 0));
  const maxTotal = Math.max(...totals, 1); // da ne bude 0

  const chartHeight = data.length * (barHeight + barGap);

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 3,
        bgcolor: '#fff',
        width: '570px',
        height: '480px',
        margin: '0 10px',
      }}
    >
      <Typography
        variant='h6'
        sx={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#333',
          marginBottom: '20px',
          textAlign: 'center',
        }}
      >
        {t('analytics.combinationChart')}
      </Typography>
      <svg
        width={chartWidth + yAxisWidth + framePadding * 2 + 20}
        height={chartHeight + 20}
      >
        {/* Godine na Y osi */}
        {data.map((row, i) => (
          <text
            key={row.year}
            x={yAxisWidth - 22}
            y={i * (barHeight + barGap) + barHeight / 2 + 16}
            textAnchor='end'
            fontSize='15'
            fontWeight='bold'
            fill='#222'
            alignmentBaseline='middle'
            dominantBaseline='middle'
          >
            {format(parseISO(row.year + '-01'), 'MMM yyyy')}
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
            strokeWidth={1}
          />
        ))}
      </svg>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}
      >
        {labels.map((label, idx) => (
          <Box
            key={label}
            sx={{ display: 'flex', alignItems: 'center', mr: 3, mb: 1 }}
          >
            <Box
              sx={{
                width: 20,
                height: 20,
                bgcolor: colors[idx],
                borderRadius: '70%',
                mr: 1,
              }}
            />
            <Typography variant='caption'>{t(`analytics.${label.toLowerCase()}`)}</Typography>
          </Box>
        ))}
      </Box>
    </Card>
  );
}
