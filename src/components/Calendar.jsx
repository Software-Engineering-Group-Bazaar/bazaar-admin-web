import React, { useState } from 'react';
import { 
  Paper, 
  Box, 
  IconButton, 
  Typography, 
  styled,
  Button,
  Grid,
  useTheme
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut,
  Remove
} from '@mui/icons-material';
import dayjs from 'dayjs';


const CalendarCell = styled(Box)(({ theme, isToday, isSelected, isCurrentMonth }) => ({
  width: 36,
  height: 36,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '50%',
  transition: 'all 0.2s ease',
  color: !isCurrentMonth ? theme.palette.text.disabled : 
         isToday ? theme.palette.primary.main : 
         theme.palette.text.primary,
  backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
  '&:hover': {
    backgroundColor: isSelected ? theme.palette.primary.main : theme.palette.action.hover,
  },
  ...(isSelected && {
    color: theme.palette.primary.contrastText
  }),
  ...(isToday && !isSelected && {
    border: `1px solid ${theme.palette.primary.main}`
  }),
}));

const DayHeader = styled(Typography)({
  fontSize: '0.875rem',
  fontWeight: 500,
  textAlign: 'center',
  color: '#9e9e9e'
});

function Calendar() {
  const theme = useTheme();
  const today = dayjs();
  const [currentDate, setCurrentDate] = useState(today);
  const [selectedDates, setSelectedDates] = useState([today.format('YYYY-MM-DD')]);

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth();
    const startDay = firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1; // Convert Sunday = 0 to Monday = 0
    
    // Previous month days
    const prevMonthDays = [];
    for (let i = startDay - 1; i >= 0; i--) {
      const date = firstDayOfMonth.subtract(i + 1, 'day');
      prevMonthDays.push({
        day: date.date(),
        isCurrentMonth: false,
        date: date.format('YYYY-MM-DD'),
        isToday: date.isSame(today, 'day')
      });
    }
    
    // Current month days
    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = firstDayOfMonth.add(i - 1, 'day');
      currentMonthDays.push({
        day: i,
        isCurrentMonth: true,
        date: date.format('YYYY-MM-DD'),
        isToday: date.isSame(today, 'day')
      });
    }
    
    // Next month days
    const total = prevMonthDays.length + currentMonthDays.length;
    const nextMonthDays = [];
    for (let i = 1; i <= 42 - total; i++) {
      const date = firstDayOfMonth.add(daysInMonth - 1 + i, 'day');
      nextMonthDays.push({
        day: i,
        isCurrentMonth: false,
        date: date.format('YYYY-MM-DD'),
        isToday: date.isSame(today, 'day')
      });
    }
    
    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const days = generateCalendarDays();
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const handleDateClick = (date) => {
    if (selectedDates.includes(date)) {
      setSelectedDates(selectedDates.filter(d => d !== date));
    } else {
      setSelectedDates([...selectedDates, date]);
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        p: 2,
        height: '480px',
        boxShadow: 3,
        width: '380px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Calendar controls */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          borderBottom: '1px solid #f0f0f0',
          pb: 2
        }}
      >
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft />
        </IconButton>
        
        <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
          {currentDate.format('MMMM YYYY')}
        </Typography>
        
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight />
        </IconButton>
      </Box>
      
      {/* Zoom controls */}
      <Box 
        sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mb: 1,
          position: 'absolute',
          top: 12,
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#333',
          borderRadius: 1,
          padding: '2px'
        }}
      >
        <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
          <Remove fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
          <ZoomIn fontSize="small" />
        </IconButton>
        <IconButton size="small" sx={{ color: 'white', p: 0.5 }}>
          <ZoomOut fontSize="small" />
        </IconButton>
      </Box>

    {/* Weekday headers */}
<Grid container spacing={3.5} sx={{ mb: 1 }}>
  {weekDays.map(day => (
    <Grid item xs={1} key={day}>  {/* xs={1} za 7 dana u redu */}
      <DayHeader>{day}</DayHeader>
    </Grid>
  ))}
</Grid>

{/* Calendar grid */}
<Grid container spacing={1}>
  {days.map((day, index) => (
    <Grid item xs={1} key={index} sx={{ mb: 1 }}>  {/* xs={1} za 7 dana u redu */}
      <Box display="flex" justifyContent="center">
        <CalendarCell 
          isToday={day.isToday}
          isSelected={selectedDates.includes(day.date)}
          isCurrentMonth={day.isCurrentMonth}
          onClick={() => handleDateClick(day.date)}
        >
          {day.day}
        </CalendarCell>
      </Box>
    </Grid>
  ))}
</Grid>

      {/* Done button */}
      <Box sx={{ mt: 'auto', display: 'flex', justifyContent: 'flex-end' }}>
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ 
            borderRadius: 28,
            px: 4,
            boxShadow: 'none'
          }}
        >
          Done
        </Button>
      </Box>
    </Paper>
  );
}

export default Calendar;