import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import mapa from '@images/routing-pointa-ppointb.png';
import DeleteConfirmationModal from './DeleteRouteConfirmation';
import RouteDetailsModal from './RouteDetailsModal';
import { useTranslation } from 'react-i18next';
const RouteCard = ({route, onViewDetails, onDelete, googleMapsApiKey}) => {
  const { t } = useTranslation();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleDelete = async() => {
    try{
     await onDelete(route.id);
    }catch(err){
      console.log("Delete unsuccessful");
    }finally {
      setDeleteOpen(false);
    }
  }
  const handleViewDetails = () => {
    try{
     onViewDetails(route.id);
    }catch(err){
      console.log("Failed to open route details");
    }
  }
  return (
    <Box
      sx={{
        width: 300,
        height: 300,
        backgroundImage: `url(${mapa})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        borderRadius: 2,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        p: 2,
      }}
    >
      {/* Top-center text */}
      <Typography
        variant="subtitle1"
        sx={{
          position: 'absolute',
          top: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          fontWeight: 'bold',
          textAlign: 'center',
          marginTop: 13
        }}
      >
        Ruta {route?.id}
      </Typography>

      {/* Buttons */}
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => setDetailsOpen(true)}
          sx={{ flex: 1 }}
        >
          {t('common.details')}
        </Button>
        <Button
          variant="contained"
          size="small"
          onClick={() => setDeleteOpen(true)}
          sx={{
            flex: 1,
            backgroundColor: 'white',
            color: 'black',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
          }}
        >
          {t('common.delete')}
        </Button>
      </Box>
      <RouteDetailsModal
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        routeData={route}
      />

      <DeleteConfirmationModal
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Box>
    
  );
};

export default RouteCard;