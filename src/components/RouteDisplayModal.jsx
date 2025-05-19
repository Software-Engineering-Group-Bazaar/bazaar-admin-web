// RouteDisplayModal.js
import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  GoogleMap,
  LoadScript,
  Polyline,
  Marker,
  InfoWindow,
} from '@react-google-maps/api';
import mapboxPolyline from '@mapbox/polyline';
//import { useTranslation } from 'react-i18next';

// Helper: Calculates geographical bounds for points (same as before)
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

/**
 * @typedef {object} Point
 * @property {number} latitude
 * @property {number} longitude
 * @property {string} [duration]
 * @property {string} [address]
 */

/**
 * RouteDisplayModal component.
 * Displays a pre-calculated route on a Google Map within a modal-like view.
 *
 * @param {object} props
 * @param {boolean} props.open - Whether the modal is visible.
 * @param {function} props.onClose - Callback function to close the modal.
 * @param {object} props.routeData - The Google Directions API route object (e.g., data.routes[0]).
 * @param {string} props.googleMapsApiKey - Your Google Maps API Key.
 * @returns {JSX.Element|null} The rendered modal component or null if not open.
 */
function RouteDisplayModal({ open, onClose, routeData, googleMapsApiKey }) {
  const [routePath, setRoutePath] = useState([]);
  const [waypoints, setWaypoints] = useState([]);
  const [mapCenter, setMapCenter] = useState({
    lat: 43.8665216,
    lng: 18.3926784,
  }); // Default
  const [zoom, setZoom] = useState(10); // Default
  const [activeMarker, setActiveMarker] = useState(null);
  // const { t } = useTranslation();
  const mapRef = useRef(null);
  const t = (s) => s;

  console.log(routeData);

  /**
   * Processes the provided route data to set map path and waypoints.
   */
  const processDisplayRouteData = useCallback(
    (currentRouteData) => {
      if (!currentRouteData) {
        setRoutePath([]);
        setWaypoints([]);
        return;
      }

      let overviewPolyline = currentRouteData.overview_polyline?.points;
      if (!overviewPolyline) {
        overviewPolyline = currentRouteData.routes[0].overview_polyline?.points;
        if (!overviewPolyline) {
          console.error('Overview polyline missing from provided route data.');
          setRoutePath([]);
          setWaypoints([]);
          return;
        }
      }

      const decodedPath = mapboxPolyline
        .decode(overviewPolyline)
        .map(([lat, lng]) => ({ lat, lng }));
      setRoutePath(decodedPath);

      const newWaypoints = [];
      let accumulatedTime = 0; // in seconds

      if (currentRouteData.legs[0]?.start_location) {
        newWaypoints.push({
          latitude: currentRouteData.legs[0].start_location.lat,
          longitude: currentRouteData.legs[0].start_location.lng,
          address: currentRouteData.legs[0].start_address,
          duration: t('Start Location'),
        });
      }

      currentRouteData.legs.forEach((leg) => {
        accumulatedTime += leg.duration.value;
        let durationText = '';
        if (accumulatedTime < 60) {
          durationText = `< 1 ${t('min')}`;
        } else if (accumulatedTime < 3600) {
          durationText = `${Math.round(accumulatedTime / 60)} ${t('min')}`;
        } else {
          const hours = Math.floor(accumulatedTime / 3600);
          const minutes = Math.round((accumulatedTime % 3600) / 60);
          durationText = `${hours}h ${minutes}${t('min')}`;
        }

        newWaypoints.push({
          latitude: leg.end_location.lat,
          longitude: leg.end_location.lng,
          address: leg.end_address,
          duration: durationText,
        });
      });

      setWaypoints(newWaypoints);

      // Defer fitting bounds until map is loaded
      if (
        mapRef.current &&
        (decodedPath.length > 0 || newWaypoints.length > 0)
      ) {
        const pointsToBound =
          newWaypoints.length > 0
            ? newWaypoints
            : decodedPath.map((p) => ({ latitude: p.lat, longitude: p.lng }));
        const bounds = getBoundingBox(pointsToBound);
        if (bounds) {
          mapRef.current.fitBounds(bounds);
          // Optional: Get center and zoom after fitting bounds if needed for state,
          // but usually fitBounds is enough.
          // const newCenter = bounds.getCenter();
          // setMapCenter({ lat: newCenter.lat(), lng: newCenter.lng() });
          // setZoom(mapRef.current.getZoom());
        }
      } else if (decodedPath.length > 0) {
        setMapCenter({ lat: decodedPath[0].lat, lng: decodedPath[0].lng });
        setZoom(12);
      }
    },
    [t]
  ); // mapRef is not a dependency for useCallback here

  useEffect(() => {
    if (open && routeData) {
      processDisplayRouteData(routeData);
    } else if (!open) {
      // Optionally clear when closed if desired, or let it persist
      // setRoutePath([]);
      // setWaypoints([]);
    }
  }, [open, routeData, processDisplayRouteData]);

  const handleMapLoad = useCallback(
    (map) => {
      mapRef.current = map;
      // If routeData is already present when map loads, fit bounds
      if (open && routeData && (routePath.length > 0 || waypoints.length > 0)) {
        const pointsToBound =
          waypoints.length > 0
            ? waypoints
            : routePath.map((p) => ({ latitude: p.lat, longitude: p.lng }));
        const bounds = getBoundingBox(pointsToBound);
        if (bounds && mapRef.current) {
          mapRef.current.fitBounds(bounds);
        }
      }
    },
    [open, routeData, routePath, waypoints]
  ); // Add dependencies that affect bounding

  const handleMarkerClick = (point) => {
    setActiveMarker(point);
    if (mapRef.current) {
      // Center on marker click
      mapRef.current.panTo({ lat: point.latitude, lng: point.longitude });
    }
  };

  if (!open) {
    return null;
  }

  if (!googleMapsApiKey) {
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <p>{t('Error: Google Maps API Key is missing.')}</p>
          <button onClick={onClose} style={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    );
  }
  if (!routeData) {
    return (
      <div style={styles.modalOverlay}>
        <div style={styles.modalContent}>
          <p>{t('No route data to display.')}</p>
          <button onClick={onClose} style={styles.closeButton}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalContent}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '10px',
          }}
        >
          <h3>{t('Route Details')}</h3>
          <button onClick={onClose} style={styles.closeButton}>
            ×
          </button>
        </div>
        {/* <LoadScript googleMapsApiKey={googleMapsApiKey} libraries={['places']}> */}
        <GoogleMap
          mapContainerStyle={styles.mapContainer}
          center={mapCenter}
          zoom={zoom}
          onLoad={handleMapLoad}
          options={{
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {routePath.length > 0 && (
            <Polyline
              path={routePath}
              options={{
                strokeColor: '#FF0000', // Different color for display
                strokeOpacity: 0.9,
                strokeWeight: 5,
              }}
            />
          )}
          {waypoints.map((point, index) => (
            <Marker
              key={`${point.latitude}-${point.longitude}-${index}-display`}
              position={{ lat: point.latitude, lng: point.longitude }}
              title={point.address}
              onClick={() => handleMarkerClick(point)}
              label={
                index === 0
                  ? 'S'
                  : index === waypoints.length - 1
                    ? 'E'
                    : `${index}`
              }
            />
          ))}
          {activeMarker && (
            <InfoWindow
              position={{
                lat: activeMarker.latitude,
                lng: activeMarker.longitude,
              }}
              onCloseClick={() => setActiveMarker(null)}
            >
              <div>
                <h4>{activeMarker.address}</h4>
                <p>
                  {activeMarker.duration?.includes(t('Start')) ||
                  activeMarker.duration?.includes(t('End'))
                    ? activeMarker.duration
                    : `${t('ETA')}: ${activeMarker.duration || t('Unknown ETA')}`}
                </p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
        {/* </LoadScript> */}
        <div style={styles.summary}>
          <p>
            <strong>{t('Total Distance')}:</strong>{' '}
            {routeData?.legs?.reduce(
              (acc, leg) => acc + leg.distance.value,
              0
            ) / 1000}{' '}
            km
          </p>
          <p>
            <strong>{t('Total Duration')}:</strong>{' '}
            {Math.round(
              routeData?.legs?.reduce(
                (acc, leg) => acc + leg.duration.value,
                0
              ) / 60
            )}{' '}
            {t('min')}
          </p>
        </div>
      </div>
      <button onClick={onClose} style={styles.closeButton}>
        ×
      </button>
    </div>
  );
}

RouteDisplayModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  routeData: PropTypes.object, // Can be null if no route is selected yet
  googleMapsApiKey: PropTypes.string.isRequired,
};

const styles = {
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px', // Max width for the modal
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  },
  mapContainer: {
    width: '100%',
    height: '400px', // Or any appropriate height for the modal map
    marginBottom: '10px',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '1.5rem',
    cursor: 'pointer',
    padding: '5px',
    lineHeight: '1',
  },
  summary: {
    marginTop: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #eee',
  },
};

export default RouteDisplayModal;
