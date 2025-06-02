// src/context/PendingUsersContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetchPendingUsersAsync } from "../api/api.js"; 

export const PendingUsersContext = createContext();

export const usePendingUsers = () => useContext(PendingUsersContext);

export const PendingUsersProvider = ({ children }) => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const users = await apiFetchPendingUsersAsync();
        setPendingUsers(users);
        console.log("Fetched users:", users);
      } catch (error) {
        console.error("Neuspješno dohvaćanje korisnika:", error);
      }
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
