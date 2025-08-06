import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { IInmueble } from '../../auth/getInmueblesApi';

export interface IDataInmuebleIn extends IInmueble {}

interface InmueblesTableProps {
  inmuebles: IDataInmuebleIn[];
  onEdit: (inmueble: IDataInmuebleIn) => void;
  onDelete: (inmueble: IDataInmuebleIn) => void;
}

const InmueblesTable: React.FC<InmueblesTableProps> = ({ inmuebles, onEdit, onDelete }) => {
  const { user } = useAuth();
  const canEdit = user?.permisos?.includes('editar_inmuebles') || true; // TEMPORAL: siempre true para debugging
  const canDelete = user?.permisos?.includes('eliminar_inmuebles') || true; // TEMPORAL: siempre true para debugging

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getEstadoBadge = (estado: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (estado) {
      case 'disponible':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`;
      case 'ocupado':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`;
      case 'mantenimiento':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`;
      case 'inactivo':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  const getTipoBadge = (tipo: string) => {
    const baseClasses = 'px-2 py-1 rounded-full text-xs font-medium';
    switch (tipo) {
      case 'apartamento':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`;
      case 'casa':
        return `${baseClasses} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200`;
      case 'studio':
        return `${baseClasses} bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200`;
      case 'penthouse':
        return `${baseClasses} bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Inmueble
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Tipo
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Dirección
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {inmuebles.map((inmueble) => (
            <tr key={inmueble.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
              <td className="px-6 py-4 whitespace-nowrap">
                <div>
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {inmueble.nombre}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">
                    {inmueble.descripcion}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getTipoBadge(inmueble.tipo)}>
                  {inmueble.tipo}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white max-w-xs truncate">
                  {inmueble.direccion}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={getEstadoBadge(inmueble.estado)}>
                  {inmueble.estado}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={canEdit ? () => onEdit(inmueble) : undefined}
                    className={`${canEdit ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400'}`}
                    title={canEdit ? 'Editar' : 'Sin permisos para editar'}
                    disabled={!canEdit}
                    style={{ cursor: canEdit ? 'pointer' : 'default', background: 'none', border: 'none', padding: '4px' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.79l-4 1 1-4 12.362-12.303Z" />
                    </svg>
                  </button>
                  <button
                    onClick={canDelete ? () => onDelete(inmueble) : undefined}
                    className={`${canDelete ? 'text-red-600 hover:text-red-800' : 'text-gray-400'}`}
                    title={canDelete ? 'Eliminar' : 'Sin permisos para eliminar'}
                    disabled={!canDelete}
                    style={{ cursor: canDelete ? 'pointer' : 'default', background: 'none', border: 'none', padding: '4px' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {inmuebles.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No hay inmuebles disponibles
        </div>
      )}
    </div>
  );
};

export default InmueblesTable;
