import React, { useState } from "react";
import { Modal, Box, TextField, Button, Typography, Grid } from "@mui/material";
import style from "./NewProductModalStyle"



const AddProductModal = ({ open, onClose, onSubmit }) => {

  
  const [formData, setFormData] = useState({
                                             name: "",
                                             price: "",
                                             weight: "",
                                             volume: "",
                                             photos: [],
  });




  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const productData = {
      ...formData,
    };
    onSubmit(productData);
    onClose();
  };



  
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        {}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ fontWeight: 700, color: "#4a0404" }}>
            Add New Product
          </Typography>
          <Button
            variant="outlined"
            component="label"
            sx={{
              borderRadius: "50%",
              padding: "10px 15px",
              height: "40px",
              textTransform: "none",
             color:"#4a0404",
             borderColor:"#4a0404",
              backgroundColor: "#f0f0f0",
              "&:hover": {
                backgroundColor: "#e0e0e0",
              },
            }}
          >
            Upload
            <input
              type="file"
              hidden
              multiple
              accept="image/*"
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  photos: [...e.target.files],
                }))
              }
            />
          </Button>
        </Box>

        {}
        {formData.photos.length > 0 && (
          <Typography variant="body2" sx={{ mb: 2 }}>
            {formData.photos.length} file(s) selected
          </Typography>
        )}

        {}
        <TextField
          label="Product Name"
          fullWidth
          name="name"
          value={formData.name}
          onChange={handleChange}
          margin="normal"
        />

        <TextField
          label="Price"
          fullWidth
          name="price"
          value={formData.price}
          onChange={handleChange}
          margin="normal"
          type="number"
        />

        <TextField
          label="Weight (kg)"
          fullWidth
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          margin="normal"
          type="number"
        />

        <TextField
          label="Volume (L)"
          fullWidth
          name="volume"
          value={formData.volume}
          onChange={handleChange}
          margin="normal"
          type="number"
        />

        {}
        <Box display="flex" justifyContent="flex-end" gap={2} mt={2}>
          <Button variant="text" onClick={onClose} sx={{color : "#4a0404"}}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit} sx={{backgroundColor:'#4a0404'}}>
            Submit
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};





// Mock roditeljske komponente, dok se ne uradi drugi issue
const MockParentComponent = () => {
  const [openModal, setOpenModal] = useState(false);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleSubmit = (productData) => {
    console.log("Submitted Product:", productData);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleOpenModal}>
        Add Product
      </Button>

      {}
      <AddProductModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />
    </div>
  );
};


export default MockParentComponent;
