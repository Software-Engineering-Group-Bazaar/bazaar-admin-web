import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography } from "@mui/material";

const AddCategoryModal = ({ open, onClose, onAddCategory }) => {
  const [categoryName, setCategoryName] = useState("");

  const handleSubmit = () => {
    if (categoryName.trim()) {
      onAddCategory(categoryName);
      setCategoryName("");
      onClose(); 
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: 2,
          boxShadow: 24,
          minWidth: 300,
        }}
      >
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Add New Category
        </Typography>
        <TextField
          label="Category Name"
          variant="outlined"
          fullWidth
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          sx={{ marginBottom: 2 }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Add Category
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AddCategoryModal;
