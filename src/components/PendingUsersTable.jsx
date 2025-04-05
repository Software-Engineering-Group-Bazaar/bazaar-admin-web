import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from '@mui/material';

import ApproveUserButton from './ApproveUserButton';
import DeleteUserButton from './DeleteUserButton';


const PendingUsersTable = ({ users, onApprove, onDelete }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell>
            <TableCell>Picture</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Role</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f5f5f5' }
              }}
            >
              <TableCell>{index + 1}</TableCell>
              <TableCell>
                <Avatar alt={user.name} src={user.imageUrl || ''} />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.role}</TableCell>
              <TableCell align="right">
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
              </TableCell>
            </TableRow>
          ))}
          {users.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No pending users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default PendingUsersTable;
