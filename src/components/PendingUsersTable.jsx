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
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { styled } from "@mui/material/styles";

import ApproveUserButton from "./ApproveUserButton";
import DeleteUserButton from "./DeleteUserButton";

// Stilizovanje komponenti
const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 440,
  overflow: "auto",
  borderRadius: 8,
  boxShadow: "0 4px 20px #800000",
  fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  borderCollapse: "separate",
  borderSpacing: 0,
}));

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  "& th": {
    fontWeight: 600,
    color: "#800000",
    padding: "16px 12px",
    fontSize: "0.875rem",
    borderBottom: "none",
    letterSpacing: "0.1px",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.2s ease",
  "&:nth-of-type(even)": {
    backgroundColor: "rgba(0, 0, 0, 0.02)",
  },
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04) !important",
  },
  "& td": {
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: "12px",
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontSize: "0.875rem",
  "&:not(:last-child)": {
    borderRight: `1px solid ${theme.palette.divider}`,
    color: "#800000",
  },
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  color: "black !important",
  "& .MuiTableSortLabel-icon": {
    opacity: 1,
    color: "rgba(255, 255, 255, 0.5) !important",
  },
  "&.Mui-active": {
    color: "#800000 !important",
    "& .MuiTableSortLabel-icon": {
      color: "#800000 !important",
      opacity: 1,
    },
  },
}));

const StatusChip = styled(Chip)(({ status, theme }) => {
  let backgroundColor, color;

  if (status === "Approved") {
    backgroundColor = "#e6f7ed";
    color = "#800000";
  } else if (status === "Rejected") {
    backgroundColor = "#e6f7ff";
    color = "#800000";
  } else {
    backgroundColor = "#e6f7ff";
    color = "#800000";
  }

  return {
    backgroundColor,
    color,
    fontWeight: 500,
    borderRadius: "16px",
    fontSize: "0.75rem",
    height: "24px",
  };
});

const PendingUsersTable = ({ users = [], onApprove, onDelete }) => {
  const [orderBy, setOrderBy] = useState("submitDate");
  const [order, setOrder] = useState("desc");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const compareValues = (a, b, orderBy) => {
    if (orderBy === "status") {
      const statusA =
        a.isApproved === true
          ? "Approved"
          : a.isApproved === false
          ? "Rejected"
          : "Pending";

      const statusB =
        b.isApproved === true
          ? "Approved"
          : b.isApproved === false
          ? "Rejected"
          : "Pending";

      return statusA.localeCompare(statusB);
    }

    if (!a[orderBy]) return 1;
    if (!b[orderBy]) return -1;

    if (typeof a[orderBy] === "string") {
      return a[orderBy].toLowerCase().localeCompare(b[orderBy].toLowerCase());
    }

    return a[orderBy] < b[orderBy] ? -1 : 1;
  };

  const sortedUsers = [...users].sort((a, b) => {
    return order === "asc"
      ? compareValues(a, b, orderBy)
      : compareValues(b, a, orderBy);
  });

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  return (
    <StyledTableContainer component={Paper}>
      <StyledTable stickyHeader>
        <StyledTableHead>
          <TableRow>
            <StyledTableCell>
              <Typography variant="subtitle2">#</Typography>
            </StyledTableCell>
            <StyledTableCell>
              <Typography variant="subtitle2">Picture</Typography>
            </StyledTableCell>
            <StyledTableCell>
              <StyledTableSortLabel
                active={true}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleRequestSort("name")}
                hideSortIcon={false}
              >
                <Typography variant="subtitle2">Name</Typography>
              </StyledTableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <StyledTableSortLabel
                active={true}
                direction={orderBy === "email" ? order : "asc"}
                onClick={() => handleRequestSort("email")}
                hideSortIcon={false}
              >
                <Typography variant="subtitle2">Email</Typography>
              </StyledTableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <StyledTableSortLabel
                active={true}
                direction={orderBy === "role" ? order : "asc"}
                onClick={() => handleRequestSort("role")}
                hideSortIcon={false}
              >
                <Typography variant="subtitle2">Role</Typography>
              </StyledTableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <StyledTableSortLabel
                active={true}
                direction={orderBy === "status" ? order : "asc"}
                onClick={() => handleRequestSort("status")}
                hideSortIcon={false}
              >
                <Typography variant="subtitle2">Status</Typography>
              </StyledTableSortLabel>
            </StyledTableCell>
            <StyledTableCell>
              <StyledTableSortLabel
                active={true}
                direction={orderBy === "submitDate" ? order : "asc"}
                onClick={() => handleRequestSort("submitDate")}
                hideSortIcon={false}
              >
                <Typography variant="subtitle2">Submit Date</Typography>
              </StyledTableSortLabel>
            </StyledTableCell>
            <StyledTableCell align="center">
              <Typography variant="subtitle2">Actions</Typography>
            </StyledTableCell>
          </TableRow>
        </StyledTableHead>
        <TableBody>
          {sortedUsers.map((user, index) => {
            const status =
              user.isApproved === true
                ? "Approved"
                : user.isApproved === false
                ? "Rejected"
                : "Pending";

            return (
              <StyledTableRow key={user.id}>
                <StyledTableCell>
                  <Typography variant="body2">{index + 1}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Avatar
                    alt={user.name}
                    src={user.imageUrl || ""}
                    sx={{
                      width: 38,
                      height: 38,
                      border: "2px solid #800000",
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2" fontWeight={500}>
                    {user.name}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2">{user.email}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2">{user.role}</Typography>
                </StyledTableCell>
                <StyledTableCell>
                  <StatusChip label={status} status={status} size="small" />
                </StyledTableCell>
                <StyledTableCell>
                  <Typography variant="body2">
                    {formatDate(user.submitDate)}
                  </Typography>
                </StyledTableCell>
                <StyledTableCell align="center">
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <ApproveUserButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onApprove(user.id);
                      }}
                    />
                    <DeleteUserButton
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(user.id);
                      }}
                    />
                  </Box>
                </StyledTableCell>
              </StyledTableRow>
            );
          })}
          {users.length === 0 && (
            <StyledTableRow>
              <StyledTableCell colSpan={8} align="center" sx={{ py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No pending users found.
                </Typography>
              </StyledTableCell>
            </StyledTableRow>
          )}
        </TableBody>
      </StyledTable>
    </StyledTableContainer>
  );
};

export default PendingUsersTable;
