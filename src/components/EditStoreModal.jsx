import React, { useState, useEffect } from "react";
import { Modal, Box, TextField, Button, MenuItem, Select, InputLabel, FormControl, Typography } from "@mui/material";
import axios from "axios";


import editIcon from "../assets/images/edit-icon.png"; 

const StoreEditModal = ({ open, onClose, store }) => {
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  // Ako je modal otvoren, inicijaliziraj stanje sa podacima prodavnice
  useEffect(() => {
    if (store) {
      setStoreName(store.name);
      setCategory(store.category);
      setDescription(store.description);
      setAddress(store.address);
    }
  }, [open, store]); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedStore = {
      name: storeName,
      category: category,
      description: description,
      address: address,
    };

    try {
      const response = await axios.put(`/api/stores/${store.id}`, updatedStore); // Ažuriraj prodavnicu, dodati u api.js
      alert("Prodavnica je uspješno ažurirana!");
      onClose();  // Zatvori modal nakon uspješnog ažuriranja
    } catch (error) {
      console.error("Greška pri ažuriranju prodavnice:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 450,
          margin: "auto",
          backgroundColor: "white",
          padding: 3,
          borderRadius: 3,
          mt: 5,
          boxShadow: 3,
          border: "2px solid #B03A2E", 
        }}
      >
        
        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <img src={editIcon} alt="Edit Icon" style={{ width: "50px", height: "50px" }} />
        </Box>

        <Typography variant="h5" sx={{ color: "#B03A2E", textAlign: "center", mb: 3 }}>Edit Store</Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Store Name"
            fullWidth
            margin="normal"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            required
            sx={{
              '& .MuiInputLabel-root': { color: "#B03A2E" },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: "#B03A2E" },
                '&:hover fieldset': { borderColor: "#B03A2E" },
                '&.Mui-focused fieldset': { borderColor: "#B03A2E" },
              },
            }}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label" sx={{ color: "#B03A2E" }}>Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { borderColor: "#B03A2E" },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: "#B03A2E" },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: "#B03A2E" },
              }}
            >


            {/*potrebno zamijeniti mockovane kategorije*/}
              <MenuItem value="Electronics">Elektronika</MenuItem>
              <MenuItem value="Clothing">Odjeća</MenuItem>
              <MenuItem value="Food">Hrana</MenuItem>




            </Select>
          </FormControl>
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            sx={{
              '& .MuiInputLabel-root': { color: "#B03A2E" },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: "#B03A2E" },
                '&:hover fieldset': { borderColor: "#B03A2E" },
                '&.Mui-focused fieldset': { borderColor: "#B03A2E" },
              },
            }}
          />
          <TextField
            label="Address"
            fullWidth
            margin="normal"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            sx={{
              '& .MuiInputLabel-root': { color: "#B03A2E" },
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: "#B03A2E" },
                '&:hover fieldset': { borderColor: "#B03A2E" },
                '&.Mui-focused fieldset': { borderColor: "#B03A2E" },
              },
            }}
          />
          <Box sx={{ mt: 2 }}>
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading} sx={{ backgroundColor: "#B03A2E", '&:hover': { backgroundColor: "#922B21" } }}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
};

export default StoreEditModal;
