import React, { useState, useEffect } from "react";
import { Box } from "@mui/material";
import StoresHeader from "@sections/StoresHeader";
import StoreCard from "@components/StoreCard";
import UserManagementPagination from "@components/UserManagementPagination";
import { apiGetAllStoresAsync } from "@api/api";

const StoresPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const storesPerPage = 16;

  const [allStores, setAllStores] = useState([]);

  useEffect(() => {
    const fetchStores = async () => {
      const data = await apiGetAllStoresAsync();
      setAllStores(data);
    };
    fetchStores();
  }, []);


  const filteredStores = allStores.filter(
    (store) =>
      store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      store.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredStores.length / storesPerPage);
  const indexOfLastStore = currentPage * storesPerPage;
  const indexOfFirstStore = indexOfLastStore - storesPerPage;
  const currentStores = filteredStores.slice(
    indexOfFirstStore,
    indexOfLastStore
  );

  return (
    <Box sx={{ width: "100%", backgroundColor: "#fefefe", minHeight: "100vh" }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: "1400px",
          marginLeft: "260px",
          pt: 2,
          px: 2,
        }}
      >
        <StoresHeader searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

        {/* Grid layout */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 1.5,
            mt: 3,
          }}
        >
          {currentStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </Box>

        <Box sx={{ mt: 4 }}>
          <UserManagementPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default StoresPage;
