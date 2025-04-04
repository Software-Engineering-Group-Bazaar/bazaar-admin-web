import React from "react";
import { Typography } from "@mui/material";

const UserName = ({ userName }) => (
  <Typography variant="h5" gutterBottom>
    {userName}
  </Typography>
);

export default UserName;