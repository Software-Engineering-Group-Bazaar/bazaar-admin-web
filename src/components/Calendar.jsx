import React, { useState } from 'react';
import {
  Paper,
  Box,
  IconButton,
  Typography,
  styled,
  Button, // From HEAD
  Grid,
  useTheme,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Remove,
} from '@mui/icons-material';
import dayjs from 'dayjs';

const CalendarCell = styled(Box)(
  ({ theme, isToday, isSelected, isCurrentMonth }) => ({
    width: 36,
    height: 36,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    borderRadius: '50%',
    transition: 'all 0.2s ease',
    color: !isCurrentMonth
      ? theme.palette.text.disabled
      : isToday
        ? theme.palette.primary.main
        : theme.palette.text.primary,
    backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
    '&:hover': {
      backgroundColor: isSelected
        ? theme.palette.primary.dark // Slightly darker hover for selected
        : isCurrentMonth
          ? theme.palette.action.hover
          : 'transparent', // Only hover current month days
    },
    ...(isSelected && {
      color: theme.palette.primary.contrastText,
    }),
    ...(isToday &&
      !isSelected && {
        border: `1px solid ${theme.palette.primary.main}`,
      }),
    ...(!isCurrentMonth && {
      // Ensure non-current month days are not interactive on hover
      pointerEvents: 'none',
    }),
  })
);

const DayHeader = styled(Typography)(({ theme }) => ({
  // Added theme for consistency
  fontSize: '0.875rem',
  fontWeight: 500,
  textAlign: 'center',
  color: theme.palette.text.secondary, // Using theme for color
}));

function Calendar() {
  const theme = useTheme();
  const today = dayjs();
  const [currentDate, setCurrentDate] = useState(today);
  // Default to no dates selected or just today if that's the desired default
  const [selectedDates, setSelectedDates] = useState([
    today.format('YYYY-MM-DD'),
  ]);
  // const [selectedDates, setSelectedDates] = useState([]); // Alternative: start with no selection

  // Generate calendar days
  const generateCalendarDays = () => {
    const firstDayOfMonth = currentDate.startOf('month');
    const daysInMonth = currentDate.daysInMonth();
    // Consistent startDay logic (Monday = 0)
    const startDay =
      firstDayOfMonth.day() === 0 ? 6 : firstDayOfMonth.day() - 1;

    const prevMonthDays = [];
    for (let i = 0; i < startDay; i++) {
      // Corrected loop for prev month days
      const date = firstDayOfMonth.subtract(startDay - i, 'day');
      prevMonthDays.push({
        day: date.date(),
        isCurrentMonth: false,
        date: date.format('YYYY-MM-DD'),
        isToday: date.isSame(today, 'day'),
      });
    }

    const currentMonthDays = [];
    for (let i = 1; i <= daysInMonth; i++) {
      const date = firstDayOfMonth.date(i); // Simpler way to get date in current month
      currentMonthDays.push({
        day: i,
        isCurrentMonth: true,
        date: date.format('YYYY-MM-DD'),
        isToday: date.isSame(today, 'day'),
      });
    }

    const totalCells = 42; // Standard 6 weeks * 7 days
    const remainingCells =
      totalCells - (prevMonthDays.length + currentMonthDays.length);
    const nextMonthDays = [];
    const lastDayOfCurrentMonth = currentDate.endOf('month'); // For calculating next month days

    for (let i = 1; i <= remainingCells; i++) {
      const date = lastDayOfCurrentMonth.add(i, 'day');
      nextMonthDays.push({
        day: date.date(),
        isCurrentMonth: false,
        date: date.format('YYYY-MM-DD'),
        isToday: date.isSame(today, 'day'),
      });
    }

    return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
  };

  const days = generateCalendarDays();
  const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

  const handleDateClick = (dateStr, isCurrentMonthCell) => {
    if (!isCurrentMonthCell) return; // Only allow selecting dates in the current month

    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      // If you want single selection, uncomment next line and comment out the one after
      // setSelectedDates([dateStr]);
      setSelectedDates([...selectedDates, dateStr]); // For multi-selection
    }
  };

  const handlePrevMonth = () => {
    setCurrentDate(currentDate.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentDate(currentDate.add(1, 'month'));
  };

  // Placeholder for zoom functionality if needed
  const handleZoom = (type) => {
    console.log(`Zoom ${type} clicked`);
  };

  return (
    <Paper
      elevation={3} // Using elevation from develop for consistency
      sx={{
        p: 2.5, // Slightly increased padding
        // Using dimensions from develop for consistency if part of a dashboard
        height: '480px',
        width: '360px',
        boxShadow: 3, // Explicit shadow
        backgroundColor: theme.palette.background.paper, // Use theme background
        borderRadius: 2, // Consistent border radius
        display: 'flex',
        flexDirection: 'column',
        position: 'relative', // For absolute positioning of zoom controls
      }}
    >
      {/* Calendar Header: Month/Year and Navigation */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`, // Use theme divider
          pb: 1.5, // Adjusted padding
        }}
      >
        <IconButton
          onClick={handlePrevMonth}
          size='small'
          aria-label='Previous month'
        >
          <ChevronLeft />
        </IconButton>
        <Typography
          variant='h6'
          sx={{ fontWeight: 'medium', color: theme.palette.text.primary }}
        >
          {currentDate.format('MMMM YYYY')}
        </Typography>
        <IconButton
          onClick={handleNextMonth}
          size='small'
          aria-label='Next month'
        >
          <ChevronRight />
        </IconButton>
      </Box>

      {/* Weekday headers */}
      <Grid container spacing={0.5} sx={{ mb: 1.5, px: 0.5 }}>
        {' '}
        {/* Adjusted spacing and padding */}
        {weekDays.map((day) => (
          // Each day header takes up 1/7th of the width
          <Grid
            item
            xs={12 / 7}
            key={day}
            sx={{ display: 'flex', justifyContent: 'center' }}
          >
            <DayHeader>{day}</DayHeader>
          </Grid>
        ))}
      </Grid>

      {/* Calendar grid */}
      <Grid container spacing={0.5} sx={{ flexGrow: 1, px: 0.5 }}>
        {' '}
        {/* Allow grid to take remaining space */}
        {days.map((dayInfo, index) => (
          // Each cell takes up 1/7th of the width
          <Grid
            item
            xs={12 / 7}
            key={`${dayInfo.date}-${index}`}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 0.5,
            }}
          >
            <CalendarCell
              isToday={dayInfo.isToday}
              isSelected={selectedDates.includes(dayInfo.date)}
              isCurrentMonth={dayInfo.isCurrentMonth}
              onClick={() =>
                handleDateClick(dayInfo.date, dayInfo.isCurrentMonth)
              }
            >
              {dayInfo.day}
            </CalendarCell>
          </Grid>
        ))}
      </Grid>

      {/* Done button - from HEAD */}
      <Box
        sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'flex-end' }}
      >
        <Button
          variant='contained'
          color='primary'
          sx={{
            borderRadius: 28, // Pill shape
            px: 4,
            boxShadow: 'none', // Flat button style
            textTransform: 'none', // Normal case text
          }}
          onClick={() => console.log('Selected Dates:', selectedDates)} // Placeholder action
        >
          Done
        </Button>
      </Box>
    </Paper>
  );
}

export default Calendar;
