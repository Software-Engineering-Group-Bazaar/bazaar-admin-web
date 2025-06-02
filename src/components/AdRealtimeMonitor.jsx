// AdRealtimeMonitor.jsx
import React from 'react';
import { useAdSignalR } from '../hooks/useAdSignalR'; // putanja do custom hooka
import { useTranslation } from 'react-i18next';
export default function AdRealtimeMonitor() {
  const {
    connectionStatus,
    latestAdUpdate,
    latestClickTime,
    latestViewTime,
    latestConversionTime,
    adUpdatesHistory,
  } = useAdSignalR();

  const { t } = useTranslation();

  return (
    <div>
      <div>Status: {connectionStatus}</div>
      <div>
        <b>{t('common.latestAdUpdate')}:</b>{' '}
        {latestAdUpdate ? JSON.stringify(latestAdUpdate) : 'None'}
      </div>
      <div>
        <b>{t('common.latestClick')}:</b> {latestClickTime}
      </div>
      <div>
        <b>{t('common.latestView')}:</b> {latestViewTime}
      </div>
      <div>
        <b>{t('common.latestConversion')}:</b> {latestConversionTime}
      </div>
      <div>
        <b>{t('common.history')}:</b>
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
