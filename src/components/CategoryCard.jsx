import React, { useState } from "react";
import { Box, Typography, IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { FiEdit2 } from "react-icons/fi";
import { apiUpdateCategoryStatusAsync } from "../api/api.js";
import CategoryEditModal from "./CategoryEditModal"; 

const CategoryCard = ({ category, onUpdateCategory }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [isActive, setIsActive] = useState(category.isActive);
  const [updating, setUpdating] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  const open = Boolean(anchorEl);

  const handleStatusClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    await apiUpdateCategoryStatusAsync(category.id, newStatus);
    setIsActive(newStatus);
    setUpdating(false);
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleUpdateCategory = (updatedCategory) => {
    onUpdateCategory(updatedCategory);
  };

  return (
    <>
      <Box sx={{ width: 270, p: 2.5, borderRadius: 3, boxShadow: "0 4px 10px rgba(0,0,0,0.08)", backgroundColor: "#fff", position: "relative", display: "flex", flexDirection: "column", minHeight: 160 }}>
        <IconButton onClick={handleStatusClick} sx={{ position: "absolute", top: 12, right: 12, p: 0 }} disabled={updating}>
          <FiberManualRecordIcon sx={{ color: isActive ? "#4caf50" : "#f44336", fontSize: 16 }} />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)} anchorOrigin={{ vertical: "top", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "left" }} PaperProps={{ sx: { mt: 1, borderRadius: 2, boxShadow: "0 4px 10px rgba(0,0,0,0.12)" } }}>
          <MenuItem onClick={() => handleStatusChange(true)}>
            <FiberManualRecordIcon sx={{ color: "#4caf50", fontSize: 14, mr: 1 }} /> Active
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange(false)}>
            <FiberManualRecordIcon sx={{ color: "#f44336", fontSize: 14, mr: 1 }} /> Inactive
          </MenuItem>
        </Menu>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar sx={{ bgcolor: "#1976d2" }}>
            <CategoryIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, "&:hover .edit-icon": { opacity: 1 } }}>
              <Typography variant="h6" fontWeight="bold">{category.name}</Typography>
              <IconButton size="small" className="edit-icon" sx={{ opacity: 0, transition: "0.2s" }} onClick={handleEditClick}>
                <FiEdit2 size={16} />
              </IconButton>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
              {category.description}
            </Typography>
          </Box>
        </Box>
      </Box>

      {}
      <CategoryEditModal open={openEditModal} onClose={handleCloseEditModal} category={category} onUpdateCategory={handleUpdateCategory} />
    </>
  );
};

export default CategoryCard;
