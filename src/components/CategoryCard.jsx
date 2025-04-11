import React, { useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Chip,
  TextField,
} from "@mui/material";
import CategoryIcon from "@mui/icons-material/Category";
import { FiEdit2, FiTrash } from "react-icons/fi";
import ConfirmDeleteModal from "@components/ConfirmDeleteModal";

const CategoryCard = ({ category, onUpdateCategory, onDeleteCategory }) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);

  const handleEditToggle = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    if (editedName.trim() !== "" && editedName !== category.name) {
      onUpdateCategory({ ...category, name: editedName });
    }
  };

  const handleDelete = () => {
    setOpenDeleteModal(true);
  };

  const confirmDelete = () => {
    onDeleteCategory(category.id);
    setOpenDeleteModal(false);
  };

  return (
    <>
      <Box
        sx={{
          width: 220,
          p: 2,
          borderRadius: 3,
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          backgroundColor: "#fff",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          minHeight: 140,
        }}
      >
        {/* Delete Icon */}
        <IconButton
          onClick={handleDelete}
          sx={{ position: "absolute", top: 14, right: 10 }}
        >
          <FiTrash size={16} color="#f44336" />
        </IconButton>

        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Avatar
            sx={{ bgcolor: category.type === "store" ? "#1976d2" : "#ffb300" }}
          >
            <CategoryIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                "&:hover .edit-icon": { opacity: 1 },
              }}
            >
              {isEditing ? (
                <TextField
                  variant="standard"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onBlur={handleBlur}
                  autoFocus
                  InputProps={{
                    disableUnderline: true,
                    sx: {
                      padding: 0,
                      fontSize: "1rem",
                      fontWeight: "bold",
                      borderBottom: "2px solid #1976d2",
                      width: `${editedName.length + 1}ch`,
                      transition: "border 0.2s",
                    },
                  }}
                />
              ) : (
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  fontSize={16}
                  sx={{
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  {category.name}
                  <IconButton
                    size="small"
                    className="edit-icon"
                    sx={{
                      opacity: 0,
                      padding: "2px",
                      transition: "opacity 0.2s",
                    }}
                    onClick={handleEditToggle}
                  >
                    <FiEdit2 size={16} />
                  </IconButton>
                </Typography>
              )}
            </Box>

            {/* Label */}
            <Chip
              label={category.type === "store" ? "Store" : "Product"}
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: category.type === "store" ? "#1976d2" : "#ffb300",
                color: "#fff",
                fontWeight: 500,
                fontSize: "0.75rem",
                textTransform: "uppercase",
              }}
            />
          </Box>
        </Box>

        {/* Decorative wave */}
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            overflow: "hidden",
            lineHeight: 0,
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12,
          }}
        >
          <svg
            viewBox="0 0 500 80"
            preserveAspectRatio="none"
            style={{
              height: 50,
              width: "100%",
              display: "block",
            }}
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1976d2" />
                <stop offset="100%" stopColor="#ffb300" />
              </linearGradient>
            </defs>
            <path
              d="M0,40 C150,80 350,0 500,40 L500,80 L0,80 Z"
              fill="url(#gradient)"
            />
          </svg>
        </Box>
      </Box>

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        onConfirm={confirmDelete}
        categoryName={category.name}
      />
    </>
  );
};

export default CategoryCard;
