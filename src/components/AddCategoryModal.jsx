import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
  Avatar,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";

const AddCategoryModal = ({ open, onClose, onAddCategory, selectedType }) => {
  const [categoryName, setCategoryName] = useState("");
  const [categoryType, setCategoryType] = useState("product");

  const handleSubmit = () => {
    console.log(selectedType);
  if (categoryName.trim()) {
    const newCategory = {
      id: Date.now(),
      name: categoryName.trim(),
      type: categoryType, 
    };
    onAddCategory(newCategory);
    setCategoryName("");
    onClose();
  }
};

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: 400,
          bgcolor: "#fff",
          borderRadius: 4,
          boxShadow: 24,
          p: 4,
          textAlign: "center",
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        {/* Ikonica iznad */}
        <Avatar
          sx={{
            bgcolor: "#ffb300",
            mx: "auto",
            mb: 2,
            width: 56,
            height: 56,
          }}
        >
          <CategoryIcon sx={{ fontSize: 30, color: "#fff" }} />
        </Avatar>

        {/* Naslov */}
        <Typography variant="h5" fontWeight={600} mb={3} color="#4a0404">
          Add New Category
        </Typography>

        {/* Input za ime */}
        <TextField
          label="Category Name"
          variant="outlined"
          fullWidth
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          sx={{ mb: 3 }}
        />

        {/* Radio grupa za tip */}
        <Box textAlign="left" mb={3}>
          <FormLabel sx={{ fontWeight: 500, mb: 1 }}>Category Type</FormLabel>
          <RadioGroup
            row
            value={categoryType}
            onChange={(e) => setCategoryType(e.target.value)}
          >
            <FormControlLabel
              value="product"
              control={<Radio sx={{ color: "#ffb300" }} />}
              label="Product"
            />
            <FormControlLabel
              value="store"
              control={<Radio sx={{ color: "#1976d2" }} />}
              label="Store"
            />
          </RadioGroup>
        </Box>

        {/* Dugmad */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <Button onClick={onClose} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              backgroundColor: "#4a0404",
              "&:hover": { backgroundColor: "#370303" },
              borderRadius: 2,
            }}
          >
            Add Category
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCategoryModal;
