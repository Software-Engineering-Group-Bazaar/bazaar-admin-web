import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import RouteCard from "@components/RouteCard";
import UserManagementPagination from "@components/UserManagementPagination";
import RoutesHeader from "@sections/RoutesHeader";

// MOCK funkcija za dohvat ruta
const generateMockRoutes = (page, perPage) => {
  const totalRoutes = 42;
  const routes = Array.from({ length: totalRoutes }, (_, i) => ({
    id: i + 1,
    name: `Route ${i + 1}`,
  }));

  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    data: routes.slice(start, end),
    total: totalRoutes,
  };
};

const RoutesPage = () => {
  const [routes, setRoutes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 8;

  useEffect(() => {
    const fetchRoutes = async () => {
      const response = generateMockRoutes(currentPage, perPage);
      setRoutes(response.data);
    };
    fetchRoutes();
  }, [currentPage]);

  const totalPages = Math.ceil(42 / perPage); // hardkodirano za mock

  const handleDelete = async (id) => {
    setRoutes((prev) => prev.filter((r) => r.id !== id));
  };

  const handleViewDetails = (id) => {
    console.log("View route", id);
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
      <RoutesHeader
      />

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
      {routes.map((route) => (
        <Grid item key={route.id} xs={12} sm={6} md={4}>
          <RouteCard
            route={route}
            onDelete={handleDelete}
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
    </Box>
  </Box>
);

};

export default RoutesPage;
