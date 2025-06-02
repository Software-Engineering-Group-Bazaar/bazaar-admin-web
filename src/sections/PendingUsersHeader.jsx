import React from "react";
import { Box, Typography, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from 'react-i18next'; 

const PendingUsersHeader = ({ onAddUser, searchTerm, setSearchTerm }) => {
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
      <Box sx={{ textAlign: "left", mb: 3 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {t('common.requests')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('common.adminPanel')} &gt; {t('common.requests')}
        </Typography>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <TextField
          placeholder={t('common.searchUser')}
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
          sx={{ borderRadius: 2, backgroundColor: "#f9f9f9" }}
        />
      </Box>
    </Box>
  );
};

export default PendingUsersHeader;
