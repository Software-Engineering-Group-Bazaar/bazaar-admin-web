import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";

const OrdersTable = ({ orders, sortField, sortOrder, onOrderClick }) => {
  const [orderList, setOrderList] = useState([]);
  const [editingOrderId, setEditingOrderId] = useState(null);

  useEffect(() => {
    setOrderList(orders);
  }, [orders]);

  const sortedOrders = orderList.sort((a, b) => {
    if (!a[sortField] || !b[sortField]) return 0;
    if (sortOrder === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    } else {
      return a[sortField] < b[sortField] ? 1 : -1;
    }
  });

  const handleEditChange = (orderId, field, value) => {
    setOrderList((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, [field]: value } : order
      )
    );
  };

  const handleProductChange = (orderId, index, field, value) => {
    setOrderList((prevOrders) =>
      prevOrders.map((order) => {
        if (order.id === orderId) {
          const updatedProducts = [...order.products];
          updatedProducts[index] = {
            ...updatedProducts[index],
            [field]: value,
          };
          return { ...order, products: updatedProducts };
        }
        return order;
      })
    );
  };

  const handleIsCancelledChange = (orderId, value) => {
    setOrderList((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? { ...order, isCancelled: value === "Yes", status: value === "Yes" ? "cancelled" : order.status }
          : order
      )
    );
  };

  const handleEditClick = (orderId) => {
    setEditingOrderId(orderId);
  };

  const handleSaveEdit = (orderId) => {
    setEditingOrderId(null);
  };

  return (
    <Box>
      <TableContainer component={Paper} sx={{ backgroundColor: '#ffffff' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#004ba0' }}>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>ID</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Buyer ID</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Store ID</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Delivery Address</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Created At</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Total Price</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Product Prices</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Product Quantities</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Cancelled</TableCell>
              <TableCell sx={{ color: '#ffffff', fontWeight: 'bold' }}>Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedOrders.map((order) => (
              <TableRow key={order.id} sx={{ backgroundColor: '#ffffff', '&:hover': { backgroundColor: '#f0f0f0' } }}>
                {}
                <TableCell
                  sx={{ cursor: 'pointer', color: '#1976d2', fontWeight: 'bold' }}
                  onClick={() => onOrderClick(order)}
                >
                  {order.id}
                </TableCell>

                {}
                <TableCell>
                  {editingOrderId === order.id ? (
                    <TextField
                      value={order.status}
                      onChange={(e) => handleEditChange(order.id, "status", e.target.value)}
                      fullWidth
                      variant="standard"
                      margin="dense"
                    />
                  ) : (
                    order.status
                  )}
                </TableCell>

                {}
                <TableCell>{order.buyerId}</TableCell>

                {}
                <TableCell>{order.storeId}</TableCell>

                {}
                <TableCell>
                  {editingOrderId === order.id ? (
                    <TextField
                      value={order.deliveryAddress}
                      onChange={(e) => handleEditChange(order.id, "deliveryAddress", e.target.value)}
                      fullWidth
                      variant="standard"
                      margin="dense"
                    />
                  ) : (
                    order.deliveryAddress
                  )}
                </TableCell>

                {/* Created At */}
                <TableCell>
                  {editingOrderId === order.id ? (
                    <TextField
                      type="datetime-local"
                      value={new Date(order.createdAt).toISOString().slice(0,16)}
                      onChange={(e) => handleEditChange(order.id, "createdAt", new Date(e.target.value).toISOString())}
                      fullWidth
                      variant="standard"
                      margin="dense"
                    />
                  ) : (
                    new Date(order.createdAt).toLocaleString()
                  )}
                </TableCell>

                {/* Total Price */}
                <TableCell>
                  {editingOrderId === order.id ? (
                    <TextField
                      type="number"
                      value={order.totalPrice}
                      onChange={(e) => handleEditChange(order.id, "totalPrice", parseFloat(e.target.value))}
                      fullWidth
                      variant="standard"
                      margin="dense"
                    />
                  ) : (
                    `$${order.totalPrice}`
                  )}
                </TableCell>

                {/* Product Prices */}
                <TableCell>
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {editingOrderId === order.id ? (
                        <TextField
                          type="number"
                          value={p.price}
                          onChange={(e) => handleProductChange(order.id, i, "price", parseFloat(e.target.value))}
                          fullWidth
                          variant="standard"
                          margin="dense"
                        />
                      ) : (
                        `$${p.price}`
                      )}
                    </div>
                  ))}
                </TableCell>

                {/* Product Quantities */}
                <TableCell>
                  {order.products.map((p, i) => (
                    <div key={i}>
                      {editingOrderId === order.id ? (
                        <TextField
                          type="number"
                          value={p.quantity}
                          onChange={(e) => handleProductChange(order.id, i, "quantity", parseInt(e.target.value))}
                          fullWidth
                          variant="standard"
                          margin="dense"
                        />
                      ) : (
                        p.quantity
                      )}
                    </div>
                  ))}
                </TableCell>

                {/* Is Cancelled */}
                <TableCell>
                  {editingOrderId === order.id ? (
                    <Select
                      value={order.isCancelled ? "Yes" : "No"}
                      onChange={(e) => handleIsCancelledChange(order.id, e.target.value)}
                      fullWidth
                      variant="standard"
                      margin="dense"
                    >
                      <MenuItem value="No">No</MenuItem>
                      <MenuItem value="Yes">Yes</MenuItem>
                    </Select>
                  ) : (
                    order.isCancelled ? "Yes" : "No"
                  )}
                </TableCell>

                {/* Edit / Save Dugme */}
                <TableCell>
                  {editingOrderId === order.id ? (
                    <Button
                      onClick={() => handleSaveEdit(order.id)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      Save
                    </Button>
                  ) : (
                    <IconButton onClick={() => handleEditClick(order.id)}>
                      <EditIcon />
                    </IconButton>
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrdersTable;
