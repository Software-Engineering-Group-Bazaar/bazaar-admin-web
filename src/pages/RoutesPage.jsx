import React, { useState, useEffect } from "react";
import { Box, Typography, Grid } from "@mui/material";
import RouteCard from "@components/RouteCard";
import UserManagementPagination from "@components/UserManagementPagination";
import RoutesHeader from "@sections/RoutesHeader";
import RouteDetailsModal from "@components/RouteDetailsModal";
import { sha256 } from "js-sha256";



const generateMockRoutes = (page, perPage) => {
  const totalRoutes = 42;
  const routes = Array.from({ length: totalRoutes }, (_, i) => {
    const numOrders = Math.floor(Math.random() * 6) + 1;
    const orderIds = Array.from({ length: numOrders }, () => 
      Math.floor(1000 + Math.random() * 9000) 
    );

    const mockData = {
      routes: [
        {
          legs: [
            {
              start_location: { lat: 43.85 + 0.01 * i, lng: 18.38 + 0.01 * i },
              end_location: { lat: 43.86 + 0.01 * i, lng: 18.40 + 0.01 * i },
            },
          ],
        },
      ],
    };

    const hash = sha256(JSON.stringify(mockData));

    return {
      id: i + 1,
      name: `Route ${i + 1}`,
      orderIds,
      ownerId: 1,
      routeData: {
        data: mockData,
        hash,
        routeId: `route-${i + 1}`,
      },
    };
  });

  const start = (page - 1) * perPage;
  const end = start + perPage;
  return {
    data: routes.slice(start, end),
    total: totalRoutes,
  };
};



const RoutesPage = () => {
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
