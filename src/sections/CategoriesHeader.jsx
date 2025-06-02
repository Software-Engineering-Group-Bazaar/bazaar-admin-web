import React from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from 'react-i18next';

const CategoriesHeader = ({ searchTerm, setSearchTerm, onAddCategory }) => {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        width: "100%",
        py: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: "center",
        justifyContent: "space-between",
        gap: 2,
        borderBottom: "1px solid #e0e0e0",
      }}
    >
      <Box sx={{ textAlign: "left" }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {t('categories.categories')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('common.adminPanel')} &gt; {t('categories.categories')}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder={t('categories.searchCategory')}
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            minWidth: { xs: "100%", sm: "240px" },
          }}
        />

        <Button
          variant="contained"
          onClick={onAddCategory}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            backgroundColor: "#fbbc05",
            color: "#000",
            "&:hover": {
              backgroundColor: "#e6a800",
            },
          }}
        >
          {t('categories.addCategory')}
        </Button>
      </Box>
    </Box>
  );
};

export default CategoriesHeader;
