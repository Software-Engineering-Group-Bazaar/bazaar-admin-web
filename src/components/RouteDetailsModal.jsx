import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  Box,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  CircularProgress,
} from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { sha256 } from 'js-sha256';

const RouteDetailsModal = ({ open, onClose, route }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stopMarkers, setStopMarkers] = useState([]);

  // Initialize map and display route
  useEffect(() => {
    if (!open || !route?.routeData?.data) return;

    const initializeMap = () => {
      try {
        // Verify data integrity
        const calculatedHash = sha256(JSON.stringify(route.routeData.data));
        if (calculatedHash !== route.routeData.hash) {
          throw new Error('Route data integrity check failed');
        }

        const mapOptions = {
          center: { lat: 43.8563, lng: 18.4131 }, // Default to Sarajevo
          zoom: 12,
        };

        const newMap = new window.google.maps.Map(mapRef.current, mapOptions);
        const newDirectionsRenderer = new window.google.maps.DirectionsRenderer(
          {
            map: newMap,
            suppressMarkers: true,
            polylineOptions: {
              strokeColor: '#4a0404',
              strokeOpacity: 1.0,
              strokeWeight: 4,
            },
          }
        );

        // Display the route from saved data
        newDirectionsRenderer.setDirections(route.routeData.data);

        // Add custom markers for each stop
        const legs = route.routeData.data.routes[0].legs;
        const markers = [];

        legs.forEach((leg, index) => {
          // Start location marker
          markers.push(
            new window.google.maps.Marker({
              position: leg.start_location,
              map: newMap,
              icon: {
                url: `https://maps.google.com/mapfiles/ms/icons/red-dot.png`,
                scaledSize: new window.google.maps.Size(32, 32),
              },
              label: {
                text: `${index + 1}`,
                color: 'white',
                fontWeight: 'bold',
              },
            })
          );

          // End location marker (only for last leg)
          if (index === legs.length - 1) {
            markers.push(
              new window.google.maps.Marker({
                position: leg.end_location,
                map: newMap,
                icon: {
                  url: `https://maps.google.com/mapfiles/ms/icons/green-dot.png`,
                  scaledSize: new window.google.maps.Size(32, 32),
                },
                label: {
                  text: `${index + 2}`,
                  color: 'white',
                  fontWeight: 'bold',
                },
              })
            );
          }
        });

        setMap(newMap);
        setDirectionsRenderer(newDirectionsRenderer);
        setStopMarkers(markers);
        setLoading(false);
      } catch (err) {
        console.error('Error initializing map:', err);
        setError(err.message || 'Failed to load route map');
        setLoading(false);
      }
    };

    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&libraries=places,directions`;
      script.async = true;
      script.defer = true;
      script.onload = initializeMap;
      script.onerror = () => {
        setError('Failed to load Google Maps');
        setLoading(false);
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }

    return () => {
      // Cleanup
      if (directionsRenderer) {
        directionsRenderer.setMap(null);
      }
      stopMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [open, route]);

  if (!route) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '80%',
          maxWidth: 900,
          height: '80%',
          bgcolor: 'background.paper',
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LocalShippingIcon color='primary' sx={{ mr: 1 }} />
          <Typography variant='h5' fontWeight='bold'>
            Route Details #{route.id}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Chip
            label={`${route.orderIds.length} orders`}
            color='primary'
            sx={{ mr: 1 }}
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Content */}
        <Box sx={{ display: 'flex', flexGrow: 1, gap: 3 }}>
          {/* Map Container */}
          <Box
            sx={{
              flex: 2,
              position: 'relative',
              borderRadius: 1,
              overflow: 'hidden',
              border: '1px solid #e0e0e0',
            }}
          >
            {loading && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.7)',
                  zIndex: 1,
                }}
              >
                <CircularProgress />
              </Box>
            )}
            {error && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  bgcolor: 'rgba(255,255,255,0.7)',
                  zIndex: 1,
                  p: 2,
                }}
              >
                <Typography color='error' textAlign='center'>
                  {error}
                </Typography>
              </Box>
            )}
            <div
              ref={mapRef}
              style={{
                width: '100%',
                height: '100%',
                minHeight: '400px',
              }}
            />
          </Box>

          {/* Order List */}
          <Box sx={{ flex: 1, overflowY: 'auto' }}>
            <Typography variant='h6' sx={{ mb: 2 }}>
              Orders in this route
            </Typography>

            <List dense>
              {route.orderIds.map((orderId, index) => (
                <ListItem
                  key={orderId}
                  sx={{ borderBottom: '1px solid #f0f0f0' }}
                >
                  <ListItemText
                    primary={`Order #${orderId}`}
                    secondary={`Stop ${index + 1}`}
                  />
                  <Chip
                    label={`#${index + 1}`}
                    size='small'
                    color='primary'
                    sx={{ ml: 1 }}
                  />
                </ListItem>
              ))}
            </List>

            <Box sx={{ mt: 3 }}>
              <Typography variant='subtitle2' sx={{ mb: 1 }}>
                Route Information
              </Typography>
              <Typography variant='body2'>
                <strong>Route ID:</strong> {route.routeData.routeId}
              </Typography>
              <Typography variant='body2' sx={{ mt: 1 }}>
                <strong>Created by:</strong> User #{route.ownerId}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            onClick={onClose}
            variant='contained'
            sx={{
              backgroundColor: '#4a0404',
              '&:hover': { backgroundColor: '#3a0202' },
            }}
          >
            Close
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RouteDetailsModal;
