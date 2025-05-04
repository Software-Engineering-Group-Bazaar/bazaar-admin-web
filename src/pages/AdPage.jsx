import React, { useState } from 'react';
import { Box } from '@mui/material';
import AdCard from '@components/AdCard';
import AdsManagementHeader from '@sections/AdsManagementHeader';
import UserManagementPagination from '@components/UserManagementPagination';
import AddAdModal from '@components/AddAdModal'; 
import AdvertisementDetailsModal from '@components/AdvertisementDetailsModal';
import { apiCreateAdAsync, apiGetAllAdsAsync } from '../api/api';
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
  const [ads, setAds] = useState(generateMockAds());
  const [selectedAd, setSelectedAd] = useState(null);

  const adsPerPage = 5;

  const filteredAds = ads.filter((ad) =>
    ad.AdData[0].Description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAds.length / adsPerPage);
  const paginatedAds = filteredAds.slice(
    (currentPage - 1) * adsPerPage,
    currentPage * adsPerPage
  );

  useEffect(() => {
    const fetchAds = async () => {
      const rez = await apiGetAllAdsAsync();
      console.log(data);
      setAds(rez.data);
    };
    fetchAds();
  }, []);

  const handleDelete = async (id) => {
    console.log('Deleting ad with id:', id);
    setAds((prev) => prev.filter((ad) => ad.id !== id));
  };

  const handleEdit = async (updatedAd) => {
    console.log('Edited ad:', updatedAd);
    setAds((prev) =>
      prev.map((ad) => (ad.id === updatedAd.id ? updatedAd : ad))
    );
  };

  const handleViewDetails = (id) => {
    const found = ads.find((a) => a.id === id);
    setSelectedAd(found);
  };

  const handleCreateAd = () => {
    setIsModalOpen(true);
  };

  const handleAddAd = async (newAd) => {
    const nextId = Math.max(...ads.map((a) => a.id)) + 1;
    setAds((prev) => [...prev, { ...newAd, id: nextId }]);

    const response = await apiCreateAdAsync(newAd);
        if (response.status < 400) {
          const res = await apiGetAllAdsAsync();
          setAds(res.data);
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
