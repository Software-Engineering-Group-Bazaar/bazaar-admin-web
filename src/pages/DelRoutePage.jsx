// src/pages/RoutesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import RouteMap from '../components/RouteMap'; // Assuming RouteMap is in src/components/
import RoutesHeader from '@sections/RoutesHeader';
import CreateRouteModal from "../components/CreateRouteModal";
// MUI Imports
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  CircularProgress,
  Paper,
  Alert,
  Divider,
  Container,
} from '@mui/material';
import MapIcon from '@mui/icons-material/Map'; // Example icon
import DirectionsIcon from '@mui/icons-material/Directions';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { apiGetRoutesAsync, apiCreateRouteAsync } from '../api/api';

// You might want to wrap your App in a ThemeProvider in App.jsx or main.jsx
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// const theme = createTheme(); -> Then wrap <ThemeProvider theme={theme}> around your app

function RoutesPage2() {
  const [routeList, setRouteList] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [selectedRouteData, setSelectedRouteData] = useState(null);
  const [isLoadingList, setIsLoadingList] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchRouteList = async () => {
      setIsLoadingList(true);
      setError(null);
      try {
        //const response = await fetch('/api/routes'); // EXAMPLE: /api/routes
        const response = await apiGetRoutesAsync();
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        console.log(response.data);
        setRouteList(response.data);
      } catch (e) {
        console.error('Failed to fetch route list:', e);
        setError('Failed to load route list. ' + e.message);
        setRouteList([]);
      } finally {
        setIsLoadingList(false);
      }
    };
    fetchRouteList();
  }, []);

  useEffect(() => {
    if (!selectedRouteId) {
      setSelectedRouteData(null);
      return;
    }
    const fetchRouteDetails = async () => {
      setIsLoadingDetails(true);
      setSelectedRouteData(null);
      setError(null);
      try {
        // const response = await fetch(`/api/routes/${selectedRouteId}`); // EXAMPLE: /api/routes/12
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
        const data = routeList.find((r) => r.id == selectedRouteId);
        console.log(data);
        setSelectedRouteData(data);
      } catch (e) {
        console.error(
          `Failed to fetch details for route ${selectedRouteId}:`,
          e
        );
        setError(
          `Failed to load details for route ${selectedRouteId}. ` + e.message
        );
        setSelectedRouteData(null);
      } finally {
        setIsLoadingDetails(false);
      }
    };
    fetchRouteDetails();
  }, [selectedRouteId]);

  const handleRouteClick = useCallback((routeId) => {
    setSelectedRouteId(routeId);
  }, []);

    const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

    const handleCreateRoute = async (orders) => {
      try {
        
        const rez = await apiCreateRouteAsync(orders);
        const rute = await apiGetRoutesAsync();
        setRouteList(rute);
        console.log('Uradjeno');
        setIsCreateModalOpen(false);
      } catch (error) {
        console.error('API error:', error);
      }
    };

  return (
    <Box
    //   sx={{
    //     width: '100%',
    //     minHeight: '100vh',
    //     display: 'flex',
    //     justifyContent: 'flex-start',
    //     backgroundColor: '#f7f8fa',
    //     paddingTop: '50px',
    //   }}
    >
      <Container
      //maxWidth='xl' sx={{ mt: 2, mb: 2 }}
      >
        {' '}
        {/* Overall page container */}
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <RoutesHeader onAddRoute={handleCreate} /> {/* Adjust height as needed */}
          {/* Routes List Panel */}
          <Grid
            item
            // xs={12}
            // md={4}
            // lg={3}
            // container
            // spacing={3}
            // sx={{
            //   mt: 2,
            //   mb: 5,
            //   display: 'flex',
            //   justifyContent: 'center',
            // }}
          >
            <Paper
            //   elevation={3}
            //   sx={{ p: 2, height: '100%', overflowY: 'auto' }}
            >
              <Box
              //sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
              >
                <ListAltIcon
                //sx={{ mr: 1 }}
                />
                <Typography variant='h6' component='h2'>
                  Available Routes
                </Typography>
              </Box>
              {isLoadingList && (
                <Box
                //sx={{ display: 'flex', justifyContent: 'center', my: 2 }}
                >
                  <CircularProgress />
                </Box>
              )}
              {error && !isLoadingList && (
                <Alert severity='error' sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {!isLoadingList && routeList.length === 0 && !error && (
                <Typography variant='body2' color='text.secondary'>
                  No routes available.
                </Typography>
              )}
              {!isLoadingList && routeList.length > 0 && (
                <List>
                  {routeList.map((route) => (
                    <ListItemButton
                      key={route.id}
                      selected={selectedRouteId === route.id}
                      onClick={() => handleRouteClick(route.id)}
                    >
                      <ListItemText primary={`Route ID: ${route.id}`} />
                    </ListItemButton>
                  ))}
                </List>
              )}
            </Paper>
          </Grid>
          {/* Route Map and Details Panel */}
          <Grid
          //item xs={12} md={8} lg={9}
          >
            <Paper
              elevation={3}
              sx={{
                p: 2,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              {isLoadingDetails && (
                <Box
                //   sx={{
                //     display: 'flex',
                //     flexDirection: 'column',
                //     alignItems: 'center',
                //     justifyContent: 'center',
                //     flexGrow: 1,
                //   }}
                >
                  <CircularProgress />
                  <Typography
                  //sx={{ mt: 1 }}
                  >
                    Loading map for Route ID: {selectedRouteId}...
                  </Typography>
                </Box>
              )}
              {error && !isLoadingDetails && selectedRouteId && (
                <Alert severity='error'>{error}</Alert>
              )}

              {!selectedRouteId && !isLoadingDetails && !error && (
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    height: '100%',
                  }}
                >
                  <MapIcon color='action' sx={{ fontSize: 60, mb: 2 }} />
                  <Typography variant='h6' color='text.secondary'>
                    Select a route from the list to view it on the map.
                  </Typography>
                </Box>
              )}

              {selectedRouteData && !isLoadingDetails && !error && (
                <>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <MapIcon sx={{ mr: 1 }} />
                    <Typography variant='h6' component='h3'>
                      Map for Route ID: {selectedRouteData.id}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      flexGrow: 1,
                      minHeight: '300px',
                      mb: 2,
                      height: '100%',
                    }}
                  >
                    {' '}
                    {/* Ensure map has space */}
                    <RouteMap backendResponse={selectedRouteData} />
                  </Box>

                  {selectedRouteData.routeData?.data?.routes?.[0]?.legs?.[0]
                    ?.steps && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Box
                        sx={{ display: 'flex', alignItems: 'center', mb: 1 }}
                      >
                        <DirectionsIcon sx={{ mr: 1 }} />
                        <Typography variant='subtitle1' component='h4'>
                          Directions:
                        </Typography>
                      </Box>
                      <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
                        {' '}
                        {/* Scrollable directions */}
                        <List dense>
                          {selectedRouteData.routeData.data.routes[0].legs[0].steps.map(
                            (step, index) => (
                              <ListItem key={index} disablePadding>
                                <ListItemText
                                  primaryTypographyProps={{ variant: 'body2' }}
                                  primary={
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html: `${index + 1}. ${step.html_instructions}`,
                                      }}
                                    />
                                  }
                                />
                              </ListItem>
                            )
                          )}
                        </List>
                      </Box>
                    </>
                  )}
                </>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
              <CreateRouteModal
                open={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateRoute={handleCreateRoute}
              />
    </Box>
  );
}

export default RoutesPage2;
