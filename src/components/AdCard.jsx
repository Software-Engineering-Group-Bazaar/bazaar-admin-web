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
import { apiFetchApprovedUsersAsync } from '../api/api';
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
import defaultAdImage from '@images/bazaarAd.jpg';


const IconStat = ({ icon, value, label, bg }) => (
  <Stack
    direction="row"
    spacing={1}
    alignItems="center"
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
      <Typography variant="subtitle2" fontWeight="bold">
        {value}
      </Typography>
      <Typography variant="caption" color="text.secondary">
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
          p: 2,
          borderRadius: 3,
          width: '100%',
          maxWidth: '1200px',
          minWidth: '1200px',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxSizing: 'border-box',
        }}
      >
        {/* Left: Image + Description */}
        <Box
          sx={{ display: 'flex', alignItems: 'center', minWidth: 360, gap: 2 }}
        >
          <Box
            component='img'
            src={defaultAdImage}
            alt='Ad'
            sx={{
              width: 60,
              height: 60,
              borderRadius: 2,
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <Box>
            <Box
              sx={{
                backgroundColor: '#f3e8ff',
                px: 1.2,
                py: 0.3,
                borderRadius: 1,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 0.5,
                height: 24,
              }}
            >
              <Typography variant='caption' fontWeight={500} color='#9333ea'>
                #{ad.id.toString().padStart(6, '0')} | Seller:{' '}
                {sellers.find((s) => s.id == ad.sellerId)?.userName ||
                  'Unknown'}
              </Typography>
            </Box>
            <Typography
              variant='subtitle1'
              fontWeight={600}
              noWrap
              sx={{
                maxWidth: 250,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {adItem?.description || 'No Description'}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              {adItem?.productId && (
                <Tooltip title='Product Link'>
                  <a
                    href={`${baseApiUrl}/api/Catalog/products/${adItem.productId}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    <LucideLink size={18} style={{ verticalAlign: 'middle' }} />
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
                      size={18}
                      style={{ marginLeft: 8, verticalAlign: 'middle' }}
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
            minWidth: 620,
            gap: 2,
          }}
        >
          <Box sx={{ width: 140 }}>
            <IconStat
              icon={<Eye size={20} color='#fff' />}
              value={ad.views}
              label='Views'
              bg='#0284c7'
            />
          </Box>
          <Box sx={{ width: 140 }}>
            <IconStat
              icon={<Hand size={20} color='#fff' />}
              value={ad.clicks}
              label='Clicks'
              bg='#0d9488'
            />
          </Box>
          <Box sx={{ width: 170 }}>
            <IconStat
              icon={<Clock size={20} color='#fff' />}
              value={dateRange}
              label='Active Period'
              bg='#8b5cf6'
            />
          </Box>
          <Box sx={{ width: 130 }}>
            <IconStat
              icon={
                ad.isActive ? (
                  <CheckCircle size={20} color='#fff' />
                ) : (
                  <XCircle size={20} color='#fff' />
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
          spacing={1}
          alignItems='center'
          justifyContent='flex-end'
          sx={{ minWidth: 120 }}
        >
          <Tooltip title='Details'>
            <IconButton onClick={handleDetails}>
              <Info size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Edit'>
            <IconButton onClick={() => setIsEditOpen(true)}>
              <Pencil size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Delete'>
            <IconButton color='error' onClick={() => setIsDeleteOpen(true)}>
              <Trash2 size={18} />
            </IconButton>
          </Tooltip>
        </Stack>

        {/* Modals */}
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
      </Paper>
    </Box>
  );
};


export default AdCard;
