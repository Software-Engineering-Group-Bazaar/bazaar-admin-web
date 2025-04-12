// data/users.js

import { fetchAdminUsers }  from "../utils/users";

let users = [
  { id: 1, userName: "John Doe", 
    email: "john.doe@example.com", 
    role: "Seller",
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
    roles:[
      "Buyer"
    ]
  },
  {
    id: 2,
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    roles: [
      "Buyer"
    ],
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 3,
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    roles:[
      "Buyer"
    ],
    availability: "Online",
    lastActive: "Now",
    isApproved: true,
  },
  {
    id: 4,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    roles:[
      "Seller"
    ],
    availability: "Online",
    lastActive: "2024-04-09, 14:30:00",
    isApproved: true
  },
  { id: 5,
    userName: "John Doe",
    email: "john.doe@example.com",
    isApproved: true,
    roles:[
      "Seller"
    ]
  },
  {
    id: 6,
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    roles:[
      "Buyer"
    ],
    availability: "Online",
    lastActive: "2024-04-09, 14:30:00",
    isApproved: true,
  },
  {
    id: 7,
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    isApproved: true,
    roles:[
      "Buyer"
    ]
  },
  {
    id: 8,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    isApproved: true,
    roles:[
      "Buyer"
    ]
  },
  { id: 9,
    userName: "John Doe",
    email: "john.doe@example.com",
    isApproved: true,
    roles:[
      "Seller"
    ]
  },
  {
    id: 10,
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    isApproved: true,
    roles:[
      "Buyer"
    ]
  },
  {
    id: 11,
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    isApproved: true,
    roles:[
      "Seller"
    ]
  },
  {
    id: 12,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    isApproved: true,
    roles:[
      "Seller"
    ]
  },
  { id: 13,
    userName: "John Doe",
    email: "john.doe@example.com",
    isApproved: true,
    roles:[
      "Buyer"
    ]
  },
  {
    id: 14,
    userName: "Jane Smith",
    email: "jane.smith@example.com",
    isApproved: true,
    roles:[
      "Buyer"
    ]
  },
  {
    id: 15,
    userName: "Alice Johnson",
    email: "alice.johnson@example.com",
    isApproved: true,
    roles:[
      "Buyer"
    ]
  },
  {
    id: 16,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    isApproved: true,
    roles:[
      "Buyer"
    ]
  },
  {
    id: 16,
    userName: "Bob Brown",
    email: "bob.brown@example.com",
    isApproved: true,
    roles:[
      "Buyer"
    ]
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