import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Checkbox,
  Button,
  IconButton,
  Stack,
  Divider,
  Chip,
} from '@mui/material';
import {
  CalendarDays,
  Edit3,
  Trash2,
  PlusCircle,
  ChevronRight,
} from 'lucide-react';

const EditAdModal = ({ open, onClose, ad, allAdContentItems, onSave }) => {
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [adContentItems, setAdContentItems] = useState([]);

  useEffect(() => {
    if (ad) {
      setStartTime(ad.startTime || '');
      setEndTime(ad.endTime || '');
      setIsActive(ad.isActive || false);
      setAdContentItems(ad.adData || []);
    }
  }, [ad]);

  const handleSave = () => {
    onSave?.(ad.id, {
      startTime,
      endTime,
      isActive,
      newAdDataItems: adContentItems,
    });
    onClose();
  };

  const handleAddItem = (item) => {
    setAdContentItems((prev) => [...prev, item]);
  };

  const handleRemoveItem = (itemId) => {
    setAdContentItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const availableItems = (allAdContentItems || []).filter(
    (item) => !adContentItems.some((selected) => selected.id === item.id)
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          p: 4,
          width: '90%',
          maxWidth: 700,
          bgcolor: '#fff',
          borderRadius: 4,
          boxShadow: 24,
          mx: 'auto',
          my: '5%',
          outline: 'none',
        }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Edit3 color='#1976d2' style={{ marginRight: 10 }} />
          <Typography variant='h5' fontWeight={700}>
            Edit Advertisement
          </Typography>
        </Box>

        {/* Start & End Time */}
        <Stack spacing={3}>
          <Box>
            <Typography variant='subtitle2' color='text.secondary' mb={1}>
              Start Time
            </Typography>
            <TextField
              fullWidth
              type='datetime-local'
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              InputProps={{
                startAdornment: (
                  <CalendarDays size={18} style={{ marginRight: 10 }} />
                ),
              }}
            />
          </Box>
          <Box>
            <Typography variant='subtitle2' color='text.secondary' mb={1}>
              End Time
            </Typography>
            <TextField
              fullWidth
              type='datetime-local'
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              InputProps={{
                startAdornment: (
                  <CalendarDays size={18} style={{ marginRight: 10 }} />
                ),
              }}
            />
          </Box>
        </Stack>

        {/* Is Active */}
        <Box sx={{ mt: 3 }}>
          <Checkbox
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            sx={{ mr: 1 }}
          />
          <Typography component='span' variant='body1'>
            Is Active
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Ad Content Items */}
        <Typography variant='subtitle1' fontWeight={600} mb={2}>
          Advertisement Items
        </Typography>
        <Box
          sx={{
            maxHeight: 160, // visina za 2-3 kartice
            overflowY: 'auto',
            pr: 1,
            mb: 2,
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bbb',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
          }}
        >
          <Stack spacing={1}>
            {adContentItems.map((item) => (
              <Box
                key={item.id}
                sx={{
                  backgroundColor: '#f9f9f9',
                  p: 1.5,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChevronRight size={18} />
                  <Typography variant='body2' fontWeight={500}>
                    Ad Content #{item.id}
                  </Typography>
                </Box>
                <IconButton
                  onClick={() => handleRemoveItem(item.id)}
                  size='small'
                >
                  <Trash2 size={18} />
                </IconButton>
              </Box>
            ))}
          </Stack>
        </Box>

        {/* Add More Items */}
        <Typography variant='subtitle1' fontWeight={600} mt={4} mb={1}>
          Add More Items
        </Typography>
        <Box
          sx={{
            overflowX: 'auto',
            whiteSpace: 'nowrap',
            pb: 1,
            pr: 1,
            display: 'flex',
            gap: 1,
            flexWrap: 'nowrap',
            maxHeight: 100, // 2 reda
            '&::-webkit-scrollbar': {
              height: 8,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: '#bbb',
              borderRadius: 4,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
          }}
        >
          {availableItems.map((item) => (
            <Chip
              key={item.id}
              label={`Ad Content #${item.id}`}
              onClick={() => handleAddItem(item)}
              icon={<PlusCircle size={16} />}
              variant='outlined'
              clickable
              sx={{ bgcolor: '#f3faff', flex: '0 0 auto' }}
            />
          ))}
        </Box>

        {/* Action Buttons */}
        <Box
          sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4, gap: 2 }}
        >
          <Button onClick={onClose} variant='outlined' color='secondary'>
            Cancel
          </Button>
          <Button onClick={handleSave} variant='contained' color='primary'>
            Save
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default EditAdModal;
