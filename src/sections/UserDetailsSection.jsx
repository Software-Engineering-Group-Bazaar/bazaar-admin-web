import { Card, CardContent, Typography, Button, Box } from "@mui/material";
import React, { useState, useEffect } from "react";

import UserAvatar from "../components/UserAvatar.jsx";
import UserName from "../components/UserName.jsx";
import UserEmail from "../components/UserEmail.jsx";
import UserPhone from "../components/UserPhone.jsx";
import UserRoles from "../components/UserRoles.jsx";
import UserEditForm from "../components/userEditForm.jsx";

import { getUsers, updateUser } from "../data/usersDetails.js";
import { useTranslation } from 'react-i18next';

const UserDetailsSection = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    const user = getUsers()[0];
    setSelectedUser(user);
  }, []);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  const handleUserSave = (updatedUser) => {
    setSelectedUser(updatedUser);
    setIsEditing(false);
  };

  if (!selectedUser) {
    return <Typography component="div">{t('common.loadingUserData')}</Typography>;
  }

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
      <Card sx={{ maxWidth: 400, boxShadow: 3, textAlign: "center" }}>
        <CardContent>
          <UserAvatar />

          <Typography variant="h6" component="div" sx={{ mt: 2 }}>
            <UserName userName={selectedUser.name} />
          </Typography>

          <Typography variant="body1" component="p" sx={{ mt: 1 }}>
            <UserEmail email={selectedUser.email} />
          </Typography>

          <Typography variant="body1" component="p" sx={{ mt: 1 }}>
            <UserPhone phoneNumber={selectedUser.phoneNumber} />
          </Typography>

          <Typography variant="body1" component="p" sx={{ mt: 1 }}>
            <UserRoles roles={selectedUser.role} />
          </Typography>

          <Button
            variant="outlined"
            color={isEditing ? "error" : "primary"}
            onClick={(e) => {
              e.stopPropagation();
              handleEditToggle();
            }}
            sx={{ mt: 2 }}
          >
            {isEditing ? "Hide" : "Edit User"}
          </Button>

          {isEditing && (
            <UserEditForm user={selectedUser} onSave={handleUserSave} />
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDetailsSection;
