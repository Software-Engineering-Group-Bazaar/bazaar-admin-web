import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { apiGetStoreCategoriesAsync, apiUpdateStoreAsync } from "@api/api";

const StoreEditModal = ({ open, onClose, store, onStoreUpdated }) => {
  const [storeName, setStoreName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load categories when modal opens
  useEffect(() => {
    if (open) {
      apiGetStoreCategoriesAsync().then(setCategories);
    }
  }, [open]);

  // Populate fields with store data
  useEffect(() => {
    if (store) {
      setStoreName(store.name || "");
      setCategoryId(store.categoryId || "");
      setDescription(store.description || "");
      setAddress(store.address || "");
    }
  }, [store]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedData = {
      id: store.id,
      name: storeName,
      address,
      categoryId,
      description,
      isActive: store.isOnline ?? true,
    };

    const response = await apiUpdateStoreAsync(updatedData);

    if (response?.status === 200 || response?.success) {
      onStoreUpdated?.(updatedData); // Notify parent if needed
      onClose();
    }

    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 460,
          mx: "auto",
          mt: "8%",
          bgcolor: "#fff",
          borderRadius: 3,
          p: 4,
          boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
          outline: "none",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Avatar sx={{ bgcolor: "#B03A2E", width: 56, height: 56 }}>
            <EditIcon sx={{ color: "#fff", fontSize: 28 }} />
          </Avatar>
        </Box>

        <Typography variant="h5" align="center" mb={3} fontWeight={600} color="#B03A2E">
          Edit Store
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Store Name"
            fullWidth
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            margin="normal"
            required
          />

          <FormControl
            fullWidth
            margin="normal"
            required
            sx={{
              
            }}
          >
          <InputLabel id="category-label">Category</InputLabel>
          <Select
            labelId="category-label"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            label="Category"
            MenuProps={{
              PaperProps: {
                sx: {
                  mt: 1,
                  borderRadius: 2,
                },
              },
            }}
          >
            {categories.map((cat) => (
              <MenuItem key={cat.id} value={cat.id}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>


          <TextField
            label="Description"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            required
          />

          <TextField
            label="Address"
            fullWidth
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            margin="normal"
            required
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              backgroundColor: "#B03A2E",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": { backgroundColor: "#922B21" },
            }}
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Store"}
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default StoreEditModal;
