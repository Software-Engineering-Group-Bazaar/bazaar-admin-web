const buttonStyle = (theme) => ({
    textTransform: 'none',
    borderRadius: '12px',
    paddingY: 1.2,
    paddingX: 4,
    fontWeight: 600,
    fontSize: '1rem',
    backgroundColor: theme.palette.text.primary,
    color: theme.palette.primary.contrastText,
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease-in-out',
  
    '&:hover': {
      backgroundColor: '#3b0f0f', 
      boxShadow: '0 6px 14px rgba(0,0,0,0.2)',
    },
  
    '&:focus': {
      outline: 'none',
      boxShadow: `0 0 0 3px rgba(77, 18, 17, 0.3)`, 
    },
  });
  
  export default buttonStyle;
  