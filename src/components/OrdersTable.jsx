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
  IconButton,
  Tooltip,
} from '@mui/material';
import { FaTrash } from 'react-icons/fa6';
import CircleIcon from '@mui/icons-material/FiberManualRecord';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return '#0288d1'; // plava
    case 'rejected':
      return '#d32f2f'; // crvena
    case 'ready':
      return '#388e3c'; // zelena
    case 'sent':
      return '#fbc02d'; // žuta
    case 'delivered':
      return '#1976d2'; // tamno plava
    case 'cancelled':
      return '#b71c1c'; // tamno crvena
    default:
      return '#9e9e9e'; // siva
  }
};

const OrdersTable = ({
  orders,
  sortField,
  sortOrder,
  onSortChange,
  onOrderClick,
  onDelete,
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
  { label: 'Delivery Address', field: 'deliveryAddress' },
  { label: 'Receiving Address', field: 'receivingAddress' },
  { label: 'Status', field: 'status' },
  { label: 'Total', field: 'totalPrice' },
  { label: 'Created', field: 'createdAt' },
  { label: '', field: 'actions' },
];


  return (
    <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f6c343', height: 28 }}>
            {columns.map((col) => (
              <TableCell
                key={col.field}
                onClick={() => col.field !== 'actions' && handleSort(col.field)}
                sx={{
                  fontWeight: 'bold',
                  color: '#000',
                  cursor: col.field !== 'actions' ? 'pointer' : 'default',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    color: col.field !== 'actions' ? '#444' : undefined,
                    '.sort-icon': { opacity: 1, color: '#444' },
                  },
                }}
              >
                <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  {col.label}
                  {col.field !== 'actions' && (
                    <Box
                      className='sort-icon'
                      sx={{
                        ml: 0.3,
                        opacity: sortField === col.field ? 1 : 0,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      {sortOrder === 'asc' ? (
                        <ArrowDropUpIcon fontSize='small' />
                      ) : (
                        <ArrowDropDownIcon fontSize='small' />
                      )}
                    </Box>
                  )}
                </Box>
              </TableCell>
            ))}
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
              <TableCell>{order.buyerName}</TableCell>
              <TableCell>{order.storeName}</TableCell>

              <TableCell>
  {order.deliveryAddress?.address ?? 'null'}, {order.deliveryAddress?.city ?? 'null'}
</TableCell>
<TableCell>
  {order.receivingAddress?.address ?? 'null'}, {order.receivingAddress?.city ?? 'null'}
</TableCell>

              <TableCell>
                <Chip
                  label={order.status}
                  size='small'
                  sx={{
                    backgroundColor: getStatusColor(order.status.toLowerCase()),
                    color: '#fff',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    px: 1,
                    height: '24px',
                    borderRadius: '10px',
                    textTransform: 'capitalize',
                  }}
                />
              </TableCell>
              <TableCell>${order.totalPrice}</TableCell>
              <TableCell>
                {new Date(order.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </TableCell>
              <TableCell align='right'>
                <Tooltip title='Delete Order'>
                  <IconButton
                    size='small'
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(order.id);
                    }}
                  >
                    <FaTrash />
                  </IconButton>
                </Tooltip>
              </TableCell>
            </TableRow>


          ))}
        </TableBody>
      </Table>

  

    </TableContainer>
  );
};

export default OrdersTable;
