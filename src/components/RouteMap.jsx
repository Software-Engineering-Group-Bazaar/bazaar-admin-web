// src/components/RouteMap.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Polyline,
  MarkerF,
} from '@react-google-maps/api';
import polylineUtil from '@mapbox/polyline';
import { CircularProgress, Alert, Box, Typography } from '@mui/material';

const MAP_LIBRARIES = ['geometry', 'places'];

const RouteMap = ({ backendResponse }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
    libraries: MAP_LIBRARIES,
    // id: 'google-map-script', // Optional: useful for multiple maps or specific loading strategies
  });

  const [map, setMap] = useState(null);
  const [decodedPath, setDecodedPath] = useState([]);
  const [startLocation, setStartLocation] = useState(null);
  const [endLocation, setEndLocation] = useState(null);
  const [mapBoundsObject, setMapBoundsObject] = useState(null); // Stores the actual LatLngBounds object

  // Effect to process backendResponse and create map elements
  useEffect(() => {
    // Only proceed if the API is loaded and we have valid backend data
    if (!isLoaded || !backendResponse?.routeData?.data?.routes?.[0]) {
      // Clear out data if not ready or no valid response
      setDecodedPath([]);
      setStartLocation(null);
      setEndLocation(null);
      setMapBoundsObject(null);
      return;
    }

    const route = backendResponse.routeData.data.routes[0];

    // Decode polyline
    if (route.overview_polyline?.points) {
      try {
        const decoded = polylineUtil
          .decode(route.overview_polyline.points)
          .map((point) => ({
            lat: point[0],
            lng: point[1],
          }));
        setDecodedPath(decoded);
      } catch (e) {
        console.error('Error decoding polyline:', e);
        setDecodedPath([]);
      }
    } else {
      setDecodedPath([]);
    }

    // Set start/end locations for markers
    if (route.legs?.[0]) {
      setStartLocation(route.legs[0].start_location);
      setEndLocation(route.legs[0].end_location);
    } else {
      setStartLocation(null);
      setEndLocation(null);
    }

    // Create LatLngBounds object (THIS IS LIKELY WHERE THE ERROR WAS)
    // Now this block is guarded by `isLoaded`
    if (route.bounds && window.google && window.google.maps) {
      // Double check window.google just in case, though isLoaded should cover it
      try {
        const newBounds = new window.google.maps.LatLngBounds(
          new window.google.maps.LatLng(
            route.bounds.southwest.lat,
            route.bounds.southwest.lng
          ),
          new window.google.maps.LatLng(
            route.bounds.northeast.lat,
            route.bounds.northeast.lng
          )
        );
        setMapBoundsObject(newBounds);
      } catch (e) {
        console.error(
          'Error creating LatLngBounds from route.bounds:',
          e,
          route.bounds
        );
        setMapBoundsObject(null); // Fallback if creation fails
      }
    } else {
      setMapBoundsObject(null); // If no route.bounds, clear any existing mapBoundsObject
    }
  }, [backendResponse, isLoaded]); // Key dependencies: backendResponse and isLoaded

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  // Effect to fit bounds once map is loaded and bounds/path are ready
  useEffect(() => {
    if (!map || !isLoaded) return; // Ensure map and API are ready

    if (mapBoundsObject && !mapBoundsObject.isEmpty()) {
      map.fitBounds(mapBoundsObject);
    } else if (decodedPath.length > 0) {
      // Fallback to fitting bounds from the decoded path
      console.log(
        'Fitting bounds to decoded path as mapBoundsObject not available or empty.'
      );
      try {
        const pathBounds = new window.google.maps.LatLngBounds();
        decodedPath.forEach((point) => {
          if (
            point &&
            typeof point.lat === 'number' &&
            typeof point.lng === 'number'
          ) {
            pathBounds.extend(
              new window.google.maps.LatLng(point.lat, point.lng)
            );
          } else {
            console.warn('Invalid point in decodedPath:', point);
          }
        });
        if (!pathBounds.isEmpty()) {
          map.fitBounds(pathBounds);
        } else {
          console.warn('Path bounds are empty, cannot fit.');
        }
      } catch (e) {
        console.error(
          'Error creating LatLngBounds from decodedPath:',
          e,
          decodedPath
        );
      }
    }
  }, [map, mapBoundsObject, decodedPath, isLoaded]); // Key dependencies

  const mapContainerStyle = {
    width: '100%',
    height: '100%', // Crucial: map needs explicit height from parent
  };

  const defaultCenter = useMemo(() => ({ lat: 43.8563, lng: 18.4131 }), []);

  if (loadError) {
    console.error('Google Maps API load error:', loadError);
    return (
      <Alert severity='error'>
        Error loading Google Maps: {loadError.message}
      </Alert>
    );
  }

  if (!apiKey) {
    return (
      <Alert severity='error'>Error: Google Maps API Key is missing.</Alert>
    );
  }

  // Show loading spinner while API is loading
  if (!isLoaded) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading Map...</Typography>
      </Box>
    );
  }

  // API is loaded, now render the map
  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={startLocation || defaultCenter}
      zoom={10} // Initial zoom, fitBounds will adjust
      onLoad={onMapLoad}
      onUnmount={() => setMap(null)} // Good practice for cleanup
      options={
        {
          // streetViewControl: false,
          // mapTypeControl: false,
          // You can add more options here
        }
      }
    >
      {decodedPath.length > 0 && (
        <Polyline
          path={decodedPath}
          options={{
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 5,
          }}
        />
      )}
      {startLocation && (
        <MarkerF position={startLocation} label='A' title='Start' />
      )}
      {endLocation && <MarkerF position={endLocation} label='B' title='End' />}
    </GoogleMap>
  );
};

export default RouteMap;
