const textFieldStyle = {
  marginBottom: 2,
  '& .MuiOutlinedInput-root': {
    borderRadius: '12px',
    '& fieldset': {
      borderWidth: '2px',
    },
    '&:hover fieldset': {
      borderColor: '#3C5B66', 
    },
    '&.Mui-focused fieldset': {
      borderColor: '#3C5B66',
    },
  },
};

export default textFieldStyle;
