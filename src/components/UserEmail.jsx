import React from "react";
import { Typography } from "@mui/material";

const UserEmail = ({ email }) => (
  <Typography variant="body1" color="textSecondary">
    {email}
  </Typography>
);

export default UserEmail;