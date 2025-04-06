import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TableSortLabel,
  Typography,
  Chip,
  Box,
} from "@mui/material";
import DeleteUserButton from "./DeleteUserButton";

const getStatus = (user) => {
  if (user.isApproved === true) return "Approved";
  if (user.isApproved === false) return "Rejected";
  return "Pending";
};

const StatusChip = ({ status }) => {
  let color = "#800000";
  let bg = "#e6f7ff";
  if (status === "Approved") bg = "#e6f7ed";
  if (status === "Rejected") bg = "#ffe6e6";

  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: bg,
        color,
        fontWeight: 500,
        borderRadius: "16px",
        fontSize: "0.75rem",
        height: "24px",
      }}
      size="small"
    />
  );
};

export default function UserList({
  users,
  onDelete,
  onEdit,
  onView,
  currentPage,
  usersPerPage,
}) {
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  const handleSort = (field) => {
    const isAsc = orderBy === field && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(field);
  };

  const sortUsers = [...users].sort((a, b) => {
    const valA = orderBy === "status" ? getStatus(a) : a[orderBy];
    const valB = orderBy === "status" ? getStatus(b) : b[orderBy];

    if (!valA) return 1;
    if (!valB) return -1;

    if (typeof valA === "string") {
      return order === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return order === "asc" ? valA - valB : valB - valA;
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: 2,
        maxHeight: "calc(100vh - 220px)",
        overflowY: "auto",
        borderRadius: 2,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#fafafa" }}>
            <TableCell>#</TableCell>
            <TableCell>Pic</TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === "Username"}
                direction={order}
                onClick={() => handleSort("Username")}
              >
                Username
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === "email"}
                direction={order}
                onClick={() => handleSort("email")}
              >
                Email
              </TableSortLabel>
            </TableCell>

            <TableCell>
              <TableSortLabel
                active={orderBy === "status"}
                direction={order}
                onClick={() => handleSort("status")}
              >
                Status
              </TableSortLabel>
            </TableCell>

            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortUsers.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{
                height: 72,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f9f9f9",
                },
              }}
              onClick={() => onView(user.id)}
            >
              <TableCell>
                {(currentPage - 1) * usersPerPage + index + 1}
              </TableCell>
              <TableCell>
                <Avatar
                  alt={user.userName}
                  src={user.imageUrl}
                  sx={{ width: 40, height: 40 }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>{user.userName}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <StatusChip status={getStatus(user)} />
              </TableCell>
              <TableCell align="right">
                <DeleteUserButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user.id);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
