import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import UserRow from './UserRow';

export interface IDataUserIn {
  id: string;
  nombre: string;
  username: string;
  email: string;
  rol: string;
  empresa: string;
  estado: string;
}

interface UsersTableProps {
  users: IDataUserIn[];
  onEdit: (user: IDataUserIn) => void;
  onDelete: (user: IDataUserIn) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canDelete = user?.permisos?.includes('eliminar_usuarios');
  return (
    <div className="overflow-x-auto rounded shadow border">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Empresa</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(userRow => (
            <UserRow
              key={userRow.id}
              nombre={userRow.nombre}
              username={userRow.username}
              email={userRow.email}
              rol={userRow.rol}
              empresa={userRow.empresa}
              estado={userRow.estado}
              onEdit={() => onEdit(userRow)}
              onDelete={() => onDelete(userRow)}
              canDelete={!!canDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
