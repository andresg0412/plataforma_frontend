import React, { useState, useEffect } from 'react';
import UsersTable, { User as TableUser } from './UsersTable';
import CreateUserButton from './CreateUserButton';
import CreateUserModal from './CreateUserModal';
import SuccessModal from './SuccessModal';
import { getUsersApi } from '../../auth/getUsersApi';
import { createUserApi } from '../../auth/createUserApi';

type FormUser = { nombre: string; cedula: string; email: string; username: string; empresa: string; rol: string; estado?: string };

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<TableUser[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getUsersApi()
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (user: FormUser) => {
    try {
      await createUserApi(user);
      setUsers(prev => [
        { ...user, id: (Math.random() * 100000).toFixed(0), estado: user.estado || 'activo' } as TableUser,
        ...prev,
      ]);
      setSuccessMsg('Usuario creado exitosamente');
      setSuccessOpen(true);
      setModalOpen(false);
    } catch (e) {
      alert(e || 'Error al crear usuario');
    }
  };

  const handleEdit = (user: TableUser) => {
    alert(`Editar usuario: ${user.nombre}`);
  };

  const handleDelete = (user: TableUser) => {
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
      <SuccessModal open={successOpen} message={successMsg} onClose={() => setSuccessOpen(false)} />
    </div>
  );
};

export default Usuarios;
