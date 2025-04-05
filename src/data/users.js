// data/users.js

let users = [
  { id: 1, name: "John Doe", email: "john.doe@example.com" },
  { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" },
  { id: 4, name: "Bob Brown", email: "bob.brown@example.com" },
  { id: 5, name: "John Doe", email: "john.doe@example.com" },
  { id: 6, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 7, name: "Alice Johnson", email: "alice.johnson@example.com" },
  { id: 8, name: "Bob Brown", email: "bob.brown@example.com" },
  { id: 9, name: "John Doe", email: "john.doe@example.com" },
  { id: 10, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 11, name: "Alice Johnson", email: "alice.johnson@example.com" },
  { id: 12, name: "Bob Brown", email: "bob.brown@example.com" },
  { id: 13, name: "John Doe", email: "john.doe@example.com" },
  { id: 14, name: "Jane Smith", email: "jane.smith@example.com" },
  { id: 15, name: "Alice Johnson", email: "alice.johnson@example.com" },
  { id: 16, name: "Bob Brown", email: "bob.brown@example.com" },
  { id: 16, name: "Bob Brown", email: "bob.brown@example.com" },
];

// Funkcija za vraćanje svih korisnika
export function getUsers() {
  console.log("getUsers pozvan");
  console.log("Trenutni users array:", users);
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
