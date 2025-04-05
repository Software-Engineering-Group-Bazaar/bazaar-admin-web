import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
} from "@mui/material";
import DeleteUserButton from "./DeleteUserButton";

export default function UserList({
  users,
  onDelete,
  onEdit,
  onView,
  currentPage,
  usersPerPage,
}) {
  return (
    <TableContainer
      component={Paper}
      sx={{
        marginTop: 2,
        maxHeight: "calc(100vh - 320px)",
        overflowY: "auto",
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#fafafa" }}>
            <TableCell sx={{ fontWeight: "bold" }}>#</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Pic</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Email</TableCell>
            <TableCell align="right" sx={{ fontWeight: "bold" }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{
                height: 72,
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f9f9f9",
                },
              }}
              onClick={() => onView(user.id)}
            >
              <TableCell sx={{ fontSize: 15 }}>
                {(currentPage - 1) * usersPerPage + index + 1}
              </TableCell>
              <TableCell>
                <Avatar
                  alt={user.name}
                  src={user.imageUrl}
                  sx={{ width: 40, height: 40 }}
                />
              </TableCell>
              <TableCell sx={{ fontWeight: 500 }}>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell align="right">
                <DeleteUserButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(user.id);
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
