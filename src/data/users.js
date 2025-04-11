// data/users.js

import { fetchAdminUsers }  from "../utils/users";

let users = [
  {
    id: 1,
    userName: "John Doe",
    email: "john.doe@example.com",
    role: "Seller",
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Buyer",
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 3,
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Seller",
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 4,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    role: "Buyer",
    availability: "Online",
    lastActive: "2024-04-09, 14:30:00",
    isApproved: true,
  },
  {
    id: 5,
    userName: "John Doe",
    email: "john.doe@example.com",
    role: "Seller",
    availability: "Offline",
    lastActive: "2024-04-08, 13:15:00",
    isApproved: true,
  },
  {
    id: 6,
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Buyer",
    availability: "Offline",
    lastActive: "2024-04-09, 14:30:00",
    isApproved: true,
  },
  {
    id: 7,
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Seller",
    availability: "Offline",
    lastActive: "2024-04-07, 10:00:00",
    isApproved: true,
  },
  {
    id: 8,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    role: "Buyer",
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 9,
    userName: "John Doe",
    email: "john.doe@example.com",
    role: "Seller",
    availability: "Online",
    lastActive: "2024-04-09, 09:45:00",
    isApproved: true,
  },
  {
    id: 10,
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Buyer",
    availability: "Offline",
    lastActive: "2024-04-06, 17:20:00",
    isApproved: true,
  },
  {
    id: 11,
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Seller",
    availability: "Online",
    lastActive: "2024-04-05, 14:00:00",
    isApproved: true,
  },
  {
    id: 12,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    role: "Buyer",
    availability: "Offline",
    lastActive: "2024-04-03, 11:00:00",
    isApproved: true,
  },
  {
    id: 13,
    userName: "John Doe",
    email: "john.doe@example.com",
    role: "Seller",
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 14,
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    role: "Buyer",
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 15,
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    role: "Seller",
    availability: "Offline",
    lastActive: "2024-04-01, 15:30:00",
    isApproved: true,
  },
  {
    id: 16,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    role: "Buyer",
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 17,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    role: "Buyer",
    availability: "Offline",
    lastActive: "2024-04-02, 13:00:00",
    isApproved: true,
  },
];


// Funkcija za vraćanje svih korisnika
export async function getUsers() {
  console.log("getUsers pozvan");
  //console.log("Trenutni users array:", users);
  const users = await fetchAdminUsers();
  return [...users];
}

// Funkcija za brisanje korisnika
export function deleteUser(userId) {
  users = users.filter((user) => user.id !== userId);
}

// Funkcija za pretragu korisnika
export function searchUsers(searchTerm) {
  return users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
}


export default users;