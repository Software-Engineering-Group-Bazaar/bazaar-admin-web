import './App.css';
import LoginPage from "@pages/LoginPage";
import { ThemeProvider } from '@mui/material/styles';
import theme from '@styles/theme';
import CssBaseline from '@mui/material/CssBaseline';
import UserManagement from "./sections/UserManagementSection.jsx";
import { Container } from "@mui/material";
import PendingUsersTable from './components/PendingUsersTable.jsx';
import pendingUsers from './data/pendingUsers'; // ✅ putanja prema fajlu

function App() {

  const handleApprove = (id) => {
    console.log(`Odobren korisnik sa ID-em:  ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Izbrisan korisnik s ID-em:  ${id}`);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Pending Users</h2>
      <PendingUsersTable
        users={pendingUsers}
        onApprove={handleApprove}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default App;
