import React, { useState } from 'react';
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
  IconButton,
  TextField,
  Select,
  MenuItem,
  Tooltip,
} from '@mui/material';
import DeleteUserButton from './DeleteUserButton';
import { FiEdit2 } from 'react-icons/fi';
import { FaUser, FaUserSlash } from 'react-icons/fa';
import { MdDone } from 'react-icons/md';
import { useTranslation } from 'react-i18next'; 

const getStatus = (user) => {
  if (user.isApproved === true) return 'Approved';
  if (user.isApproved === false) return 'Rejected';
  return 'Pending';
};

const StatusChip = ({ status }) => {
  let color = '#800000';
  let bg = '#e6f7ff';
  if (status === 'Approved') bg = '#e6f7ed';
  if (status === 'Rejected') bg = '#ffe6e6';

  return (
    <Chip
      label={status}
      sx={{
        backgroundColor: bg,
        color,
        fontWeight: 500,
        borderRadius: '16px',
        fontSize: '0.75rem',
        height: '24px',
      }}
      size='small'
    />
  );
};

const ActiveChip = ({ value }) => {
  const isActive = value === true;
  return (
    <Chip
      label={isActive ? 'Online' : 'Offline'}
      size='small'
      sx={{
        backgroundColor: isActive ? '#e8f5e9' : '#ffebee',
        color: isActive ? '#388e3c' : '#d32f2f',
        fontWeight: 500,
        fontSize: '0.75rem',
        borderRadius: '16px',
        height: '24px',
        textTransform: 'capitalize',
      }}
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
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const { t } = useTranslation();
  const handleSort = (field) => {
    const isAsc = orderBy === field && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(field);
  };

  const handleEditClick = (user) => {
    setEditingUserId(user.id);
    setEditedUser({ ...user });
  };

  const handleSaveEdit = () => {
    onEdit(editedUser);
    setEditingUserId(null);
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prev) => ({ ...prev, [name]: value }));
  };

  const sortUsers = [...users].sort((a, b) => {
    const valA = orderBy === 'status' ? getStatus(a) : a[orderBy];
    const valB = orderBy === 'status' ? getStatus(b) : b[orderBy];

    if (!valA) return 1;
    if (!valB) return -1;

    if (typeof valA === 'string') {
      return order === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }

    return order === 'asc' ? valA - valB : valB - valA;
  });

  return (
    <TableContainer
      component={Paper}
      sx={{
        mt: 2,
        maxHeight: 'calc(100vh - 220px)',
        overflowY: 'auto',
        borderRadius: 2,
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#fafafa' }}>
            <TableCell>#</TableCell>
            <TableCell>{t('common.picture')}</TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'userName'}
                direction={order}
                onClick={() => handleSort('userName')}
              >
                {t('common.username')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'email'}
                direction={order}
                onClick={() => handleSort('email')}
              >
                {t('common.email')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'role'}
                direction={order}
                onClick={() => handleSort('role')}
              >
                {t('common.role')}
              </TableSortLabel>
            </TableCell>
            <TableCell>
              <TableSortLabel
                active={orderBy === 'isActive'}
                direction={order}
                onClick={() => handleSort('isActive')}
              >
                {t('common.active')}
              </TableSortLabel>
            </TableCell>
            {/* <TableCell>
              <TableSortLabel
                active={orderBy === "lastActive"}
                direction={order}
                onClick={() => handleSort("lastActive")}
              >
                Last Active
              </TableSortLabel>
            </TableCell> */}
            {/* <TableCell>
              <TableSortLabel
                active={orderBy === 'status'}
                direction={order}
                onClick={() => handleSort('status')}
              >
                Status
              </TableSortLabel>
            </TableCell> */}
            <TableCell align='right'>{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {sortUsers.map((user, index) => {
            const isEditing = editingUserId === user.id;
            return (
              <TableRow
                key={user.id}
                sx={{ height: 72, '&:hover': { backgroundColor: '#f9f9f9' } }}
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

                <TableCell>
                  {isEditing ? (
                    <TextField
                      name='userName'
                      variant='standard'
                      value={editedUser.userName}
                      onChange={handleFieldChange}
                    />
                  ) : (
                    user.userName
                  )}
                </TableCell>

                <TableCell>
                  {isEditing ? (
                    <TextField
                      name='email'
                      variant='standard'
                      value={editedUser.email}
                      onChange={handleFieldChange}
                    />
                  ) : (
                    user.email
                  )}
                </TableCell>

                <TableCell>
                  {isEditing ? (
                    <Select
                      name='role'
                      value={editedUser.role}
                      onChange={handleFieldChange}
                      variant='standard'
                    >
                      <MenuItem value='Buyer'>{t('common.buyer')}</MenuItem>
                      <MenuItem value='Seller'>{t('common.seller')}</MenuItem>
                    </Select>
                  ) : (
                    user.roles[0]
                  )}
                </TableCell>

                <TableCell>
                  {isEditing ? (
                    <Select
                      name='isActive'
                      value={!editedUser.isActive}
                      onChange={(e) =>
                        setEditedUser((prev) => ({
                          ...prev,
                          isActive: e.target.value === 'true',
                        }))
                      }
                      variant='standard'
                    >
                      <MenuItem value='true'>{t('common.online')}</MenuItem>
                      <MenuItem value='false'>{t('common.offline')}</MenuItem>
                    </Select>
                  ) : (
                    <ActiveChip value={user.isActive} />
                  )}
                </TableCell>

                {/* <TableCell>{user.lastActive}</TableCell>
                <TableCell>
                  <StatusChip status={getStatus(user)} />
                </TableCell> */}

                <TableCell align='right'>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}
                  >
                    <Tooltip title='Toggle Status'>
                      <IconButton
                        size='small'
                        onClick={(e) => {
                          e.stopPropagation();
                          onEdit({
                            ...user,
                            isActive: !user.isActive,
                            toggleAvailabilityOnly: true, // da backend zna
                          });
                        }}
                      >
                        {user.isActive ? (
                          <FaUser size={16} color='#4caf50' />
                        ) : (
                          <FaUserSlash size={16} color='#f44336' />
                        )}
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={isEditing ? 'Save' : 'Edit'}>
                      <IconButton
                        size='small'
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isEditing) {
                            handleSaveEdit();
                          } else {
                            handleEditClick(user);
                          }
                        }}
                      >
                        {isEditing ? (
                          <MdDone size={18} color='#4caf50' />
                        ) : (
                          <FiEdit2 size={16} />
                        )}
                      </IconButton>
                    </Tooltip>

                    <Tooltip title='Delete'>
                      <DeleteUserButton
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(user.id);
                        }}
                      />
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
