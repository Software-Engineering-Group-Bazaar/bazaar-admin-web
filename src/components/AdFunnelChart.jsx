import React, { useEffect, useState, useRef } from 'react';
import { Card, Typography, Box, Grid } from '@mui/material';
import FunnelCurved from './FunnelCurved';
import {
  VisibilityOutlined,
  MouseOutlined,
  CheckCircleOutline,
} from '@mui/icons-material';
import { apiGetAllAdsAsync } from '../api/api.js';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
const HUB_ENDPOINT_PATH = '/Hubs/AdvertisementHub';
const HUB_URL = `${baseUrl}${HUB_ENDPOINT_PATH}`;

const funnelColors = ['#60a5fa', '#38bdf8', '#0ea5e9'];
const funnelIcons = [
  <VisibilityOutlined fontSize='large' />,
  <MouseOutlined fontSize='large' />,
  <CheckCircleOutline fontSize='large' />,
];

export default function AdFunnelChart() {
  const [funnelSteps, setFunnelSteps] = useState([
    {
      label: 'Viewed',
      value: 0,
      percent: 100,
      color: funnelColors[0],
      icon: funnelIcons[0],
    },
    {
      label: 'Clicked',
      value: 0,
      percent: 0,
      color: funnelColors[1],
      icon: funnelIcons[1],
    },
    {
      label: 'Converted',
      value: 0,
      percent: 0,
      color: funnelColors[2],
      icon: funnelIcons[2],
    },
  ]);

  const [ads, setAds] = useState([]);
  const connectionRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      const adsResponse = await apiGetAllAdsAsync();
      const adsData = adsResponse.data || [];
      setAds(adsData);
      updateFunnelData(adsData);
    };

    fetchData();

    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) return;

    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => jwtToken,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = newConnection;

    const startConnection = async () => {
      try {
        await newConnection.start();
        console.log('SignalR Connected to AdvertisementHub!');
      } catch (err) {
        console.error('SignalR Connection Error:', err);
      }
    };

    startConnection();

    newConnection.on('ReceiveAdUpdate', (updatedAd) => {
      setAds((prevAds) => {
        const existingAdIndex = prevAds.findIndex(
          (ad) => ad.id === updatedAd.id
        );
        const updatedAds = [...prevAds];

        if (existingAdIndex !== -1) {
          updatedAds[existingAdIndex] = updatedAd;
        } else {
          updatedAds.push(updatedAd);
        }

        updateFunnelData(updatedAds);
        return updatedAds;
      });
    });

    return () => {
      if (
        connectionRef.current &&
        connectionRef.current.state === 'Connected'
      ) {
        connectionRef.current
          .stop()
          .catch((err) =>
            console.error('Error stopping SignalR connection:', err)
          );
      }
    };
  }, []);

  const updateFunnelData = (adsData) => {
    const totalViews = adsData.reduce((sum, ad) => sum + (ad.views || 0), 0);
    const totalClicks = adsData.reduce((sum, ad) => sum + (ad.clicks || 0), 0);
    const totalConversions = adsData.reduce(
      (sum, ad) => sum + (ad.conversions || 0),
      0
    );

    setFunnelSteps([
      {
        label: 'Viewed',
        value: totalViews,
        percent: 100,
        color: funnelColors[0],
        icon: funnelIcons[0],
      },
      {
        label: 'Clicked',
        value: totalClicks,
        percent:
          totalViews > 0 ? Math.round((totalClicks / totalViews) * 100) : 0,
        color: funnelColors[1],
        icon: funnelIcons[1],
      },
      {
        label: 'Converted',
        value: totalConversions,
        percent:
          totalClicks > 0
            ? Math.round((totalConversions / totalClicks) * 100)
            : 0,
        color: funnelColors[2],
        icon: funnelIcons[2],
      },
    ]);
  };

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 4,
        boxShadow: 3,
        width: 1170,
        background: '#fff',
      }}
    >
      <Typography variant='h5' fontWeight={700} mb={3} textAlign='center'>
        Sales Funnel Analysis
      </Typography>

      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          py: 2,
        }}
      >
        <FunnelCurved steps={funnelSteps} width={600} height={160} />
      </Box>

      <Grid container spacing={2} sx={{ px: 2, mt: 2 }}>
        {funnelSteps.map((step) => (
          <Grid item xs={12} sm={4} key={step.label} sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                borderRadius: 8,
                p: 2,
                backgroundColor: '#f8f9fa',
                textAlign: 'center',
                boxShadow: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                minHeight: 140,
              }}
            >
              <Box sx={{ mb: 1, color: step.color, fontSize: 36 }}>
                {step.icon}
              </Box>
              <Typography variant='h4' fontWeight={700} color='#3a0c02'>
                {step.value.toLocaleString()}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {step.label}
              </Typography>
              <Typography variant='caption' color='primary' fontWeight={600}>
                {step.percent}% from previous
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Card>
  );
}
