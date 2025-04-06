import React, { createContext, useContext, useState, useEffect } from "react";
import mockUsers from "@data/pendingUsers";
import axios from 'axios';
export const PendingUsersContext = createContext();

export const usePendingUsers = () => useContext(PendingUsersContext);

export const PendingUsersProvider = ({ children }) => {
  const [pendingUsers, setPendingUsers] = useState([]);



  useEffect(() => {
    async function fetchData() {
    
      const token = localStorage.getItem("token");
    
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }
    
      const users =  await axios.get("http://localhost:5054/api/Admin/users");
      setPendingUsers(users["data"].filter(u => !u.isApproved));
        console.log(users["data"]);

    }
    fetchData();
  }, []); 

  const approveUser = (id) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const deleteUser = (id) => {
    setPendingUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <PendingUsersContext.Provider
      value={{ pendingUsers, approveUser, deleteUser }}
    >
      {children}
    </PendingUsersContext.Provider>
  );
};
