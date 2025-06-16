import React, { useState, useEffect } from 'react';
import UsersTable, { User as TableUser } from './UsersTable';
import CreateUserButton from './CreateUserButton';
import CreateUserModal from './CreateUserModal';
import ConfirmModal from './ConfirmModal';
import SuccessModal from './SuccessModal';
import { getUsersApi } from '../../auth/getUsersApi';
import { createUserApi } from '../../auth/createUserApi';
import { deleteUserApi } from '../../auth/deleteUserApi';
import { editUserApi } from '../../auth/editUserApi';

type FormUser = { nombre: string; cedula: string; email: string; username: string; empresa: string; rol: string; estado?: string };

const Usuarios: React.FC = () => {
  const [users, setUsers] = useState<TableUser[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorDeleteMsg, setErrorDeleteMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userToDelete, setUserToDelete] = useState<TableUser | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<TableUser | null>(null);
  const [confirmEditOpen, setConfirmEditOpen] = useState(false);
  const [editSuccessOpen, setEditSuccessOpen] = useState(false);
  const [editMsg, setEditMsg] = useState('');

  useEffect(() => {
    getUsersApi()
      .then(setUsers)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (user: { nombre: string; email: string; password_hash: string; id_roles: number; id_empresa: null; username: string }) => {
    try {
      // Map the modal user to your FormUser type for API and local state
      const formUser: FormUser = {
        nombre: user.nombre,
        cedula: '', // Provide a way to get cedula if needed
        email: user.email,
        username: user.username,
        empresa: '', // Provide a way to get empresa if needed
        rol: '', // Provide a way to get rol if needed
        estado: 'activo'
      };
      await createUserApi(formUser);
      setUsers(prev => [
        { ...formUser, id: (Math.random() * 100000).toFixed(0), estado: formUser.estado || 'activo' } as TableUser,
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
    setUserToEdit(user);
    setEditModalOpen(true);
  };

  const handleEditUser = async (user: any) => {
    setEditModalOpen(false);
    setConfirmEditOpen(true);
    setUserToEdit(prev => prev ? { ...prev, ...user } : null);
  };

  const handleConfirmEdit = async () => {
    setConfirmEditOpen(false);
    if (!userToEdit) return;
    try {
      const res = await editUserApi(userToEdit);
      if (res.success) {
        setEditMsg('Usuario editado exitosamente');
        setUsers(prev => prev.map(u => u.id === userToEdit.id ? { ...u, ...userToEdit } : u));
      } else {
        setEditMsg(res.message || 'Error al editar usuario');
      }
    } catch (e) {
      setEditMsg('Error al editar usuario');
    }
    setEditSuccessOpen(true);
  };

  const handleDelete = (user: TableUser) => {
    setUserToDelete(user);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setConfirmOpen(false);
    try {
      const res = await deleteUserApi(userToDelete.id);
      if (res.success) {
        setUsers(prev => prev.filter(u => u.id !== userToDelete.id));
        setSuccessMsg('Usuario eliminado exitosamente');
        setErrorDeleteMsg('');
      } else {
        setSuccessMsg(res.message || 'Error eliminando usuario');
        setErrorDeleteMsg(res.message || 'Error eliminando usuario');
      }
    } catch (e) {
      setSuccessMsg('Error eliminando usuario');
      setErrorDeleteMsg('Error eliminando usuario');
    }
    setSuccessOpen(true);
    setUserToDelete(null);
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
      <CreateUserModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onCreate={handleEditUser}
        initialData={userToEdit || undefined}
        isEdit
      />
      <ConfirmModal
        open={confirmEditOpen}
        message={`¿Estás seguro de que deseas editar el usuario ${userToEdit?.username || ''}?`}
        onConfirm={handleConfirmEdit}
        onClose={() => setConfirmEditOpen(false)}
      />
      <ConfirmModal
        open={confirmOpen}
        message={`¿Estás seguro de que deseas eliminar el usuario ${userToDelete?.username || ''}?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
      <SuccessModal open={successOpen} message={errorDeleteMsg ? errorDeleteMsg : successMsg} onClose={() => { setSuccessOpen(false); setErrorDeleteMsg(''); }} />
      <SuccessModal open={editSuccessOpen} message={editMsg} onClose={() => setEditSuccessOpen(false)} />
    </div>
  );
};

export default Usuarios;
