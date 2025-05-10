// AdRealtimeMonitor.jsx
import React from 'react';
import { useAdSignalR } from '../hooks/useAdSignalR'; // putanja do custom hooka

export default function AdRealtimeMonitor() {
  const {
    connectionStatus,
    latestAdUpdate,
    latestClickTime,
    latestViewTime,
    latestConversionTime,
    adUpdatesHistory,
  } = useAdSignalR();

  return (
    <div>
      <div>Status: {connectionStatus}</div>
      <div>
        <b>Latest Ad Update:</b>{' '}
        {latestAdUpdate ? JSON.stringify(latestAdUpdate) : 'None'}
      </div>
      <div>
        <b>Latest Click:</b> {latestClickTime}
      </div>
      <div>
        <b>Latest View:</b> {latestViewTime}
      </div>
      <div>
        <b>Latest Conversion:</b> {latestConversionTime}
      </div>
      <div>
        <b>History:</b>
        <ul>
          {adUpdatesHistory.map((item, idx) => (
            <li key={idx}>
              [{item.type}] {item.data} ({item.time.toLocaleString()})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
