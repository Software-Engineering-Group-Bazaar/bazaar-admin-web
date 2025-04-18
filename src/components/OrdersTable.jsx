import React from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CircleIcon from '@mui/icons-material/FiberManualRecord';

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'active':
      return 'success'; 
    case 'cancelled':
      return 'error'; 
    case 'pending':
      return 'warning'; 
    case 'requested':
      return 'info'; 
    case 'confirmed':
      return 'primary'; 
    case 'ready':
      return 'success'; 
    case 'sent':
      return 'info'; 
    case 'delivered':
      return 'secondary'; 
    default:
      return 'default';
  }
};


const OrdersTable = ({
  orders,
  sortField,
  sortOrder,
  onSortChange,
  onOrderClick,
}) => {
  const handleSort = (field) => {
    const order = field === sortField && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(field, order);
  };

  const formatOrderId = (id) => `#${String(id).padStart(5, '0')}`;

  const columns = [
    { label: 'Order #', field: 'id' },
    { label: 'Buyer', field: 'buyerName' },
    { label: 'Store', field: 'storeName' },
    { label: 'Status', field: 'status' },
    { label: 'Total', field: 'totalPrice' },
    { label: 'Created', field: 'createdAt' },
  ];

  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f6c343', height: 28 }}>
            {columns.map((col) => {
              const isSorted = sortField === col.field;
              const isAsc = sortOrder === 'asc';

              return (
                <TableCell
                  key={col.field}
                  onClick={() => handleSort(col.field)}
                  sx={{
                    fontWeight: 'bold',
                    color: '#000',
                    cursor: 'pointer',
                    userSelect: 'none',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      color: '#444',
                      '.sort-icon': {
                        opacity: 1,
                        color: '#444',
                      },
                    },
                  }}
                >
                  <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                    {col.label}
                    <Box
                      className='sort-icon'
                      sx={{
                        ml: 0.3,
                        display: 'inline-flex',
                        alignItems: 'center',
                        opacity: isSorted ? 1 : 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {isAsc ? (
                        <ArrowDropUpIcon fontSize='small' />
                      ) : (
                        <ArrowDropDownIcon fontSize='small' />
                      )}
                    </Box>
                  </Box>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow
              key={order.id}
              hover
              sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#fdf6e3' },
              }}
              onClick={() => onOrderClick(order)}
            >
              <TableCell sx={{ color: '#1976d2', fontWeight: 600 }}>
                {formatOrderId(order.id)}
              </TableCell>
              <TableCell sx={{ color: '#4a0404' }}>{order.buyerName}</TableCell>
              <TableCell sx={{ color: '#4a0404' }}>{order.storeName}</TableCell>
              <TableCell>
                <Chip
                  label={
                    order.status.charAt(0).toUpperCase() + order.status.slice(1)
                  }
                  color={getStatusColor(order.status)}
                  icon={<CircleIcon sx={{ fontSize: 10, ml: 0.5 }} />}
                  sx={{
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    pl: 0.5,
                    borderRadius: '10px',
                    color: '#fff',
                    height: '24px',
                  }}
                />
              </TableCell>
              <TableCell sx={{ color: '#4a0404' }}>
                ${order.totalPrice}
              </TableCell>
              <TableCell sx={{ color: '#4a0404' }}>
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
