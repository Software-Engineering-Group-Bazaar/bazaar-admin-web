import React from 'react';
import { Box, Typography, Paper, Stack } from '@mui/material';
import { Store, Package, MessageSquare } from 'lucide-react';
const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

const AdContentCard = ({ imageUrl, storeName, productName, description }) => {
  return (
    <Paper
      elevation={1}
      sx={{
        display: 'flex',
        width: '100%',
        borderRadius: 3,
        overflow: 'hidden',
        backgroundColor: '#fffaf0',
      }}
    >
      {/* Left Image */}
      <Box
        sx={{
          width: 180,
          minHeight: 200,
          backgroundColor: '#ffecd2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={`${baseApiUrl}${imageUrl}`}
          alt='ad'
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </Box>

      {/* Right Content */}
      <Box sx={{ flex: 1, p: 3, backgroundColor: '#fffaf0' }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Store color='#fb8c00' size={18} />
            <Typography variant='subtitle2' fontWeight={600}>
              Store: <span style={{ fontWeight: 400 }}> {storeName}</span>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Package color='#fb8c00' size={18} />
            <Typography variant='subtitle2' fontWeight={600}>
              Product: <span style={{ fontWeight: 400 }}>{productName}</span>
            </Typography>
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: '#fff3e0',
              borderRadius: 2,
              minHeight: 100,
              borderLeft: '4px solid #fb8c00',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
            }}
          >
            <MessageSquare size={20} color='#fb8c00' style={{ marginTop: 2 }} />
            <Typography
              sx={{
                fontSize: '15px',
                lineHeight: 1.6,
                color: '#444',
                wordBreak: 'break-word',
              }}
            >
              {description || 'No advertisement text provided.'}
            </Typography>
          </Box>
        </Stack>
      </Box>
    </Paper>
  );
};

export default AdContentCard;
