import React from "react";
import { Box, Typography, IconButton, Button } from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { useTranslation } from 'react-i18next';

const UserManagementPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPages = () => {
    const pages = [];
    const maxVisible = 8;
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const { t } = useTranslation();

  return (
    <Box
      sx={{
        width: "100%",
        px: 4,
        py: 3,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTop: "1px solid #e0e0e0",
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {t('common.displayingPage')}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
        >
          {t('common.first')}
        </Button>

        <IconButton
          size="small"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <NavigateBeforeIcon />
        </IconButton>

        {getPages().map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? "contained" : "outlined"}
            size="small"
            color={page === currentPage ? "primary" : "inherit"}
            onClick={() => onPageChange(page)}
          >
            {page}
          </Button>
        ))}

        {currentPage + 2 < totalPages && (
          <Typography variant="body2" color="text.secondary">
            ...
          </Typography>
        )}

        <IconButton
          size="small"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <NavigateNextIcon />
        </IconButton>

        <Button
          variant="outlined"
          size="small"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {t('common.last')}
        </Button>
      </Box>
    </Box>
  );
};

export default UserManagementPagination;

