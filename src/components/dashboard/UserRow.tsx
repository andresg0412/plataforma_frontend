import React from 'react';

interface UserRowProps {
  nombre: string;
  username: string;
  email: string;
  rol: string;
  empresa: string;
  estado: string;
  onEdit: () => void;
  onDelete: () => void;
}

const UserRow: React.FC<UserRowProps> = ({ nombre, username, email, rol, empresa, estado, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-2">{nombre}</td>
      <td className="px-4 py-2">{username}</td>
      <td className="px-4 py-2">{email}</td>
      <td className="px-4 py-2">{rol}</td>
      <td className="px-4 py-2">{empresa}</td>
      <td className="px-4 py-2">{estado}</td>
      <td className="px-4 py-2 flex gap-2">
        <button onClick={onEdit} className="text-blue-600 hover:text-blue-800" title="Editar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303Z" />
          </svg>
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800" title="Eliminar">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>
        </button>
      </td>
    </tr>
  );
};

export default UserRow;
