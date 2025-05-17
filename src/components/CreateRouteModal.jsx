import React, { useState, useEffect } from "react";
import { Search, CheckSquare, Square } from "lucide-react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  InputAdornment,
  Chip,
} from "@mui/material";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import sha256 from "crypto-js/sha256";
import { apiFetchOrdersAsync, createRouteAsync } from "@api/api";

const CreateRouteModal = ({ open, onClose, onCreateRoute }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);

 useEffect(() => {
  const fetchOrders = async () => {
    try {
      const fetched = await apiFetchOrdersAsync();
      setAllOrders(fetched);
    } catch (err) {
      console.error("Greška prilikom učitavanja narudžbi:", err);
    }
  };

  if (open) {
    fetchOrders();
  }
}, [open]);


  const handleToggleOrder = (order) => {
    const exists = selectedOrders.some((o) => o.id === order.id);
    if (exists) {
      setSelectedOrders(selectedOrders.filter((o) => o.id !== order.id));
    } else {
      setSelectedOrders([...selectedOrders, order]);
    }
  };

  const filteredOrders = allOrders.filter((order) =>
    order.id.toString().includes(searchTerm.trim())
  );

  const handleCreateRoute = async () => {
    try {
      

      setLoading(true);

      const origin = selectedOrders[0].address?.streetAddress;
      const destination = selectedOrders[selectedOrders.length - 1].address?.streetAddress;
      const waypoints = selectedOrders
        .slice(1, -1)
        .map((order) => `via:${order.address?.streetAddress}`)
        .join("|");


      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
        origin
      )}&destination=${encodeURIComponent(
        destination
      )}&waypoints=${encodeURIComponent(waypoints)}&key=${apiKey}`;

      const response = await fetch(url);
      const directionsJson = await response.json();

      if (directionsJson.status !== "OK") {
        alert("Greška kod Google Maps API.");
        return;
      }

      await createRouteAsync(selectedOrders, directionsJson);
      onCreateRoute(selectedOrders);
    } catch (err) {
      console.error("Greška pri kreiranju rute:", err);
      alert("Došlo je do greške.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 450,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <LocalShippingIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" fontWeight="bold">
            Create Route
          </Typography>
        </Box>

        <TextField
          fullWidth
          placeholder="Search by order ID..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setShowSearchResults(true);
          }}
          onFocus={() => setShowSearchResults(true)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search fontSize="small" />
              </InputAdornment>
            ),
            sx: { borderRadius: 1 },
          }}
          sx={{ mb: 2 }}
        />

        {showSearchResults && searchTerm && (
          <Box
            sx={{
              border: 1,
              borderColor: "divider",
              borderRadius: 1,
              maxHeight: 200,
              overflow: "auto",
              mb: 2,
            }}
          >
            {filteredOrders.map((order) => (
              <Box
                key={order.id}
                onClick={() => handleToggleOrder(order)}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                {selectedOrders.some((o) => o.id === order.id) ? (
                  <CheckSquare
                    size={18}
                    color="#4a0404"
                    style={{ marginRight: 12, marginLeft: -4 }} 
                  />

                ) : (
                  <Square
                    size={18}
                    color="#ccc"
                    style={{ marginRight: 12, marginLeft: -4 }}
                  />

                )}
                <Box>
                  <Typography fontWeight="medium">
                    Order #{order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.address?.streetAddress || "?"}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box
          sx={{
            border: 1,
            borderColor: "divider",
            borderRadius: 1,
            p: 2,
            minHeight: 200,
            mb: 2,
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="subtitle2">Selected Orders</Typography>
            <Chip
              label={`${selectedOrders.length} selected`}
              size="small"
              color="primary"
            />
          </Box>

          {selectedOrders.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 150,
              }}
            >
              <Typography color="text.secondary">
                No orders selected. Search to add orders.
              </Typography>
            </Box>
          ) : (
            selectedOrders.map((order) => (
              <Box
                key={order.id}
                onClick={() => handleToggleOrder(order)}
                sx={{
                  p: 2,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": { bgcolor: "action.hover" },
                  borderBottom: 1,
                  borderColor: "divider",
                }}
              >
                <CheckSquare
                    size={18}
                    color="#4a0404"
                    style={{ marginRight: 12, marginLeft: -4 }} 
                  />
                <Box>
                  <Typography fontWeight="medium">
                    Order #{order.id}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {order.address?.streetAddress || "?"}
                  </Typography>
                </Box>
              </Box>
            ))
          )}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleCreateRoute}
            disabled={selectedOrders.length === 0 || loading}
            sx={{
              backgroundColor: "#4a0404",
              "&:hover": { backgroundColor: "#3a0202" },
            }}
          >
            {loading ? "Creating..." : "Create Route"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CreateRouteModal;
