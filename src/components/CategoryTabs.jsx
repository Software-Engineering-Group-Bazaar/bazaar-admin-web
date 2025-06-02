import React from "react";
import { Box, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { FaBoxOpen } from "react-icons/fa"; 
import { FaStore } from "react-icons/fa"; 
import { useTranslation } from 'react-i18next';

const CategoryTabs = ({ selectedType, onChangeType }) => {
  const { t } = useTranslation();
  return (
    <Box sx={{ mt: 2 }}>
      <ToggleButtonGroup
        value={selectedType}
        exclusive
        onChange={(e, value) => value && onChangeType(value)}
        sx={{
          backgroundColor: "#fff",
          borderRadius: 2,
          p: 0.5,
          gap: 1.5, // razmak između tabova
          "& .MuiToggleButton-root": {
            border: "none",
            borderRadius: 2,
            px: 3,
            py: 1.2,
            fontWeight: 600,
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontSize: "0.95rem",
            transition: "all 0.2s ease-in-out",
            color: "#555",
            "&:hover": {
              backgroundColor: "#eaeaea",
            },
            "&.Mui-selected": {
              color: "#fff",
              "&:hover": {
                opacity: 0.95,
              },
            },
          },
        }}
      >
        <ToggleButton
          value="product"
          sx={{
            backgroundColor:
              selectedType === "product" ? "#ffb400" : "transparent",
            "&.Mui-selected": {
              backgroundColor: "#ffb400",
            },
          }}
        >
          <FaBoxOpen />
          {t('common.productCategories')}
        </ToggleButton>

        <ToggleButton
          value="store"
          sx={{
            backgroundColor:
              selectedType === "store" ? "#1976d2" : "transparent",
            "&.Mui-selected": {
              backgroundColor: "#1976d2",
            },
          }}
        >
          <FaStore />
          {t('common.storeCategories')}
        </ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};

export default CategoryTabs;
