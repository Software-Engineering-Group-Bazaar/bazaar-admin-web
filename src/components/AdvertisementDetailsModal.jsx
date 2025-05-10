import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import CountUp from 'react-countup';
import { connectToSignalR } from '@api/HubService';
import {
  Eye,
  Hand,
  CheckCircle,
  BarChart2,
  MousePointerClick,
  Percent,
  Activity,
} from 'lucide-react';
import AdContentCard from '@components/AdContentCard';
import HorizontalScroll from './HorizontalScroll';
import { apiGetAllStoresAsync, apiGetStoreProductsAsync } from '@api/api';

const AdvertisementDetailsModal = ({ open, onClose, ad, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState({
    adData: ad?.adData || [],
    startTime: ad?.startTime || '',
    endTime: ad?.endTime || '',
    isActive: ad?.isActive || false,
  });

  const [adStats, setAdStats] = useState(ad);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        const fetchedStores = await apiGetAllStoresAsync();
        setStores(fetchedStores);

        const allProducts = [];
        for (const store of fetchedStores) {
          const { data } = await apiGetStoreProductsAsync(store.id);
          allProducts.push(...data);
        }
        setProducts(allProducts);
      };

      fetchData();

      connectToSignalR((updatedStats) => {
        if (updatedStats.id === ad.id) {
          setAdStats(updatedStats);
        }
      });
    }
  }, [open, ad.id]);

  const getStoreName = (storeId) =>
    stores.find((s) => s.id === storeId)?.name || `Unknown store`;

  const getProductName = (productId) =>
    products.find((p) => p.id === productId)?.name || `Unknown product`;

  const handleSave = () => {
    onSave?.(ad.id, editedData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedData({
      adData: ad.adData,
      startTime: ad.startTime,
      endTime: ad.endTime,
      isActive: ad.isActive,
    });
    setIsEditing(false);
  };

  const updateAdData = (index, field, value) => {
    const newAdData = [...editedData.adData];
    newAdData[index] = { ...newAdData[index], [field]: value };
    setEditedData({ ...editedData, adData: newAdData });
  };

  if (!adStats) return null;

  const cardData = [
    {
      icon: <BarChart2 size={24} color="#0284c7" />,
      label: 'Views',
      value: adStats.views.toLocaleString(),
      bg: '#e0f2fe',
    },
    {
      icon: <MousePointerClick size={24} color="#0d9488" />,
      label: 'Clicks',
      value: adStats.clicks.toLocaleString(),
      bg: '#ccfbf1',
    },
    {
      icon: <Percent size={24} color="#f59e0b" />,
      label: 'CTR',
      value:
        adStats.views > 0
          ? ((adStats.clicks / adStats.views) * 100).toFixed(1) + '%'
          : '0%',
      bg: '#fef9c3',
    },
    {
      icon: <Activity size={24} color={adStats.isActive ? '#22c55e' : '#ef4444'} />,
      label: 'Status',
      value: adStats.isActive ? 'Active' : 'Inactive',
      bg: adStats.isActive ? '#dcfce7' : '#fee2e2',
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        <Box sx={styles.headerBox}>
          <Box sx={styles.headerAccent} />
          <Box sx={styles.headerContent}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#FF8000' }}>
              Advertisement Overview
            </Typography>
            <Typography variant="h4" fontWeight={800}>
              Advertisement {adStats.id}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Seller ID: {adStats.sellerId}
            </Typography>
          </Box>
          <Box sx={styles.headerAccent} />
        </Box>

        {/* KPI Cards */}
        <Box sx={styles.cardGrid}>
          {cardData.map((item, i) => (
            <Box key={i} sx={{ ...styles.card, backgroundColor: item.bg }}>
              {item.icon}
              <Typography variant="body2" color="text.secondary">
                {item.label}
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Time Info */}
        <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
          <Box sx={styles.timeCard}>
            <Typography variant="subtitle2" sx={styles.timeTitle}>
              <svg width="16" height="16" fill="#FF8000" style={{ marginRight: 6 }}>
                <path d="M3 0a1 1 0 011 1v1h8V1a1 1 0 112 0v1h1a1 1 0 011 1v2H0V3a1 1 0 011-1h1V1a1 1 0 011-1zm11 6H2v7a1 1 0 001 1h10a1 1 0 001-1V6zM6 8h2v2H6V8z" />
              </svg>
              Start Time
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {new Date(adStats.startTime).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(adStats.startTime).toLocaleTimeString()}
            </Typography>
          </Box>

          <Box sx={styles.timeCard}>
            <Typography variant="subtitle2" sx={styles.timeTitle}>
              <svg width="16" height="16" fill="#FF8000" style={{ marginRight: 6 }}>
                <path d="M3 0a1 1 0 011 1v1h8V1a1 1 0 112 0v1h1a1 1 0 011 1v2H0V3a1 1 0 011-1h1V1a1 1 0 011-1zm11 6H2v7a1 1 0 001 1h10a1 1 0 001-1V6zM6 8h2v2H6V8z" />
              </svg>
              End Time
            </Typography>
            <Typography variant="h6" fontWeight={500}>
              {new Date(adStats.endTime).toLocaleDateString()}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(adStats.endTime).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>

        {/* Pricing Info */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 5,
            mb: -2,
            background: '#f3f4f6',
            borderRadius: 2,
            p: 1.5,
            mt: 5,
          }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Hand size={25} color="#0d9488" /> Click Price:{' '}
            <b style={{ marginLeft: 5 }}>{adStats.clickPrice ?? '1000'}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Eye size={25} color="#0284c7" /> View Price:{' '}
            <b style={{ marginLeft: 2 }}>{adStats.viewPrice ?? '1000'}</b>
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <CheckCircle size={25} color="#f59e0b" /> Conversion Price:{' '}
            <b style={{ marginLeft: 2 }}>{adStats.conversionPrice ?? '1000'}</b>
          </Typography>
        </Box>

        {/* Content Section */}
        <Box mt={5}>
          <Typography variant="h6" fontWeight={700} sx={{ color: '#FF8000', mb: 2 }}>
            Advertisement Content
          </Typography>
          <HorizontalScroll>
            {adStats.adData.map((item, index) => (
              <AdContentCard
                key={index}
                imageUrl={item.imageUrl}
                storeName={getStoreName(item.storeId)}
                productName={getProductName(item.productId)}
                description={item.description}
              />
            ))}
          </HorizontalScroll>
        </Box>
      </Box>
    </Modal>
  );
};

const styles = {
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 1000,
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: '#fff',
    borderRadius: 3,
    p: 4,
    outline: 'none',
  },
  headerBox: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    mb: 4,
  },
  headerAccent: {
    width: 12,
    height: 48,
    borderRadius: '50px',
    background: 'linear-gradient(to bottom, #facc15, #f97316)',
    mx: 1,
  },
  headerContent: {
    flex: 1,
    textAlign: 'center',
  },
  cardGrid: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 2,
    mb: 4,
  },
  card: {
    flex: 1,
    borderRadius: 2,
    p: 2,
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
  },
  timeCard: {
    flex: 1,
    backgroundColor: '#fff7ed',
    borderRadius: 2,
    p: 3,
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 0.5,
  },
  timeTitle: {
    display: 'flex',
    alignItems: 'center',
    fontWeight: 600,
    color: '#FF8000',
    mb: 1,
  },
};

export default AdvertisementDetailsModal;