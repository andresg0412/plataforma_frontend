import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import InmuebleRow from './InmuebleRow';

export interface IDataInmuebleIn {
  id: string;
  nombre: string;
  direccion: string;
  capacidad: number;
  id_propietario: string;
  id_empresa: string;
  estado: string;
}

interface InmueblesTableProps {
  inmuebles: IDataInmuebleIn[];
  onEdit: (inmueble: IDataInmuebleIn) => void;
  onDelete: (inmueble: IDataInmuebleIn) => void;
}

const InmueblesTable: React.FC<InmueblesTableProps> = ({ inmuebles, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canDelete = user?.permisos?.includes('eliminar_inmuebles');
  
  if (inmuebles.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No hay inmuebles disponibles
      </div>
    );
  }
  
  return (
    <div className="overflow-x-auto rounded shadow border">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Dirección</th>
            <th className="px-4 py-2">Capacidad</th>
            <th className="px-4 py-2">ID Propietario</th>
            <th className="px-4 py-2">ID Empresa</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {inmuebles.map(inmueble => (
            <InmuebleRow
              key={inmueble.id}
              nombre={inmueble.nombre}
              direccion={inmueble.direccion}
              capacidad={inmueble.capacidad}
              id_propietario={inmueble.id_propietario}
              id_empresa={inmueble.id_empresa}
              estado={inmueble.estado}
              onEdit={() => onEdit(inmueble)}
              onDelete={() => onDelete(inmueble)}
              canDelete={!!canDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InmueblesTable;