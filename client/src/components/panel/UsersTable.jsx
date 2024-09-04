import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Typography, Paper, Box } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';

const UsersTable = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({ username: '', role: '', fullName: '', phone: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
  
      const response = await fetch('http://localhost:5000/api/users/usuarios', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Incluye el token en el encabezado
        },
      });
  
      if (!response.ok) {
        throw new Error('Error fetching users');
      }
  
      const data = await response.json();
      setUsers(data); // Actualiza el estado con los datos
      setLoading(false); // Termina el estado de carga
    } catch (error) {
      console.error('Error:', error.message);
      setError(error.message);
      setLoading(false);
    }
  };

  const handleOpenDialog = (user) => {
    setSelectedUser(user);
    setFormData(user || { username: '', role: '', fullName: '', phone: '', email: '', password: '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedUser(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const method = selectedUser ? 'PUT' : 'POST';
      const url = selectedUser ? `http://localhost:5000/api/users/updateUser/${selectedUser._id}` : 'http://localhost:5000/api/users/addUser';
  
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });
  
      if (!response.ok) {
        throw new Error('Error al guardar el usuario');
      }
  
      fetchUsers();
      handleCloseDialog();
    } catch (error) {
      setError(error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/deleteUser/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el usuario');
      }
  
      fetchUsers();
    } catch (error) {
      setError(error.message);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ width: '100%', overflow: 'hidden' }}>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => handleOpenDialog(null)}
        sx={{ mb: 2 }}
        >
        Agregar Usuario
      </Button>

      <TextField
        variant="outlined"
        placeholder="Buscar por nombre"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />

      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Arial' }}>Usuario</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Arial' }}>Rol</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Arial' }}>Nombre completo</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Arial' }}>Telefono</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Arial' }}>Email</TableCell>
                <TableCell sx={{ fontSize: '1.2rem', fontWeight: 'bold', fontFamily: 'Arial' }}>Acción</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.phone}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpenDialog(user)} color="primary">
                      <Edit />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(user._id)} color="secondary">
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>{selectedUser ? 'Editar usuario' : 'Agregar usuario'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              name="username"
              label="Usuario"
              type="text"
              fullWidth
              value={formData.username}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="role"
              label="Rol"
              type="text"
              fullWidth
              value={formData.role}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="fullName"
              label="Nombre Completo"
              type="text"
              fullWidth
              value={formData.fullName}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="phone"
              label="telefono"
              type="text"
              fullWidth
              value={formData.phone}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              value={formData.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              name="password"
              label="Password"
              type="password"
              fullWidth
              value={formData.password}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button onClick={handleSave} variant="contained">Guardar</Button>
          </DialogActions>
        </Dialog>

        {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}
      </Paper>
    </Box>
  );
};

export default UsersTable;
