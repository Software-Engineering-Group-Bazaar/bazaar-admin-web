import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import AdCard from '@components/AdCard';
import AdsManagementHeader from '@sections/AdsManagementHeader';
import UserManagementPagination from '@components/UserManagementPagination';
import AddAdModal from '@components/AddAdModal'; 
import AdvertisementDetailsModal from '@components/AdvertisementDetailsModal';
import { useAdSignalR } from '../hooks/useAdSignalR'; // ili stvarna putanja
import {
  apiCreateAdAsync,
  apiGetAllAdsAsync,
  apiDeleteAdAsync,
  apiUpdateAdAsync,
  apiGetAllStoresAsync,
  apiGetProductCategoriesAsync,
} from '../api/api';
import products from '../data/products';
const generateMockAds = () => {
  return Array.from({ length: 26 }, (_, i) => ({
    id: i + 1,
    sellerId: 42 + i,
    Views: 1200 + i * 10,
    Clicks: 300 + i * 5,
    startTime: '2024-05-01T00:00:00Z',
    endTime: '2024-06-01T00:00:00Z',
    isActive: i % 2 === 0,
    AdData: [
      {
        Description: `Ad Campaign #${i + 1}`,
        Image: 'https://via.placeholder.com/150',
        ProductLink: 'https://example.com/product',
        StoreLink: 'https://example.com/store',
      },
    ],
  }));
};

const AdPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ads, setAds] = useState([]);
  const [stores, setStores] = useState([]);
  const [selectedAd, setSelectedAd] = useState(null);

  const { latestAdUpdate } = useAdSignalR();

  const [isLoading, setIsLoading] = useState(true);

  const adsPerPage = 5;

  const filteredAds = ads.filter((ad) =>
    ad.adData != undefined && ad.adData[0].description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAds.length / adsPerPage);
  const paginatedAds = filteredAds.slice(
    (currentPage - 1) * adsPerPage,
    currentPage * adsPerPage
  );

  useEffect(() => {
    async function fetchAllAdData() {
      setIsLoading(true);
      try{
      const rez = await apiGetAllAdsAsync();
      const stores = await apiGetAllStoresAsync();
      const productCategories = await apiGetProductCategoriesAsync();
      setAds(rez.data);
      setStores(stores);
      } catch (err) {
        console.error("Greška pri dohvaćanju reklama:", err);
      } 
      setIsLoading(false);
    };

    fetchAllAdData();
  }, []);

  // === 2. Real-time update preko SignalR ===
  useEffect(() => {
    if (latestAdUpdate) {
      setAds((prevAds) =>
        prevAds.map((ad) =>
          ad.id === latestAdUpdate.id
            ? {
                ...ad,
                views: latestAdUpdate.views,
                clicks: latestAdUpdate.clicks,
              }
            : ad
        )
      );
    }
  }, [latestAdUpdate]);

  const handleDelete = async (id) => {
    const response = await apiDeleteAdAsync(id);
      console.log("nesto");
      const res = await apiGetAllAdsAsync();
      setAds(res.data);
    
  };

 const handleEdit = async (adId, payload) => {
   try {
     const response = await apiUpdateAdAsync(adId, payload);
     if (response.status < 400) {
       const updated = await apiGetAllAdsAsync();
       setAds(updated.data);
     } else {
       console.error('Failed to update advertisement');
     }
   } catch (error) {
     console.error('Error updating ad:', error);
   }
 };

  const handleViewDetails = (id) => {
    const found = ads.find((a) => a.id === id);
    console.log("detalji");
    setSelectedAd(found);
  };

  const handleCreateAd = () => {
    setIsModalOpen(true);
  };

const handleAddAd = async (newAd) => {
  try {
    const response = await apiCreateAdAsync(newAd);
    if (response.status < 400 && response.data) {
      setAds(prev => [...prev, response.data]);
      console.log("Uradjeno");
      setIsModalOpen(false);
    } else {
      console.error('Greška pri kreiranju oglasa:', response);
    }
  } catch (error) {
    console.error('API error:', error);
  }
};

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Box
      sx={{
        pl: '280px',
        pr: 4,
        pt: 2,
        pb: 6,
        width: '100%',
        minHeight: '100vh',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ maxWidth: '1400px', mx: 'auto' }}>
        <AdsManagementHeader
          onCreateAd={handleCreateAd}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        {paginatedAds.map((ad) => (
          <Box key={ad.id} mb={2}>
            <AdCard
              ad={ad}
              stores={stores}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onViewDetails={handleViewDetails}
            />
          </Box>
        ))}

        <UserManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </Box>

      <AddAdModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddAd={handleAddAd}
      />

      <AdvertisementDetailsModal
        open={!!selectedAd}
        ad={selectedAd}
        onClose={() => setSelectedAd(null)}
        onDelete={handleDelete}
        onSave={handleEdit}
      />
    </Box>
  );
};

export default AdPage;
