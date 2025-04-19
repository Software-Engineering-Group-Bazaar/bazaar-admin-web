import { Box, Typography, Avatar, TextField } from '@mui/material';

const OrderItemCard = ({
  imageUrl,
  name,
  price,
  quantity,
  tagIcon = '🏷️',
  tagLabel = 'General',
  isEditable = false,
  onChange = () => {},
}) => {
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
        {/* Name & Tag */}
        <Box
          display='flex'
          alignItems='center'
          justifyContent='flex-end'
          gap={1}
          sx={{ width: '100%' }}
          mb={0.5}
        >
          <Typography fontWeight={700} fontSize='1.2rem' color='#0f172a'>
            {name}
          </Typography>
        </Box>

        <Box display='flex' alignItems='center' gap={0.5} mb={1}>
          <Typography fontSize='1.05rem'>{tagIcon}</Typography>
          <Typography fontSize='0.85rem' color='#6b7280' fontWeight={500}>
            {tagLabel}
          </Typography>
        </Box>

        {/* Quantity and Price */}
        <Box display='flex' alignItems='center' gap={2}>
          {isEditable ? (
            <>
              <TextField
                variant='standard'
                type='number'
                label='Qty'
                value={quantity}
                onChange={(e) =>
                  onChange({
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
                sx={{ width: 50 }}
              />
              <TextField
                variant='standard'
                type='number'
                label='Price'
                value={price}
                onChange={(e) =>
                  onChange({
                    price: parseFloat(e.target.value) || 0,
                  })
                }
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
                {quantity}
              </Box>
              <Typography fontWeight={800} fontSize='1.3rem' color='#0f172a'>
                ${parseFloat(price).toFixed(2)}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default OrderItemCard;
