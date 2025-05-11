import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography } from '@mui/material';
import CountUp from 'react-countup';
import { Pencil, Trash2, Link, Store, Save, X } from 'lucide-react';
import { BarChart2, MousePointerClick, Percent, Activity } from 'lucide-react';
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
    }
  }, [open]);

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
      adData: ad.AdData,
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

  if (!ad) return null;

  const cardData = [
    {
      icon: <BarChart2 size={24} color='#0284c7' />,
      label: 'Views',
      value: ad.views.toLocaleString(),
      bg: '#e0f2fe',
    },
    {
      icon: <MousePointerClick size={24} color='#0d9488' />,
      label: 'Clicks',
      value: ad.clicks.toLocaleString(),
      bg: '#ccfbf1',
    },
    {
      icon: <Percent size={24} color='#f59e0b' />,
      label: 'CTR',
      value:
        ad.views > 0 ? ((ad.clicks / ad.views) * 100).toFixed(1) + '%' : '0%',
      bg: '#fef9c3',
    },
    {
      icon: <Activity size={24} color={ad.isActive ? '#22c55e' : '#ef4444'} />,
      label: 'Status',
      value: ad.isActive ? 'Active' : 'Inactive',
      bg: ad.isActive ? '#dcfce7' : '#fee2e2',
    },
  ];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={styles.modal}>
        <Box sx={styles.headerBox}>
          <Box sx={styles.headerAccent} />
          <Box sx={styles.headerContent}>
            <Typography variant='h6' fontWeight={600} sx={{ color: '#FF8000' }}>
              Advertisement Overview
            </Typography>
            <Typography variant='h4' fontWeight={800}>
              Advertisement {ad.id}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Seller ID: {ad.sellerId}
            </Typography>
          </Box>
          <Box sx={styles.headerAccent} />
        </Box>

        {/* KPI Cards */}
        <Box sx={styles.cardGrid}>
          {cardData.map((item, i) => (
            <Box key={i} sx={{ ...styles.card, backgroundColor: item.bg }}>
              {item.icon}
              <Typography variant='body2' color='text.secondary'>
                {item.label}
              </Typography>
              <Typography variant='h6' fontWeight='bold'>
                {item.value}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Enhanced Time Fields */}
        <Box sx={{ display: 'flex', gap: 3, mt: 4 }}>
          <Box sx={styles.timeCard}>
            <Typography variant='subtitle2' sx={styles.timeTitle}>
              <svg
                width='16'
                height='16'
                fill='#FF8000'
                style={{ marginRight: 6 }}
              >
                <path d='M3 0a1 1 0 011 1v1h8V1a1 1 0 112 0v1h1a1 1 0 011 1v2H0V3a1 1 0 011-1h1V1a1 1 0 011-1zm11 6H2v7a1 1 0 001 1h10a1 1 0 001-1V6zM6 8h2v2H6V8z' />
              </svg>
              Start Time
            </Typography>
            <Typography variant='h6' fontWeight={500}>
              {new Date(ad.startTime).toLocaleDateString()}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {new Date(ad.startTime).toLocaleTimeString()}
            </Typography>
          </Box>

          <Box sx={styles.timeCard}>
            <Typography variant='subtitle2' sx={styles.timeTitle}>
              <svg
                width='16'
                height='16'
                fill='#FF8000'
                style={{ marginRight: 6 }}
              >
                <path d='M3 0a1 1 0 011 1v1h8V1a1 1 0 112 0v1h1a1 1 0 011 1v2H0V3a1 1 0 011-1h1V1a1 1 0 011-1zm11 6H2v7a1 1 0 001 1h10a1 1 0 001-1V6zM6 8h2v2H6V8z' />
              </svg>
              End Time
            </Typography>
            <Typography variant='h6' fontWeight={500}>
              {new Date(ad.endTime).toLocaleDateString()}
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              {new Date(ad.endTime).toLocaleTimeString()}
            </Typography>
          </Box>
        </Box>

        {/* Content */}
        <Box mt={5}>
          <Typography
            variant='h6'
            fontWeight={700}
            sx={{ color: '#FF8000', mb: 2 }}
          >
            Advertisement Content
          </Typography>

          <Box
            sx={{
              display: 'flex',
              gap: 3,
              overflowX: 'auto',
              pb: 1,
              '&::-webkit-scrollbar': {
                height: 8,
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#ccc',
                borderRadius: 4,
              },
            }}
          >
            <HorizontalScroll>
              {ad.adData.map((item, index) => {
                console.log('AdContentCard item:', item);
                return (
                  <AdContentCard
                    key={index}
                    imageUrl={item.imageUrl}
                    storeName={getStoreName(item.storeId)}
                    productName={getProductName(item.productId)}
                    description={item.description}
                  />
                );
              })}
            </HorizontalScroll>
          </Box>
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
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    mb: 3,
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
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#FF8000',
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
  timeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 4,
    mb: 3,
  },
  timeCol: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 2,
    p: 2,
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
  label: {
    fontWeight: 600,
    color: '#FF8000',
    mb: 1,
  },
  description: {
    fontSize: 16,
    marginBottom: 10,
  },
  link: {
    color: '#FF8000',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    fontWeight: 500,
  },
};

export default AdvertisementDetailsModal;
