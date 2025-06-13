import React from 'react';
import UserRow from './UserRow';

export interface User {
  id: string;
  nombre: string;
  email: string;
  rol: string;
  empresa: string;
  estado: string;
}

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
}

const UsersTable: React.FC<UsersTableProps> = ({ users, onEdit, onDelete }) => {
  return (
    <div className="overflow-x-auto rounded shadow border">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Empresa</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <UserRow
              key={user.id}
              nombre={user.nombre}
              email={user.email}
              rol={user.rol}
              empresa={user.empresa}
              estado={user.estado}
              onEdit={() => onEdit(user)}
              onDelete={() => onDelete(user)}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
