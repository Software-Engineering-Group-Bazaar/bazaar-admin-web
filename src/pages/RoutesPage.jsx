import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import RouteCard from '@components/RouteCard';
import UserManagementPagination from '@components/UserManagementPagination';
import RoutesHeader from '@sections/RoutesHeader';
import RouteDetailsModal from '@components/RouteDetailsModal';
import RouteDetailsModal2 from '../components/RouteDisplayModal';
import RouteDisplayModal from '../components/RouteDisplayModal';
import { sha256 } from 'js-sha256';
import CreateRouteModal from '@components/CreateRouteModal';
import {
  apiCreateRouteAsync,
  apiGetRoutesAsync,
  apiDeleteRouteAsync,
} from '../api/api';
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const getBoundingBox = (points) => {
  if (!points || points.length === 0) return null;

  // THIS LINE NEEDS `window.google` to be defined
  const bounds = new google.maps.LatLngBounds();
  points.forEach((point) => {
    // THIS LINE ALSO NEEDS `window.google`
    bounds.extend(new google.maps.LatLng(point.latitude, point.longitude));
  });
  return bounds;
};

const generateMockRoutes = (page, perPage) => {
  const totalRoutes = 42;
  const routes = Array.from({ length: totalRoutes }, (_, i) => {
    const numOrders = Math.floor(Math.random() * 6) + 1;
    const orderIds = Array.from({ length: numOrders }, () =>
      Math.floor(1000 + Math.random() * 9000)
    );

    const mockData = {
      routes: [
        {
          legs: [
            {
              start_location: { lat: 43.85 + 0.01 * i, lng: 18.38 + 0.01 * i },
              end_location: { lat: 43.86 + 0.01 * i, lng: 18.4 + 0.01 * i },
            },
          ],
        },
      ],
    };

    const hash = sha256(JSON.stringify(mockData));

    return {
      id: i + 1,
      name: `Route ${i + 1}`,
      orderIds,
      ownerId: 1,
      routeData: {
        data: mockData,
        hash,
        routeId: `route-${i + 1}`,
      },
    };
  });

  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    data: routes.slice(start, end),
    total: totalRoutes,
  };
};

const RoutesPage = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const fetchRoutes = async () => {
      //const response = generateMockRoutes(currentPage, perPage);
      const response = await apiGetRoutesAsync();
      console.log(response);
      setRoutes(
        response.slice(currentPage * perPage, currentPage * perPage + perPage)
      );
    };
    fetchRoutes();
  }, [currentPage]);

  const totalPages = Math.ceil(42 / perPage); // hardkodirano za mock

  const handleCreate = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateRoute = async (orders) => {
    try {
      
      const rez = await apiCreateRouteAsync(orders);
      const rute = await apiGetRoutesAsync();
      setRoutes(rute);
      console.log('Uradjeno');
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error('API error:', error);
    }
  };
  const handleDelete = async (id) => {
    try {
      const rez = await apiDeleteRouteAsync(id);
      const newroutes = await apiGetRoutesAsync();
      setRoutes(newroutes);
    } catch (err) {
      console.log('Greska pri brisanju', err);
    }
  };

  const handleViewDetails = (id) => {
    const selected = routes.find((r) => r.id === id);
    console.log('Selected route:', selected);
    setSelectedRoute(selected);
    setIsModalOpen(true);
  };

  return (
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'flex-start',
          backgroundColor: '#f7f8fa',
          minHeight: '100vh',
        }}
      >
        <Box
          sx={{
            width: 'calc(100%)',
            maxWidth: '1600px',
            marginLeft: '260px',
            pt: 2,
            px: 2,
          }}
        >
          <RoutesHeader onAddRoute={handleCreate} />

          <Grid
            container
            spacing={3}
            sx={{
              mt: 2,
              mb: 5,
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            {routes.map((route) => (
              <Grid item key={route.id} xs={12} sm={6} md={4}>
                <RouteCard
                  route={route}
                  onDelete={handleDelete}
                  onViewDetails={handleViewDetails}
                />
              </Grid>
            ))}
          </Grid>

          <UserManagementPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />

          <RouteDisplayModal
            open={isModalOpen}
            routeData={isModalOpen ? selectedRoute.routeData.data : null}
            onClose={() => setIsModalOpen(false)}
            googleMapsApiKey={API_KEY}
          />
        </Box>

        <CreateRouteModal
          open={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreateRoute={handleCreateRoute}
        />
      </Box>
  );
};

export default RoutesPage;
