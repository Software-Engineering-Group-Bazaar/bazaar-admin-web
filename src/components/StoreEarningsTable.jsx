import React, { useState, useMemo } from 'react';
import {
  Table, TableHead, TableRow, TableCell, TableBody,
  TablePagination, TableSortLabel, Paper, Box
} from '@mui/material';

const StoreEarningsTable = ({ data }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 5;
  const [orderBy, setOrderBy] = useState('storeRevenue');
  const [order, setOrder] = useState('desc');

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) =>
      (order === 'asc' ? a[orderBy] - b[orderBy] : b[orderBy] - a[orderBy])
    );
  }, [data, order, orderBy]);

  const paginatedData = sortedData.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  return (
    <Paper sx={{ mt: 5, p: 2 }}>
      <Box sx={{ overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#ffffba' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Store Name</TableCell>
              <TableCell sortDirection={orderBy === 'storeRevenue' ? order : false} sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'storeRevenue'}
                  direction={order}
                  onClick={() => handleSort('storeRevenue')}
                >
                  Store Revenue
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'adminProfit' ? order : false} sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'adminProfit'}
                  direction={order}
                  onClick={() => handleSort('adminProfit')}
                >
                  Admin Profit
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === 'taxRate' ? order : false} sx={{ fontWeight: 'bold' }}>
                <TableSortLabel
                  active={orderBy === 'taxRate'}
                  direction={order}
                  onClick={() => handleSort('taxRate')}
                >
                  Tax Rate (%)
                </TableSortLabel>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow key={row.storeId}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{(row.storeRevenue ?? 0).toFixed(2)} $</TableCell>
                <TableCell>{(row.adminProfit ?? 0).toFixed(2)} $</TableCell>
                <TableCell>{(row.taxRate ?? 0).toFixed(2)} %</TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
      <TablePagination
        rowsPerPageOptions={[]}
        component='div'
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(e, newPage) => setPage(newPage)}
      />
    </Paper>
  );
};

export default StoreEarningsTable;
