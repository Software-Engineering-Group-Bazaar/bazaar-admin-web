import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { FiEdit2 } from "react-icons/fi";
import { apiUpdateStoreStatusAsync } from "@api/api";
import AddProductModal from "@components/NewProductModal";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const StoreCard = ({ store }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOnline, setIsOnline] = useState(store.isOnline);
  const [updating, setUpdating] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const open = Boolean(anchorEl);

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await apiUpdateStoreStatusAsync(store.id, newStatus);
    setIsOnline(newStatus);
    setUpdating(false);
    setAnchorEl(null);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <Box
        sx={{
          width: 270,
          p: 2.5,
          borderRadius: 3,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minHeight: 160,
        }}
      >
        {/* Online/Offline Status Dot */}
        <IconButton
          onClick={handleStatusClick}
          sx={{ position: "absolute", top: 12, right: 12, p: 0 }}
          disabled={updating}
        >
          <FiberManualRecordIcon
            sx={{
              color: isOnline ? "#4caf50" : "#f44336",
              fontSize: 16,
            }}
          />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "left" }}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
            },
          }}
        >
          <MenuItem onClick={() => handleStatusChange(true)}>
            <FiberManualRecordIcon
              sx={{ color: "#4caf50", fontSize: 14, mr: 1 }}
            />
            Online
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange(false)}>
            <FiberManualRecordIcon
              sx={{ color: "#f44336", fontSize: 14, mr: 1 }}
            />
            Offline
          </MenuItem>
        </Menu>

        {/* Header i opis */}
        <Box sx={{ display: "flex", gap: 1.5 }}>
          {/* Ikonica lijevo */}
          <Avatar
            sx={{
              bgcolor: "#6A1B9A",
              width: 40,
              height: 40,
              mt: 0.2,
            }}
          >
            <StoreIcon />
          </Avatar>

          {/* Ime i adresa */}
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1 }}>
              {store.name}
            </Typography>

            {/* Adresa */}
            <Box
              sx={{ display: "flex", alignItems: "center", gap: 0.1, mt: 0.5 }}
            >
              <LocationOnIcon sx={{ fontSize: 14, color: "#607d8b" }} />
              <Typography
                variant="body2"
                sx={{ fontSize: "0.75rem", color: "#607d8b", lineHeight: 1.2 }}
              >
                {store.address}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Opis ispod cijelom širinom */}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            fontSize: "0.85rem",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {store.description}
        </Typography>

        {/* Add Product Button */}
        <Box sx={{ mt: "auto" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleOpenModal}
            sx={{
              textTransform: "none",
              fontWeight: 600,
              backgroundColor: "#345",
              "&:hover": {
                backgroundColor: "#233",
              },
            }}
          >
            Add Product
          </Button>
        </Box>
      </Box>

      {/* Add Product Modal */}
      <AddProductModal
        open={openModal}
        onClose={handleCloseModal}
        storeID={store.id}
      />
    </>
  );
};

export default StoreCard;
