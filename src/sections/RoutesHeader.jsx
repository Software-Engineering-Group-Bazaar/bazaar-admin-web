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

const RoutesHeader = ({ onAddRoute }) => {
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
      <Box sx={{ textAlign: "left" , marginLeft: 2}}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          {t('common.allRoutes')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('common.adminPanel')} &gt; {t('common.routes')}
        </Typography>
      </Box>
                <Button
                  variant='contained'
                  onClick={onAddRoute}
                  sx={{ marginRight: 5,
                    textTransform: 'none',
                    fontWeight: 600,
                    borderRadius: 2,
                    backgroundColor: '#34c759',
                    color: '#000',
                    '&:hover': {
                      backgroundColor: '#28a745',
                    },
                  }}
                >
                  {t('common.createRoute')}
                </Button>
    </Box>
  );
};

export default RoutesHeader;
