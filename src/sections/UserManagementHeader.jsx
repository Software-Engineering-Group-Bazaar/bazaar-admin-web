import React from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useTranslation } from 'react-i18next';

const UserManagementHeader = ({ onAddUser, searchTerm, setSearchTerm }) => {
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
          {t('common.userManagement')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('common.adminPanel')} &gt; {t('common.userManagement')}
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
          sx={{
            borderRadius: 2,
            backgroundColor: "#f9f9f9",
            minWidth: { xs: "100%", sm: "240px" },
          }}
        />
        <Button
          variant="contained"
          onClick={onAddUser}
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
          {t('common.addUser')}
        </Button>
      </Box>
    </Box>
  );
};

export default UserManagementHeader;
