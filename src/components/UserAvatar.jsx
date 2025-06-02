import React from "react";
import { Avatar } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserAvatar = () => (
  <Avatar sx={{ width: 80, height: 80, margin: "0 auto" }}>
    <AccountCircleIcon sx={{ fontSize: 60 }} />
  </Avatar>
);

export default UserAvatar;