import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Avatar, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import DeleteUserButton from "./DeleteUserButton"; 

export default function UserList({ users, onDelete, onEdit, onView }) {
  return (
    <TableContainer component={Paper} sx={{ marginTop: 2 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>#</TableCell> 
            <TableCell>Pic</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow 
              key={user.id} 
              sx={{
                cursor: 'pointer', 
                '&:hover': {
                  backgroundColor: '#f5f5f5', 
                }
              }}
              onClick={() => onView(user.id)} 
            >
              <TableCell>{index + 1}</TableCell> 
              <TableCell>
                <Avatar alt={user.name} src={user.imageUrl} />
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell align="right">
                {}
                <DeleteUserButton onClick={(e) => { e.stopPropagation(); onDelete(user.id); }} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
