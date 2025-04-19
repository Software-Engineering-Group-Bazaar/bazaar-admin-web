import React, { useState, useEffect } from "react";
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
import { FiEdit2, FiTrash } from "react-icons/fi";
import { apiUpdateStoreAsync, apiDeleteStoreAsync, apiGetStoreCategoriesAsync } from "@api/api";
import AddProductModal from "@components/NewProductModal";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditStoreModal from "@components/EditStoreModal";
import ConfirmDeleteStoreModal from "@components/ConfirmDeleteStoreModal";
import StoreProductsList from './StoreProductsList';


const StoreCard = ({ store }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isOnline, setIsOnline] = useState(store.isActive);
  const [updating, setUpdating] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);

useEffect(() => {
  const fetchCategories = async () => {
    try {
      const data = await apiGetStoreCategoriesAsync();
      setCategories(data);
    } catch (err) {
      console.error("Greška pri dohvaćanju kategorija:", err);
    }
  };

  fetchCategories();
}, []);


  const open = Boolean(anchorEl);

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUpdateStore = async (updatedStore) => {
  //const response = await apiUpdateStoreAsync(updatedStore);
  if (response?.success) {
    // osvježi podatke ili javi parentu da ažurira store listu
  }
};

  const handleStatusChange = async (newStatus) => {
  setUpdating(true);

  // Nađi categoryId na osnovu categoryName
  const matchedCategory = categories.find(
    (cat) => cat.name === store.categoryName
  );

  if (!matchedCategory) {
    console.error("Category not found for:", store.categoryName);
    setUpdating(false);
    setAnchorEl(null);
    return;
  }

  const updatedStore = {
    id: store.id,
    name: store.name,
    address: store.address,
    description: store.description,
    categoryId: matchedCategory.id, // pravi ID sada
    isActive: newStatus,
  };

  try {
    const response = await apiUpdateStoreAsync(updatedStore);
    if (response?.status === 200 || response?.success) {
      setIsOnline(newStatus);
    }
  } catch (err) {
    console.error("Greška pri ažuriranju statusa:", err);
  }

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
        {/* Status + Delete dugmad gore desno */}
        <Box sx={{ position: "absolute", top: 8, right: 8, display: "flex", gap: 0.5 }}>
          {/* Diskretna Delete ikona */}
          <IconButton
            onClick={() => setOpenDeleteModal(true)}
            sx={{
              p: 0.5,
              color: "#999",
              "&:hover": { color: "#f44336" },
            }}
          >
            <FiTrash size={14} />
          </IconButton>

          {/* Status */}
          <IconButton
            onClick={handleStatusClick}
            sx={{ p: 0.5 }}
            disabled={updating}
          >
            <FiberManualRecordIcon
              sx={{
                color: isOnline ? "#4caf50" : "#f44336",
                fontSize: 14,
              }}
            />
          </IconButton>
        </Box>


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
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{
                lineHeight: 1,
                display: "inline-flex",
                alignItems: "center",
                gap: 1,
                position: "relative",
                "&:hover .edit-icon": { opacity: 1 },
              }}
            >
              {store.name}
              <IconButton
                className="edit-icon"
                size="small"
                sx={{
                  p: 0,
                  opacity: 0,
                  transition: "opacity 0.2s",
                }}
                onClick={() => setOpenEditModal(true)}
              >
                <FiEdit2 size={16} />
              </IconButton>
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

        {/* Products List */}
        <StoreProductsList storeId={store.id} />
      </Box>

      {/* Add Product Modal */}
      <AddProductModal
        open={openModal}
        onClose={handleCloseModal}
        storeID={store.id}
      />

      <EditStoreModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        store={store}
        onSave={handleUpdateStore}
      />

      <ConfirmDeleteStoreModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        storeName={store.name}
        onConfirm={async () => {
          const res = await apiDeleteStoreAsync(store.id);
          if (res.success) {
            window.location.reload(); 
          }
        }}
      />
    </>
  );
};

export default StoreCard;
