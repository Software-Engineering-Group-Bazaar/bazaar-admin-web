// PendingUsersTable.jsx
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
import axios from 'axios';
import { apiApproveUserAsync, apiDeleteUserAsync } from "../api/api";
import { useTranslation } from 'react-i18next'; 

var baseURL = import.meta.env.VITE_API_BASE_URL


const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  maxHeight: 840,
  overflow: "auto",
  borderRadius: 8,
  boxShadow: "0 2px 8px #800000",
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  transition: "background-color 0.2s ease",
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "rgba(0, 0, 0, 0.04)",
  },
}));

const PendingUsersTable = ({
  users = [],
  onApprove,
  onDelete,
  onView,
  currentPage,
  usersPerPage,
}) => {
  const { t } = useTranslation();
  const [orderBy, setOrderBy] = useState("submitDate");
  const [order, setOrder] = useState("desc");

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const compareValues = (a, b, orderBy) => {
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
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>{t('common.picture')}</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "name"}
                direction={order}
                onClick={() => handleRequestSort("name")}
              >
                {t('common.name')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "email"}
                direction={order}
                onClick={() => handleRequestSort("email")}
              >
                {t('common.email')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === "role"}
                direction={order}
                onClick={() => handleRequestSort("role")}
              >
                {t('common.role')}
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedUsers.map((user, index) => (
            <StyledTableRow key={user.id} onClick={() => onView(user.id)}>
              <TableCell>
                {(currentPage - 1) * usersPerPage + index + 1}
              </TableCell>
              <TableCell>
                <Avatar
                  alt={user.userName}
                  src={user.imageUrl}
                  sx={{ width: 38, height: 38, border: "2px solid #800000" }}
                />
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {user.userName}
                </Typography>
              </TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.roles ? user.roles[0] : "?"}</TableCell>


              <TableCell align="center">
                <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                  <ApproveUserButton
                    onClick={async (e) => {
                      e.preventDefault();
                      onApprove(user.id);

                      //await apiApproveUserAsync(user.id);
                        // const token = localStorage.getItem("token");
                      
                        // if (token) {
                        //   axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                        // }
                      
                        // const Payload = {
                        //   userId:user.id
                        // };
                      
                        // axios

                        //   .post(`${baseURL}/api/Admin/users/approve`, Payload)

                        //   .then((response) => {
                        //     console.log("User approved successfully:", response.data);
                        //     // optionally redirect or clear form inputs
                        //   })
                        //   .catch((error) => {
                        //     console.error("Error approving user:", error);
                        //   });
                      }
                    }
                  />
                  <DeleteUserButton
                    onClick={async (e) => {
                      e.stopPropagation();
                      onDelete(user.id);
                      await apiDeleteUserAsync(user.id)

                      // const token = localStorage.getItem("token");
                      
                      //   if (token) {
                      //     axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                      //   }
                      
                      //   const Payload = {
                      //     userId:user.id
                      //   };
                      // axios
                      // .delete(`http://localhost:5054/api/Admin/users/${user.id}`)
                      // .then((response) => {
                      //   console.log("User deleted successfully:", response.data);
                      //   // optionally redirect or clear form inputs
                      // })
                      // .catch((error) => {
                      //   console.error("Error deleting user:", error);
                      // });
                    }}
                  />
                </Box>
              </TableCell>
            </StyledTableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                {t('common.noPendingUsersFound')}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
};

export default PendingUsersTable;
