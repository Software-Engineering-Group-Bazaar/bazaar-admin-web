import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import RouteCard from "@components/RouteCard";
import UserManagementPagination from "@components/UserManagementPagination";
import RoutesHeader from "@sections/RoutesHeader";
import RouteDetailsModal from "@components/RouteDetailsModal";
import {
  apiGetAllRoutesAsync,
  apiDeleteRouteAsync
} from '../api/api';

const RoutesPage = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const perPage = 8;

  // Dohvati sve rute iz API-ja
  useEffect(() => {
    const fetchRoutes = async () => {
      const response = await apiGetAllRoutesAsync();
      console.log("Fetched routes:", response.data);
      if (response.status === 200) {
        setRoutes(response.data);
      } else {
        console.error("Greška pri dohvatu ruta:", response);
      }
    };

    fetchRoutes();
  }, []);


  const totalPages = Math.ceil(routes.length / perPage);
  const paginatedRoutes = routes.slice(
    (currentPage - 1) * perPage,
    currentPage * perPage
  );


const handleDelete = async (id) => {
  try {
    const response = await apiDeleteRouteAsync(id);
    if (response.status === 204) {
      setRoutes((prevRoutes) => prevRoutes.filter((r) => r.id !== id));
      console.log(`Route with ID ${id} deleted successfully.`);
    } else {
      console.error("Delete failed with status:", response.status);
    }
  } catch (err) {
    console.error("Delete unsuccessful", err);
  }
};


  // Prikaz detalja rute
  const handleViewDetails = (id) => {
    const selected = routes.find(r => r.id === id);
    console.log("Selected route:", selected);
    setSelectedRoute(selected);
    setIsModalOpen(true);
  };

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        justifyContent: "flex-start",
        backgroundColor: "#f7f8fa",
        minHeight: "100vh",
      }}
    >
      <Box
        sx={{
          width: "calc(100%)",
          maxWidth: "1600px",
          marginLeft: "260px",
          pt: 2,
          px: 2,
        }}
      >
        <RoutesHeader />

        <Grid
          container
          spacing={3}
          sx={{
            mt: 2,
            mb: 5,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {paginatedRoutes.map((route) => (
            <Grid item key={route.id} xs={12} sm={6} md={4}>
              <RouteCard
                route={route}
                onDelete={() => handleDelete(route.id)}
                onViewDetails={handleViewDetails}
              />
            </Grid>
          ))}
        </Grid>

        <UserManagementPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />

        <RouteDetailsModal
          open={isModalOpen}
          route={selectedRoute}
          onClose={() => setIsModalOpen(false)}
        />
      </Box>
    </Box>
  );
};

export default RoutesPage;
