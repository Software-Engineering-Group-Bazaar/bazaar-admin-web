import { Box, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';

const HorizontalScroll = ({ children }) => {
  const scrollRef = useRef();

  const scroll = (offset) => {
    scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
  };

  return (
    <Box sx={{ position: 'relative', width: '90%', mt: 2, ml: 5 }}>
      <IconButton
        onClick={() => scroll(-600)}
        sx={{
          position: 'absolute',
          top: '50%',
          left: -20,
          transform: 'translateY(-50%)',
          zIndex: 1,
          backgroundColor: '#fff',
          boxShadow: 1,
        }}
      >
        <ChevronLeft />
      </IconButton>

      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          overflowX: 'auto',
          scrollBehavior: 'smooth',
          gap: 2,
          pr: 4,
          pl: 4,
        }}
      >
        {children}
      </Box>

      <IconButton
        onClick={() => scroll(600)}
        sx={{
          position: 'absolute',
          top: '50%',
          right: -20,
          transform: 'translateY(-50%)',
          zIndex: 1,
          backgroundColor: '#fff',
          boxShadow: 1,
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};

export default HorizontalScroll;
