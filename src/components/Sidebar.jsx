import React from "react";
import icon from "@icons/admin.svg";
import { Box, Avatar, Typography, IconButton, Divider } from "@mui/material";
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
      label: "Notifications",
      path: "/notifications",
      badge: pendingUsers.length,
    },
  ];
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => setIsDark(!isDark);

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
        {/* Footer toggle <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} /> */}
      </Box>
    </Box>
  );
};

export default Sidebar;
