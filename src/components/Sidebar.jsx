import React from "react";
import icon from "@icons/admin.svg";
import { Box, Avatar, Typography, IconButton, Divider, Button } from "@mui/material";
import { HiOutlineBell } from "react-icons/hi";
import { HiOutlineUserGroup } from "react-icons/hi";
import {
  sidebarContainer,
  profileBox,
  navItem,
  iconBox,
  footerBox,
} from "./SidebarStyles";
import AdminSearchBar from "@components/AdminSearchBar";
import ThemeToggle from "@components/ThemeToggle";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePendingUsers } from "@context/PendingUsersContext";
import LogoutIcon from '@mui/icons-material/Logout';
import { FiShoppingBag } from "react-icons/fi";


const Sidebar = () => {
  const navigate = useNavigate();
  const { pendingUsers } = usePendingUsers();
  const menuItems = [
    {
      icon: <HiOutlineUserGroup />,
      label: "Users",
      path: "/users",
      badge: null,
    },
    {
      icon: <HiOutlineBell />,
      label: "Requests",
      path: "/requests",
      badge: pendingUsers.length,
    },
    {
      icon: <FiShoppingBag />,
      label: "Stores",
      path: "/stores",
      badge: null,
    },
    {
      icon: <FiShoppingBag />,
      label: "Categories",
      path: "/categories",
      badge: null,
    },
  ];
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

  const handleLogout = () => {
    console.log("Logging out...");

    // 1. Clear authentication artifacts from local storage
    //    (Add/remove items based on what you actually store)
    localStorage.removeItem('token');
    localStorage.removeItem('auth'); // From your AppRoutes example
    // localStorage.removeItem('user'); // Example: if you store user info

    // 2. Redirect to the login page
    //    'replace: true' prevents the user from navigating back to the protected page
    navigate('/login', { replace: true });

    // Optional: Force reload if state isn't clearing properly (useNavigate is usually sufficient)
    // window.location.reload();

    // Optional: Call a backend logout endpoint if needed
    // try {
    //   await axios.post('/api/auth/logout');
    // } catch (error) {
    //   console.error("Backend logout failed:", error);
    // }

    // Optional: Clear any global state (Context, Redux, Zustand) if necessary
    // authContext.logout();
  };

  return (
    <Box sx={sidebarContainer}>
      <Box sx={profileBox}>
        <Avatar
          src={icon}
          variant="square"
          sx={{
            width: 48,
            height: 48,
            borderRadius: "8px",
            backgroundColor: "transparent",
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            ml: 1,
          }}
        >
          <Typography fontWeight={600}>Bazaar</Typography>
          <Typography variant="caption" color="text.secondary">
            Administrator
          </Typography>
        </Box>
        <IconButton size="small" sx={{ ml: "auto" }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              bgcolor: "green",
              borderRadius: "50%",
            }}
          />
        </IconButton>
      </Box>
      {/* Search <AdminSearchBar /> */}
      {/* Menu */}
      {menuItems.map((item, index) => (
        <Box
          key={index}
          sx={navItem}
          onClick={() => navigate(item.path)}
          style={{ cursor: "pointer" }}
        >
          <Box sx={iconBox}>{item.icon}</Box>
          <Typography>{item.label}</Typography>
          {item.badge && (
            <Box
              ml="auto"
              px={1.5}
              bgcolor="primary.main"
              color="#fff"
              borderRadius={3}
              fontSize={12}
            >
              {item.badge}
            </Box>
          )}
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />

      <Box sx={footerBox}>
        {/* Footer toggle <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} /> */
        <Button
        variant="contained" // Or "outlined" or "text"
        color="error"       // Use "error", "warning", or "secondary" typically
        onClick={handleLogout}
        startIcon={<LogoutIcon />} // Optional icon
      >
        Logout
      </Button>
        }
      </Box>
    </Box>
  );
};

export default Sidebar;
