import UserPhone from "../components/UserPhone";

let users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "buyer" , phoneNumber: "060312589"},
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "seller", phoneNumber: "062312589"},
    { id: 3, name: "Alice Johnson", email: "alice.johnson@example.com", role: "buyer", phoneNumber: "06031569"},
    { id: 4, name: "Bob Brown", email: "bob.brown@example.com", role: "seller", phoneNumber: "061312589"}
  ];
  
  
  // Funkcija za ažuriranje korisnika
  export function updateUser(userId, updatedUser) {
    users = users.map(user =>
      user.id === userId ? { ...user, ...updatedUser } : user
    );
  }