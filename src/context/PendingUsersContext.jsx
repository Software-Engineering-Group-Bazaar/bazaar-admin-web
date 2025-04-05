import React, { createContext, useContext, useState, useEffect } from "react";
import mockUsers from "@data/pendingUsers";

export const PendingUsersContext = createContext();

export const usePendingUsers = () => useContext(PendingUsersContext);

export const PendingUsersProvider = ({ children }) => {
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    setPendingUsers(mockUsers.filter((u) => !u.isApproved));
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
