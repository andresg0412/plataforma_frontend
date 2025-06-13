import React, { useState, useEffect } from 'react';
import UsersTable, { User } from './UsersTable';
import CreateUserButton from './CreateUserButton';
import CreateUserModal from './CreateUserModal';
import { getUsersApi } from '../../auth/getUsersApi';

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsersApi()
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = (user: Omit<User, 'id'>) => {
    setUsers(prev => [
      { ...user, id: (Math.random() * 100000).toFixed(0) },
      ...prev,
    ]);
  };

  const handleEdit = (user: User) => {
    alert(`Editar usuario: ${user.nombre}`);
  };

  const handleDelete = (user: User) => {
    if (window.confirm(`¿Seguro que deseas eliminar a ${user.nombre}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Usuarios</h2>
        <CreateUserButton onClick={() => setModalOpen(true)} />
      </div>
      {loading ? (
        <div className="text-center py-8">Cargando usuarios...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <UsersTable users={users} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <CreateUserModal open={modalOpen} onClose={() => setModalOpen(false)} onCreate={handleCreate} />
    </div>
  );
};

export default Usuarios;
