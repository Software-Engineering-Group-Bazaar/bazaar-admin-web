import { Box, Typography, Avatar, TextField, IconButton } from '@mui/material';
import { FaPen, FaCheck } from 'react-icons/fa6';
import { useState } from 'react';

const OrderItemCard = ({
  imageUrl,
  name,
  price,
  quantity,
  tagIcon = '🌶',
  tagLabel = 'Spicy',
  isEditable = false,
  onChange = () => {},
}) => {
  const [editing, setEditing] = useState(false);
  const [localName, setLocalName] = useState(name);
  const [localPrice, setLocalPrice] = useState(price);
  const [localQuantity, setLocalQuantity] = useState(quantity);

  const applyChanges = () => {
    onChange({
      name: localName,
      price: parseFloat(localPrice),
      quantity: parseInt(localQuantity),
    });
    setEditing(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: '24px',
        backgroundColor: '#fff',
        px: 3,
        py: 2.5,
        minHeight: '140px',
        border: '1px solid rgba(15, 23, 42, 0.08)',
        width: '100%',
        transition: 'all 0.3s ease',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 14px 38px rgba(214, 167, 0, 0.1)',
        },
      }}
    >
      {/* Left: Image */}
      <Avatar
        src={imageUrl}
        alt={name}
        sx={{
          width: 96,
          height: 96,
          borderRadius: '50%',
          boxShadow: '0 6px 20px rgba(0,0,0,0.1)',
          flexShrink: 0,
        }}
      />

      {/* Right: Info */}
      <Box
        display='flex'
        flexDirection='column'
        alignItems='flex-end'
        justifyContent='center'
        flexGrow={1}
        ml={3}
      >
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          gap={1}
          sx={{ width: '100%' }}
        >
          {isEditable && (
            <IconButton
              onClick={() => (editing ? applyChanges() : setEditing(true))}
              size='small'
              sx={{
                p: 0.3,
                color: '#555',
                '&:hover': { color: '#000' },
              }}
            >
              {editing ? <FaCheck size={14} /> : <FaPen size={14} />}
            </IconButton>
          )}

          {editing ? (
            <TextField
              variant='standard'
              value={localName}
              onChange={(e) => setLocalName(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          ) : (
            <Typography fontWeight={700} fontSize='1.2rem' color='#0f172a'>
              {localName}
            </Typography>
          )}
        </Box>

        <Box display='flex' alignItems='center' gap={0.5} mb={1}>
          <Typography fontSize='1.05rem'>{tagIcon}</Typography>
          <Typography fontSize='0.85rem' color='#6b7280' fontWeight={500}>
            {tagLabel}
          </Typography>
        </Box>

        <Box display='flex' alignItems='center' gap={2}>
          {editing ? (
            <>
              <TextField
                variant='standard'
                type='number'
                label='Qty'
                value={localQuantity}
                onChange={(e) => setLocalQuantity(e.target.value)}
                sx={{ width: 50 }}
              />
              <TextField
                variant='standard'
                type='number'
                label='Price'
                value={localPrice}
                onChange={(e) => setLocalPrice(e.target.value)}
                sx={{ width: 80 }}
              />
            </>
          ) : (
            <>
              <Box
                px={1.4}
                py={0.3}
                bgcolor='#000'
                color='#fff'
                fontSize='0.85rem'
                fontWeight={600}
                borderRadius='999px'
                minWidth='32px'
                textAlign='center'
              >
                {localQuantity}
              </Box>
              <Typography fontWeight={800} fontSize='1.3rem' color='#0f172a'>
                ${parseFloat(localPrice).toFixed(2)}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderItemCard;
