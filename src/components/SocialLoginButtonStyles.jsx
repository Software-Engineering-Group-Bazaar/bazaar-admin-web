const socialButtonStyle = (theme) => ({
    borderRadius: '12px',
    paddingY: 1.2,
    paddingX: 3,
    fontWeight: 500,
    minWidth: 150,
    justifyContent: 'flex-start',
    gap: 1.5,
    borderColor: theme.palette.primary.light,
    color: theme.palette.primary.main,
    transition: 'all 0.3s ease',
  
    '& .MuiButton-startIcon': {
      margin: 0,
    },
  
    '&:hover': {
      backgroundColor: '#f8f8f8', 
      borderColor: theme.palette.primary.main,
      transform: 'translateY(-2px)',
      boxShadow: `0 6px 12px ${theme.palette.primary.light}`, 
    },
  
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
    },
  });
  
  export default socialButtonStyle;
  