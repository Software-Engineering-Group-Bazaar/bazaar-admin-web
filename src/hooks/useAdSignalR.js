import { useEffect, useRef, useState } from 'react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

const HUB_ENDPOINT_PATH = '/Hubs/AdvertisementHub';
const baseUrl = import.meta.env.VITE_API_BASE_URL; // ili tvoj base url
const HUB_URL = `${baseUrl}${HUB_ENDPOINT_PATH}`;

export function useAdSignalR() {
  const connectionRef = useRef(null);
  const [connectionStatus, setConnectionStatus] = useState('Disconnected');
  const [latestAdUpdate, setLatestAdUpdate] = useState(null);
  const [latestClickTime, setLatestClickTime] = useState(null);
  const [latestViewTime, setLatestViewTime] = useState(null);
  const [latestConversionTime, setLatestConversionTime] = useState(null);
  const [adUpdatesHistory, setAdUpdatesHistory] = useState([]);

  useEffect(() => {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      setConnectionStatus('Auth Token Missing');
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => jwtToken,
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    connectionRef.current = newConnection;
    setConnectionStatus('Connecting...');

    const startConnection = async () => {
      try {
        await newConnection.start();
        setConnectionStatus('Connected');
      } catch (err) {
        setConnectionStatus('Error');
      }
    };

    startConnection();

    // Handlers
    newConnection.on('ReceiveAdUpdate', (advertisement) => {
      setLatestAdUpdate(advertisement);
      setAdUpdatesHistory(prev => [
        { type: 'Ad Update', data: advertisement, time: new Date() },
        ...prev.slice(0, 9)
      ]);
    });

    newConnection.on('ReceiveClickTimestamp', (timestamp) => {
      setLatestClickTime(timestamp);
      setAdUpdatesHistory(prev => [
        { type: 'Click', data: timestamp, time: new Date() },
        ...prev.slice(0, 9)
      ]);
    });

    newConnection.on('ReceiveViewTimestamp', (timestamp) => {
      setLatestViewTime(timestamp);
      setAdUpdatesHistory(prev => [
        { type: 'View', data: timestamp, time: new Date() },
        ...prev.slice(0, 9)
      ]);
    });

    newConnection.on('ReceiveConversionTimestamp', (timestamp) => {
      setLatestConversionTime(timestamp);
      setAdUpdatesHistory(prev => [
        { type: 'Conversion', data: timestamp, time: new Date() },
        ...prev.slice(0, 9)
      ]);
    });

    newConnection.onclose(() => setConnectionStatus('Disconnected'));
    newConnection.onreconnecting(() => setConnectionStatus('Reconnecting...'));
    newConnection.onreconnected(() => setConnectionStatus('Connected'));

    return () => {
      if (connectionRef.current && connectionRef.current.state === 'Connected') {
        connectionRef.current.stop();
      }
    };
  }, []);

  return {
    connectionStatus,
    latestAdUpdate,
    latestClickTime,
    latestViewTime,
    latestConversionTime,
    adUpdatesHistory,
  };
}
