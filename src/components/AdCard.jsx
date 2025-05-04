import React, { useState } from 'react';
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

  const handleDelete = async () => {
    try {
      await apiDeleteAdAsync(ad.id);
      toast.success('Ad deleted successfully');
    } catch (err) {
      toast.error(err.message || 'Failed to delete ad');
    } finally {
      setIsDeleteOpen(false);
    }
  };

  const handleEdit = async (updatedAd) => {
    try {
      await onEdit(updatedAd);
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

  const adItem = ad.AdData[0];
  const dateRange = `${new Date(ad.startTime).toLocaleDateString()} - ${new Date(ad.endTime).toLocaleDateString()}`;

  return (
    <Box display="flex" justifyContent="center" width="100%">
 <Paper
  elevation={3}
  sx={{
    p: 2,              
    display: 'flex',
    flexDirection: 'column',
    gap: 1.5,          
    borderRadius: 3,
    width: '100%',
    maxWidth: '1200px',
    minWidth: '1200px',
    boxSizing: 'border-box',
    minHeight: 'unset', 
  }}
>


        <Stack
          direction="row"
          spacing={3}
          alignItems="center"
          justifyContent="space-between"
        >
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
            {adItem?.Image && (
              <Box
                component="img"
                src={adItem.Image}
                alt={adItem.Description || 'Ad Image'}
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: 2,
                  objectFit: 'cover',
                }}
              />
            )}
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
                <Typography variant="caption" fontWeight={500} color="#9333ea">
                  #{ad.id.toString().padStart(6, '0')} | Seller: {ad.sellerId}
                </Typography>
              </Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {adItem?.Description || 'No Description'}
              </Typography>
              <Box sx={{ mt: 0.5 }}>
                {adItem?.ProductLink && (
                  <Tooltip title="Product Link">
                    <a
                      href={adItem.ProductLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <LucideLink
                        size={18}
                        style={{
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}
                      />
                    </a>
                  </Tooltip>
                )}
                {adItem?.StoreLink && (
                  <Tooltip title="Store Link">
                    <a
                      href={adItem.StoreLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Store
                        size={18}
                        style={{
                          marginLeft: 8,
                          display: 'inline-block',
                          verticalAlign: 'middle',
                        }}
                      />
                    </a>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </Box>

          <Stack
            direction="row"
            spacing={3}
            alignItems="center"
            justifyContent="space-between"
            flex={1}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <IconStat
                icon={<Eye size={20} color="#fff" />}
                value={ad.Views}
                label="Views"
                bg="#0284c7"
              />
              <IconStat
                icon={<Hand size={20} color="#fff" />}
                value={ad.Clicks}
                label="Clicks"
                bg="#0d9488"
              />
              <IconStat
                icon={<Clock size={20} color="#fff" />}
                value={dateRange}
                label="Active Period"
                bg="#8b5cf6"
              />
              <IconStat
                icon={
                  ad.isActive ? (
                    <CheckCircle size={20} color="#fff" />
                  ) : (
                    <XCircle size={20} color="#fff" />
                  )
                }
                value={ad.isActive ? 'Active' : 'Inactive'}
                label="Status"
                bg={ad.isActive ? '#22c55e' : '#f87171'}
              />
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title="Details">
                <IconButton onClick={handleDetails}>
                  <Info size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Edit">
                <IconButton onClick={() => setIsEditOpen(true)}>
                  <Pencil size={18} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton color="error" onClick={() => setIsDeleteOpen(true)}>
                  <Trash2 size={18} />
                </IconButton>
              </Tooltip>
            </Stack>
          </Stack>
        </Stack>


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
