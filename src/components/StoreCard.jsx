import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import { FaPaperclip } from 'react-icons/fa6';
import {
  apiUpdateStoreAsync,
  apiDeleteStoreAsync,
  apiGetStoreCategoriesAsync,
  apiExportProductsToCSVAsync,
  apiExportProductsToExcelAsync,
  apiCreateProductAsync,
  apiGetMonthlyStoreRevenueAsync
} from '@api/api';
import AddProductModal from '@components/NewProductModal';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditStoreModal from '@components/EditStoreModal';
import ConfirmDeleteStoreModal from '@components/ConfirmDeleteStoreModal';
import StoreProductsList from '@components/StoreProductsList';
import * as XLSX from 'xlsx';

const StoreCard = ({ store }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [isOnline, setIsOnline] = useState(store.isActive);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef();
  const [parsedProducts, setParsedProducts] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const openStatus = Boolean(anchorEl);
  const openMenu = Boolean(menuAnchor);

  useEffect(() => {
    apiGetStoreCategoriesAsync().then(setCategories);
    const rez = apiGetMonthlyStoreRevenueAsync(store.id);
    setRevenue(rez);
  }, []);

  const handleStatusClick = (e) => setAnchorEl(e.currentTarget);
  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    const matchedCategory = categories.find(
      (cat) => cat.name === store.categoryName
    );
    if (!matchedCategory) return;

    const updatedStore = {
      ...store,
      isActive: newStatus,
      categoryId: matchedCategory.id,
    };

    const res = await apiUpdateStoreAsync(updatedStore);
    if (res?.success || res?.status === 201) setIsOnline(newStatus);
    setUpdating(false);
    setAnchorEl(null);
  };

  const handleExportCSV = async () => {
    const response = await apiExportProductsToCSVAsync(store.id);
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Proizvodi.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportExcel = async () => {
    const response = await apiExportProductsToExcelAsync(store.id);
    console.log('PREOVJERA', response.data);

    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'Proizvodi.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMenuClick = (e) => setMenuAnchor(e.currentTarget);
  const handleMenuClose = () => setMenuAnchor(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isCSV = fileName.endsWith('.csv');
    const reader = new FileReader();

    reader.onload = (evt) => {
      const fileContent = evt.target.result;
      let workbook;

      if (isCSV) {
        workbook = XLSX.read(fileContent, { type: 'string' });
      } else {
        workbook = XLSX.read(fileContent, { type: 'binary' });
      }

      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setParsedProducts(jsonData);
      handleBulkCreate(jsonData);
    };

    if (isCSV) {
      reader.readAsText(file); // CSV kao tekst
    } else {
      reader.readAsBinaryString(file); // Excel kao binarni
    }
  };

  const handleBulkCreate = async (products) => {
    let success = 0;
    let fail = 0;

    for (const product of products) {
      console.log('Creating product:', product);
      try {
        const res = await apiCreateProductAsync({
          ...product,
          storeId: store.id,
        });
        console.log('Response from apiCreateProductAsync:', res);

        // Ovo je sad ispravno
        res?.status === 201 ? success++ : fail++;
      } catch (error) {
        console.error('Error in bulk create:', error);
        fail++;
      }
    }
    window.location.reload();

    console.log(`✅ ${success} created, ❌ ${fail} failed`);
  };

  return (
    <>
      <Box
        sx={{
          width: 270,
          p: 2.5,
          borderRadius: 3,
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          backgroundColor: '#fff',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          minHeight: 160,
        }}
      >
        {/* Status & Delete */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
          }}
        >
          <IconButton onClick={() => setOpenDeleteModal(true)} sx={{ p: 0.5 }}>
            <FiTrash size={14} color='#999' />
          </IconButton>
          <IconButton
            onClick={handleStatusClick}
            disabled={updating}
            sx={{ p: 0.5 }}
          >
            <FiberManualRecordIcon
              sx={{ fontSize: 14, color: isOnline ? '#4caf50' : '#f44336' }}
            />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={openStatus}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => handleStatusChange(true)}>
            🟢 Online
          </MenuItem>
          <MenuItem onClick={() => handleStatusChange(false)}>
            🔴 Offline
          </MenuItem>
        </Menu>

        {/* Header */}
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: '#6A1B9A', width: 40, height: 40 }}>
            <StoreIcon />
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant='h6'
              fontWeight='bold'
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                position: 'relative',
                '&:hover .edit-icon': { opacity: 1 },
              }}
            >
              {store.name}
              <IconButton
                className='edit-icon'
                size='small'
                onClick={() => setOpenEditModal(true)}
                sx={{ p: 0, opacity: 0, transition: 'opacity 0.2s' }}
              >
                <FiEdit2 size={16} />
              </IconButton>
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <LocationOnIcon sx={{ fontSize: 14, color: '#607d8b' }} />
              <Typography
                variant='body2'
                sx={{ fontSize: '0.75rem', color: '#607d8b' }}
              >
                {store.address}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Description */}
        <Typography
          variant='body2'
          color='text.secondary'
          sx={{
            mt: 1,
            fontSize: '0.85rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {store.description}
        </Typography>
        
        <Typography
         variant="body2"
         color="text.secondary"
         sx={{
          mt: 1,
          fontSize: '0.85rem',
          }}
        >
        Tax: {store.tax}
        </Typography>

        <Typography
         variant="body2"
         color="text.secondary"
         sx={{
          mt: 1,
          fontSize: '0.85rem',
          }}
        >
        Total monthly income: {revenue.totalIncome}
        </Typography>

        <Typography
         variant="body2"
         color="text.secondary"
         sx={{
          mt: 1,
          fontSize: '0.85rem',
          }}
        >
        Taxed monthly income: {revenue.taxedIncome}
        </Typography>

        {/* Buttons */}
        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center' }}>
          <Box
            sx={{
              display: 'flex',
              width: '100%',
              borderRadius: '8px',
              mt: 1,
              overflow: 'hidden',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            }}
          >
            <Button
              variant='contained'
              onClick={() => setOpenModal(true)}
              sx={{
                flexGrow: 1,
                backgroundColor: '#2e3a45',
                color: '#fff',
                textTransform: 'none',
                fontWeight: 600,
                borderRadius: 0,
                px: 2,
                '&:hover': {
                  backgroundColor: '#233039',
                },
              }}
            >
              Add Product
            </Button>
            <Box
              onClick={handleMenuClick}
              sx={{
                width: 48,
                backgroundColor: '#e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: '#d5d5d5',
                },
              }}
            >
              <FaPaperclip size={16} color='#555' />
            </Box>
            <input
              type='file'
              ref={fileInputRef}
              accept='.csv, .xlsx'
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
          </Box>
        </Box>

        <Menu
          anchorEl={menuAnchor}
          open={openMenu}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={() => fileInputRef.current.click()}>
            📥 Import (CSV/Excel)
          </MenuItem>
          <MenuItem onClick={handleExportCSV}>📤 Export CSV</MenuItem>
          <MenuItem onClick={handleExportExcel}>📤 Export Excel</MenuItem>
        </Menu>
        {/* Products List */}
        <StoreProductsList storeId={store.id} />
      </Box>

      <AddProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        storeID={store.id}
      />
      <EditStoreModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        store={store}
      />
      <ConfirmDeleteStoreModal
        open={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        storeName={store.name}
        onConfirm={async () => {
          const res = await apiDeleteStoreAsync(store.id);
          if (res.success) window.location.reload();
        }}
      />
    </>
  );
};

export default StoreCard;
