import React from "react";
import { Typography } from "@mui/material";

const UserPhone = ({ phoneNumber }) => (
  <Typography variant="body1" sx={{ mt: 1 }}>
    <strong>Telefon:</strong> {phoneNumber || "N/A"}
  </Typography>
);

export default UserPhone;