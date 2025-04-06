import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Button,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import UserAvatar from "../components/UserAvatar.jsx";
import UserName from "../components/UserName.jsx";
import UserEmail from "../components/UserEmail.jsx";
import UserPhone from "../components/UserPhone.jsx";
import UserRoles from "../components/UserRoles.jsx";
import UserEditForm from "../components/UserEditForm.jsx";

const UserDetailsModal = ({ open, onClose, user, readOnly = false }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      setSelectedUser(user);
      setIsEditing(false);
    }
  }, [user]);

  if (!selectedUser) return null;

  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  const handleUserSave = (updatedUser) => {
    setSelectedUser(updatedUser);
    setIsEditing(false);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{ sx: { borderRadius: 3, p: 2 } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" fontWeight="600" color="#4B0000">
          User Details
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
            textAlign: "center",
            mt: 1,
          }}
        >
          <UserAvatar size={70} />
          <Typography variant="h6" fontWeight={600} color="#4B0000">
            <UserName userName={selectedUser.name} />
          </Typography>
          <Typography variant="body2" color="#3c4a57">
            <UserEmail email={selectedUser.email} />
          </Typography>
          <Typography variant="body2">
            <strong style={{ color: "#4B0000" }}>Username:</strong>{" "}
            {selectedUser.userName}
          </Typography>
          <Typography variant="body2">
            <strong style={{ color: "#4B0000" }}>Role:</strong>{" "}
            {selectedUser.roles[0]}
          </Typography>


          {/* {!readOnly && (
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={handleEditToggle}
                sx={{ mt: 2, textTransform: "none", fontWeight: 500 }}
              >
                {isEditing ? "Hide" : "Edit User"}
              </Button>

              {isEditing && (
                <Box sx={{ mt: 3, width: "100%" }}>
                  <Typography
                    variant="subtitle1"
                    color="#4B0000"
                    fontWeight="600"
                    gutterBottom
                  >
                    Edit User Details
                  </Typography>
                  <UserEditForm user={selectedUser} onSave={handleUserSave} />
                </Box>
              )}
            </>
          )} */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default UserDetailsModal;
