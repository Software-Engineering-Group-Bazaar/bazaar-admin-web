import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Eye,
  Hand,
  Clock,
  CheckCircle,
  XCircle,
  Link as LucideLink,
  Store,
  Info,
  Pencil,
  Trash2,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import DeleteConfirmationModal from './DeleteAdConfirmation';
import EditAdModal from './EditAdModal';
import AdvertisementDetailsModal from './AdvertisementDetailsModal';
import { apiFetchApprovedUsersAsync } from '../api/api';
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
import defaultAdImage from '@images/bazaarAd.jpg';


const IconStat = ({ icon, value, label, bg }) => (
  <Stack
    direction='row'
    spacing={1}
    alignItems='center'
    sx={{ flexShrink: 0, minWidth: 140 }}
  >
    <Box
      sx={{
        backgroundColor: bg,
        width: 36,
        height: 36,
        borderRadius: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant='subtitle2' fontWeight='bold'>
        {value}
      </Typography>
      <Typography variant='caption' color='text.secondary'>
        {label}
      </Typography>
    </Box>
  </Stack>
);

const AdCard = ({ ad, onDelete, onEdit, onViewDetails }) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const rez = await apiFetchApprovedUsersAsync();
      setSellers(rez);
    };
    fetchUsers();
  }, []);

  const handleDelete = async () => {
    try {
      await onDelete(ad.id);
      toast.success('Ad deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete ad');
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const handleEdit = async (adId, payload) => {
    try {
      await onEdit(adId, payload);
      toast.success('Ad updated successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to update ad');
    } finally {
      setIsEditOpen(false);
    }
  };

  const handleDetails = () => {
    try {
      onViewDetails(ad.id);
    } catch (err) {
      toast.error(err.message || 'Failed to open details');
    }
  };

  const adItem = ad.adData[0];
  const dateRange = `${new Date(ad.startTime).toLocaleDateString()} - ${new Date(ad.endTime).toLocaleDateString()}`;

  return (
    <Box display='flex' justifyContent='center' width='100%'>
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          borderRadius: 3,
          width: '100%',
          maxWidth: '1000px',
          minWidth: '1000px',
          minHeight: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Image + Description */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            minWidth: 260,
            gap: 1.5,
          }}
        >
          <Box
            component='img'
            src={defaultAdImage}
            alt='Ad'
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <Box>
            <Box
              sx={{
                backgroundColor: '#f3e8ff',
                px: 1,
                py: 0.2,
                borderRadius: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 0.5,
                height: 20,
              }}
            >
              <Typography variant='caption' fontWeight={500} color='#9333ea'>
                #{ad.id.toString().padStart(6, '0')} | Seller:{' '}
                {sellers.find((s) => s.id == ad.sellerId)?.userName ||
                  'Unknown'}
              </Typography>
            </Box>
            <Typography
              variant='subtitle2'
              fontWeight={600}
              noWrap
              sx={{
                maxWidth: 180,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {adItem?.description || 'No Description'}
            </Typography>
            <Box sx={{ mt: 0.3 }}>
              {adItem?.productId && (
                <Tooltip title='Product Link'>
                  <a
                    href={`${baseApiUrl}/api/Catalog/products/${adItem.productId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <LucideLink size={16} style={{ verticalAlign: 'middle' }} />
                  </a>
                </Tooltip>
              )}
              {adItem?.storeId && (
                <Tooltip title='Store Link'>
                  <a
                    href={`${baseApiUrl}/api/Stores/${adItem.storeId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <Store
                      size={16}
                      style={{ marginLeft: 6, verticalAlign: 'middle' }}
                    />
                  </a>
                </Tooltip>
              )}
            </Box>
          </Box>
        </Box>

        {/* Middle: Stats */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minWidth: 500,
            gap: 1.5,
            flexWrap: 'wrap',
          }}
        >
          <Box sx={{ width: 90 }}>
            <IconStat
              icon={<Eye size={18} color='#fff' />}
              value={ad.views}
              label='Views'
              bg='#0284c7'
            />
          </Box>
          <Box sx={{ width: 90 }}>
            <IconStat
              icon={<Hand size={18} color='#fff' />}
              value={ad.clicks}
              label='Clicks'
              bg='#0d9488'
            />
          </Box>
          <Box sx={{ width: 120 }}>
            <IconStat
              icon={<Clock size={18} color='#fff' />}
              value={dateRange}
              label='Active'
              bg='#8b5cf6'
            />
          </Box>
          <Box sx={{ width: 170 }}>
            <Box
              sx={{
                width: 500,
                maxWidth: 170,
                minHeight: 48,
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                background: '#f3f4f6',
                borderRadius: 2,
                p: 0.7,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 0.2,
                flexShrink: 1,
              }}
            >
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Hand size={12} color='#0d9488' /> Click Price:{' '}
                <b style={{ marginLeft: 2 }}>{ad.clickPrice ?? 'Mock'}</b>
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <Eye size={18} color='#0284c7' /> View Price:{' '}
                <b style={{ marginLeft: 2 }}>{ad.viewPrice ?? 'Mock'}</b>
              </Typography>
              <Typography
                variant='caption'
                color='text.secondary'
                sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
              >
                <CheckCircle size={18} color='#f59e0b' /> Conversion Price:{' '}
                <b style={{ marginLeft: 2 }}>{ad.conversionPrice ?? 'Mock'}</b>
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: 80 }}>
            <IconStat
              icon={
                ad.isActive ? (
                  <CheckCircle size={18} color='#fff' />
                ) : (
                  <XCircle size={18} color='#fff' />
                )
              }
              value={ad.isActive ? 'Active' : 'Inactive'}
              label='Status'
              bg={ad.isActive ? '#22c55e' : '#f87171'}
            />
          </Box>
        </Box>

        {/* Right: Actions */}
        <Stack
          direction='row'
          spacing={0.5}
          alignItems='center'
          justifyContent='flex-end'
          sx={{ minWidth: 80 }}
        >
          <Tooltip title='Details'>
            <IconButton size='small' onClick={handleDetails}>
              <Info size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit'>
            <IconButton size='small' onClick={() => setIsEditOpen(true)}>
              <Pencil size={16} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton
              size='small'
              color='error'
              onClick={() => setIsDeleteOpen(true)}
            >
              <Trash2 size={16} />
            </IconButton>
          </Tooltip>
        </Stack>
        {/* ...modals... */}
      </Paper>
        <EditAdModal
          open={isEditOpen}
          ad={ad}
          onClose={() => setIsEditOpen(false)}
          onSave={handleEdit}
        />

        <DeleteConfirmationModal
          open={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
    </Box>
  );
};


export default AdCard;
