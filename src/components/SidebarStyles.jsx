export const sidebarContainer = {
  position: "fixed", // Zalijepi za lijevu stranu
  top: 0,
  left: 0,
  height: "100vh", // Cijela visina prozora
  width: 260,
  backgroundColor: "#f9f9f9",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  padding: "24px 16px",
  boxShadow: "2px 0 8px rgba(0,0,0,0.05)",
  zIndex: 1000, // Iznad ostalog sadržaja
};

export const profileBox = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  mb: 3,
};

export const navItem = {
  display: "flex",
  alignItems: "center",
  gap: 1.5,
  p: 1,
  borderRadius: 2,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: "#eef2f5",
  },
  mb: 1,
};

export const iconBox = {
  fontSize: 20,
  color: "#555",
};

export const footerBox = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  mt: "auto", 
  gap: 1,
};
