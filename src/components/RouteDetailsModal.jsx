import React from 'react';
import {
  Box,
  Modal,
  Typography,
  IconButton,
  Divider,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DirectionsIcon from '@mui/icons-material/Directions';
import RouteMap from './RouteMap'; // prilagodi ako je u drugom folderu

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  height: '80%',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 2,
  borderRadius: 2,
  display: 'flex',
  flexDirection: 'row',
  overflow: 'hidden',
};

const RouteDetailsModal = ({ open, onClose, routeData }) => {
  if (!routeData) return null;

  const steps =
    routeData.routeData?.data?.routes?.[0]?.legs?.[0]?.steps || [];

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {/* LEFT SIDE: Map */}
        <Box
          sx={{
            flex: 2,
            height: '100%',
            pr: 2,
            overflow: 'hidden',
            borderRadius: 2,
          }}
        >
          <RouteMap backendResponse={routeData} />
        </Box>

        {/* RIGHT SIDE: Details */}
        <Box
          sx={{
            flex: 1,
            height: '100%',
            overflowY: 'auto',
            position: 'relative',
            pl: 2,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8 }}
          >
            <CloseIcon />
          </IconButton>

          <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
            Route ID: {routeData.id}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <DirectionsIcon sx={{ mr: 1 }} />
            <Typography variant='subtitle1'>Directions</Typography>
          </Box>

          {steps.length === 0 ? (
            <Typography>No directions available.</Typography>
          ) : (
            <List dense>
              {steps.map((step, index) => (
                <ListItem key={index} disablePadding>
                  <ListItemText
                    primaryTypographyProps={{ variant: 'body2' }}
                    primary={
                      <span
                        dangerouslySetInnerHTML={{
                          __html: `${index + 1}. ${step.html_instructions}`,
                        }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </Box>
    </Modal>
  );
};

export default RouteDetailsModal;
