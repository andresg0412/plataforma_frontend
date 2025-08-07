import React from 'react';
import { Edit2, Trash2, Eye, Users } from 'lucide-react';
import { IReservaTableData } from '../../interfaces/Reserva';

interface ReservasTableProps {
  reservas: IReservaTableData[];
  onEdit: (reserva: IReservaTableData) => void;
  onDelete: (reserva: IReservaTableData) => void;
  onViewDetail: (reserva: IReservaTableData) => void;
  onViewHuespedes: (reserva: IReservaTableData) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

const ReservasTable: React.FC<ReservasTableProps> = ({ 
  reservas, 
  onEdit, 
  onDelete,
  onViewDetail,
  onViewHuespedes,
  canEdit = true,
  canDelete = true
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getEstadoBadge = (estado: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    
    switch (estado) {
      case 'pendiente':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'confirmada':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'en_proceso':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'completada':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelada':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const calcularNoches = (fechaEntrada: string, fechaSalida: string) => {
    const entrada = new Date(fechaEntrada);
    const salida = new Date(fechaSalida);
    const diffTime = Math.abs(salida.getTime() - entrada.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Código
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Huésped
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Inmueble
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Fechas
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Huéspedes
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {reservas.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                No hay reservas registradas
              </td>
            </tr>
          ) : (
            reservas.map((reserva) => (
              <tr key={reserva.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reserva.codigo_reserva}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(reserva.fecha_creacion)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reserva.huesped_principal.nombre} {reserva.huesped_principal.apellido}
                  </div>
                  <div className="text-xs text-gray-500">
                    {reserva.huesped_principal.email}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reserva.nombre_inmueble}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <div>E: {formatDate(reserva.fecha_entrada)}</div>
                    <div>S: {formatDate(reserva.fecha_salida)}</div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {calcularNoches(reserva.fecha_entrada, reserva.fecha_salida)} noche(s)
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-900 font-medium">
                      {reserva.numero_huespedes}
                    </span>
                    <button
                      onClick={() => onViewHuespedes(reserva)}
                      className="inline-flex items-center p-1 rounded-md text-tourism-teal hover:bg-tourism-teal/10 hover:text-tourism-teal transition-colors"
                      title="Ver lista de huéspedes"
                    >
                      <Users className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(reserva.precio_total)}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={getEstadoBadge(reserva.estado)}>
                    {reserva.estado.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onViewDetail(reserva)}
                      className="inline-flex items-center p-2 rounded-md text-green-600 hover:bg-green-50 hover:text-green-800 transition-colors"
                      title="Ver detalles de la reserva"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onEdit(reserva)}
                      disabled={!canEdit}
                      className={`inline-flex items-center p-2 rounded-md transition-colors ${
                        canEdit
                          ? 'text-blue-600 hover:bg-blue-50 hover:text-blue-800'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      title={canEdit ? 'Editar reserva' : 'No tienes permisos para editar'}
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(reserva)}
                      disabled={!canDelete}
                      className={`inline-flex items-center p-2 rounded-md transition-colors ${
                        canDelete
                          ? 'text-red-600 hover:bg-red-50 hover:text-red-800'
                          : 'text-gray-400 cursor-not-allowed'
                      }`}
                      title={canDelete ? 'Eliminar reserva' : 'No tienes permisos para eliminar'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReservasTable;
