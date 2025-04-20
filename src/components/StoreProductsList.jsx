import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import { FiEdit2, FiTrash } from 'react-icons/fi';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import {
  apiGetStoreProductsAsync,
  apiDeleteProductAsync,
  apiUpdateProductAsync,
} from '@api/api';
import EditProductModal from './EditProductModal';
import ProductDetailsModal from './ProductDetailsModal';

const StoreProductsList = ({ storeId }) => {
  const [products, setProducts] = useState([]);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await apiGetStoreProductsAsync(storeId);
      if (response.status === 200) {
        setProducts(response.data);
      }
    };
    fetchProducts();
  }, [storeId]);

  const handleEditClick = (product, e) => {
    e.stopPropagation();
    setSelectedProduct(product);
    setOpenEditModal(true);
  };

  const handleDeleteClick = async (productId, e) => {
    e.stopPropagation();
    const response = await apiDeleteProductAsync(productId);
    if (response.status === 204) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  const handleStatusClick = async (product, e) => {
    e.stopPropagation();
    const updatedProduct = {
      ...product,
      isActive: !product.isActive,
    };
    const response = await apiUpdateProductAsync(updatedProduct);
    if (response.status === 200) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? updatedProduct : p))
      );
    }
  };

  const renderPlaceholderItems = () => {
    const itemHeight = 40;
    const minItems = 3;
    const placeholdersNeeded = Math.max(0, minItems - products.length);

    return Array(placeholdersNeeded)
      .fill(null)
      .map((_, index) => (
        <Box
          key={`placeholder-${index}`}
          sx={{
            height: `${itemHeight}px`,
            p: 1,
            opacity: 0,
          }}
        />
      ));
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant='subtitle1' fontWeight={800} mb={1}>
        Products
      </Typography>
      <Box
        sx={{
          height: '120px',
          overflowY: 'auto',
          '&::-webkit-scrollbar': { width: '8px' },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': { background: '#555' },
          },
        }}
      >
        {products.map((product) => (
          <Box
            key={product.id}
            onClick={() => {
              setSelectedProduct(product);
              setOpenDetailsModal(true);
            }}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              p: 1,
              height: '40px',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: '#f5f5f5',
                '& .edit-icon': { opacity: 1 },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Tooltip title={product.isActive ? 'Active' : 'Inactive'}>
                <IconButton
                  size='small'
                  onClick={(e) => handleStatusClick(product, e)}
                  sx={{ p: 0 }}
                >
                  <FiberManualRecordIcon
                    sx={{
                      fontSize: '12px',
                      color: product.isActive ? '#4caf50' : '#f44336',
                    }}
                  />
                </IconButton>
              </Tooltip>
              <Typography
                variant='body2'
                sx={{
                  color: product.isActive ? 'inherit' : 'text.secondary',
                  textDecoration: product.isActive ? 'none' : 'line-through',
                }}
              >
                {product.name}
              </Typography>
            </Box>
            <Box>
              <IconButton
                size='small'
                className='edit-icon'
                sx={{
                  opacity: 0,
                  padding: '2px',
                  transition: 'opacity 0.2s',
                }}
                onClick={(e) => handleEditClick(product, e)}
              >
                <FiEdit2 size={16} />
              </IconButton>
              <IconButton
                size='small'
                sx={{ ml: 1 }}
                onClick={(e) => handleDeleteClick(product.id, e)}
              >
                <FiTrash size={16} />
              </IconButton>
            </Box>
          </Box>
        ))}
        {renderPlaceholderItems()}
      </Box>

      <EditProductModal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        product={selectedProduct}
        onSave={(updatedProduct) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
          );
          setOpenEditModal(false);
        }}
      />

      <ProductDetailsModal
        open={openDetailsModal}
        onClose={() => setOpenDetailsModal(false)}
        product={selectedProduct}
      />
    </Box>
  );
};

export default StoreProductsList;
