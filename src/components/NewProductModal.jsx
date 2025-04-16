import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  useTheme,
} from '@mui/material';
import ImageUploader from './ImageUploader';
import SuccessMessage from './SuccessMessage';
import { HiOutlineCube } from 'react-icons/hi';
import style from './AddProductModalStyle';
import {
  apiCreateProductAsync,
  apiGetProductCategoriesAsync,
  apiCreateProductsBulkAsync,
} from './api/api';
import * as XLSX from 'xlsx';

const weightUnits = ['kg', 'g', 'lbs'];
const volumeUnits = ['L', 'ml', 'oz'];

const AddProductModal = ({ open, onClose, storeID }) => {
  const theme = useTheme();

  const [productCategories, setProductCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    weight: '',
    weightunit: 'kg',
    volume: '',
    volumeunit: 'L',
    productcategoryname: '',
    photos: [],
  });

  const [successModal, setSuccessModal] = useState({
    open: false,
    isSuccess: true,
    message: '',
  });

  const [parsedProducts, setParsedProducts] = useState([]);

  useEffect(() => {
    if (open) {
      apiGetProductCategoriesAsync().then(setProductCategories);
    }
  }, [open]);

  useEffect(() => {
    if (successModal.open) {
      const timer = setTimeout(() => {
        setSuccessModal((prev) => ({ ...prev, open: false }));
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [successModal.open]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'productcategoryid') {
      const selectedCategory = productCategories.find(
        (cat) => cat.name === value
      );

      setFormData((prev) => ({
        ...prev,
        productcategoryid: selectedCategory ? selectedCategory.id : 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotosChange = (files) => {
    console.log(files);
    console.log(formData.photos);
    setFormData((prev) => ({ ...prev, photos: files }));
  };

  const handleSubmit = async () => {
    const selectedCategory = productCategories.find((cat) => {
      console.log(cat);
      console.log(formData.productcategoryname);
      console.log(cat.name == formData.productcategoryname);
      return cat.name == formData.productcategoryname;
    });

    if (!selectedCategory) {
      alert('Please select a valid product category.');
      return;
    }

    // 📌 Kreiraj pravi objekat
    const productData = {
      name: formData.name,
      price: formData.price,
      weight: formData.weight,
      weightunit: formData.weightunit,
      volume: formData.volume,
      volumeunit: formData.volumeunit,
      productcategoryid: selectedCategory.id, // ← ✅ SIGURAN ID
      storeId: storeID,
      photos: formData.photos,
    };

    console.log('📦 Final productData being sent:', productData);

    try {
      const response = await apiCreateProductAsync(productData);
      console.log(response);
      if (response?.success) {
        setSuccessModal({
          open: true,
          isSuccess: true,
          message: 'Product has been successfully assigned to the store.',
        });
      } else {
        throw new Error('API returned failure.');
      }
    } catch (err) {
      console.error('Product creation failed:', err);
      setSuccessModal({
        open: true,
        isSuccess: false,
        message: 'Failed to assign product to the store.',
      });
    } finally {
      onClose();
    }
  };

  /**
   * Handle upload and parsing of CSV/Excel file.
   * Extracts rows and maps them into product objects.
   * @param {Event} e - file input change event
   */
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const binaryStr = evt.target.result;
      const workbook = XLSX.read(binaryStr, { type: 'binary' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Ovdje pretpostavljamo da Excel/CSV ima kolone: name, price, weight, weightunit, volume, volumeunit, productcategoryname
      setParsedProducts(jsonData);
      console.log("TEST::::::\n\n",jsonData);
    };

    reader.readAsBinaryString(file);
  };

  /**
   * Salje preuzete proizvode iz excel/csv bekendu da se pohrane u bazu
   */
  const handleBulkCreate = async () => {
    if (parsedProducts.length === 0) return;

    try {
      const response = await apiCreateProductsBulkAsync(parsedProducts);
      console.log("TEST 2::::::\n\n",parsedProducts);

      if (response?.status === 200) {
        setSuccessModal({
          open: true,
          isSuccess: true,
          message: 'Products have been created from file successfully.',
        });
      } else {
        throw new Error('Bulk creation failed.');
      }
    } catch (err) {
      console.error('Bulk create error:', err);
      setSuccessModal({
        open: true,
        isSuccess: false,
        message: 'Failed to create products from file.',
      });
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box
          sx={{
            ...style,
            maxWidth: '600px',
            bgcolor: '#fff',
            borderRadius: '20px',
            p: 4,
            boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          }}
        >
          <HiOutlineCube
            style={{
              fontSize: '58px',
              color: '#00bcd4',
              margin: '0 auto 10px auto',
              display: 'block',
            }}
          />

          <Typography
            variant='h4'
            fontWeight={700}
            color='#4a0404'
            mb={3}
            textAlign='center'
          >
            Add New Product
          </Typography>

          {/* Image Upload */}
          <ImageUploader onFilesSelected={handlePhotosChange} />

          {/* Excel/CSV Upload */}
          <Box mt={3}>
            <Typography fontWeight={600} mb={3} textAlign={'center'}>
              Import Products from Excel/CSV
            </Typography>
            <input
              accept='.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
              type='file'
              id='excel-upload'
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
            <label htmlFor='excel-upload'>
              <Button
                variant='outlined'
                component='span'
                sx={{
                  borderRadius: 2,
                  fontWeight: 600,
                  textTransform: 'none',
                  px: 3,
                  py: 1,
                  color: '#4a0404',
                  borderColor: '#4a0404',
                  '&:hover': {
                    color: '#ffffff',
                    backgroundColor: '#3b1010',
                    borderColor: '#3a0202',
                  },
                }}
              >
                Upload Excel/CSV
              </Button>
            </label>
            {parsedProducts.length > 0 && (
              <Button
                variant='outlined'
                color='success'
                sx={{ mt: 1, ml: 15, mb: 1 }}
                onClick={handleBulkCreate}
              >
                Upload {parsedProducts.length} Product
                {parsedProducts.length > 1 ? 's' : ''}
              </Button>
            )}
          </Box>

          {/* Form */}
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label='Product Name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              fullWidth
              variant='outlined'
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#fafafa' },
              }}
            />

            <TextField
              label='Price'
              name='price'
              value={formData.price}
              onChange={handleChange}
              type='number'
              fullWidth
              variant='outlined'
              InputProps={{
                sx: { borderRadius: 2, backgroundColor: '#fafafa' },
              }}
            />

            {/* Weight + Unit */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 2 }}>
                <TextField
                  label='Weight'
                  name='weight'
                  value={formData.weight}
                  onChange={handleChange}
                  type='number'
                  fullWidth
                  variant='outlined'
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  label='Unit'
                  name='weightunit'
                  value={formData.weightunit}
                  onChange={handleChange}
                  fullWidth
                  variant='outlined'
                  sx={{ backgroundColor: '#fafafa', borderRadius: 2 }}
                >
                  {weightUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            {/* Volume + Unit */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 2 }}>
                <TextField
                  label='Volume'
                  name='volume'
                  value={formData.volume}
                  onChange={handleChange}
                  type='number'
                  fullWidth
                  variant='outlined'
                  InputProps={{
                    sx: {
                      borderRadius: 2,
                      backgroundColor: '#fafafa',
                    },
                  }}
                />
              </Box>
              <Box sx={{ flex: 1 }}>
                <TextField
                  select
                  label='Unit'
                  name='volumeunit'
                  value={formData.volumeunit}
                  onChange={handleChange}
                  fullWidth
                  variant='outlined'
                  sx={{ backgroundColor: '#fafafa', borderRadius: 2 }}
                >
                  {volumeUnits.map((unit) => (
                    <MenuItem key={unit} value={unit}>
                      {unit}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </Box>

            <TextField
              select
              label='Category'
              name='productcategoryname'
              value={formData.productcategoryname}
              onChange={handleChange}
              required
              fullWidth
              variant='outlined'
              sx={{ backgroundColor: '#fafafa', borderRadius: 2 }}
            >
              {productCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.name}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          {/* Buttons */}
          <Box
            display='flex'
            justifyContent='flex-end'
            gap={2}
            mt={4}
            sx={{ pt: 2 }}
          >
            <Button
              variant='text'
              onClick={onClose}
              sx={{ color: '#4a0404', fontWeight: 600, fontSize: '0.95rem' }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#4a0404',
                fontWeight: 600,
                px: 4,
                borderRadius: 2,
                boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
                '&:hover': { backgroundColor: '#3a0202' },
              }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Success or Error Feedback */}
      <SuccessMessage
        open={successModal.open}
        onClose={() => setSuccessModal((prev) => ({ ...prev, open: false }))}
        isSuccess={successModal.isSuccess}
        message={successModal.message}
      />
    </>
  );
};

export default AddProductModal;
