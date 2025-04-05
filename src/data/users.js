// data/users.js

let users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com" },
    { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com" },
    { id: 4, name: "Bob Brown", email: "bob.brown@example.com" }
  ];
  
  // Funkcija za vraćanje svih korisnika
  export function getUsers() {
    return [...users];
  }
  
  // Funkcija za brisanje korisnika
  export function deleteUser(userId) {
    users = users.filter(user => user.id !== userId);
  }
  
  // Funkcija za pretragu korisnika
  export function searchUsers(searchTerm) {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  