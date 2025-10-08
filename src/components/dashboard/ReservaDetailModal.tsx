import React from 'react';
import { X, Calendar, User, MapPin, CreditCard, Users, Clock } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IReservaTableData } from '../../interfaces/Reserva';

interface ReservaDetailModalProps {
  open: boolean;
  onClose: () => void;
  reserva: IReservaTableData | null;
}

const ReservaDetailModal: React.FC<ReservaDetailModalProps> = ({
  open,
  onClose,
  reserva
}) => {
  if (!open || !reserva) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getEstadoBadge = (estado: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    
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

  const calcularPrecioPorNoche = () => {
    const noches = calcularNoches(reserva.fecha_entrada, reserva.fecha_salida);
    return noches > 0 ? reserva.precio_total / noches : 0;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b bg-tourism-teal text-white">
          <h2 className="text-xl font-semibold">
            Detalle de Reserva - {reserva.codigo_reserva}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Estado y Código */}
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Información General
              </h3>
              <div className="flex items-center gap-3">
                <span className={getEstadoBadge(reserva.estado)}>
                  {reserva.estado.replace('_', ' ').toUpperCase()}
                </span>
                <span className="text-sm text-gray-500">
                  Creada el {formatDate(reserva.fecha_creacion)}
                </span>
              </div>
            </div>
          </div>

          {/* Información del Huésped */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <User className="h-5 w-5 text-tourism-teal" />
              Información del Huésped Principal
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre</label>
                <p className="text-gray-900">{reserva.huesped_principal.nombre} {reserva.huesped_principal.apellido}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Email</label>
                <p className="text-gray-900">{reserva.huesped_principal.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Teléfono</label>
                <p className="text-gray-900">{reserva.huesped_principal.telefono}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Número de Huéspedes</label>
                <p className="text-gray-900 flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {reserva.numero_huespedes} persona(s)
                </p>
              </div>
            </div>
          </div>

          {/* Lista de Todos los Huéspedes */}
          {reserva.huespedes && reserva.huespedes.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="h-5 w-5 text-tourism-teal" />
                Todos los Huéspedes ({reserva.huespedes.length})
              </h4>
              <div className="space-y-3">
                {reserva.huespedes.map((huesped) => (
                  <div 
                    key={huesped.id} 
                    className={`p-3 rounded-md border ${
                      huesped.es_principal 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-gray-900">
                        {huesped.nombre} {huesped.apellido}
                        {huesped.es_principal && (
                          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Principal
                          </span>
                        )}
                      </h5>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                      <div>
                        <span className="text-gray-600">Email:</span> 
                        <span className="text-gray-900 ml-1">{huesped.email || 'No especificado'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Teléfono:</span> 
                        <span className="text-gray-900 ml-1">{huesped.telefono || 'No especificado'}</span>
                      </div>
                      <div>
                        <span className="text-gray-600">Documento:</span> 
                        <span className="text-gray-900 ml-1">{huesped.documento_numero}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Información del Inmueble */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-tourism-teal" />
              Inmueble
            </h4>
            <p className="text-gray-900 font-medium">{reserva.nombre_inmueble}</p>
          </div>

          {/* Fechas de Estadía */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-tourism-teal" />
              Fechas de Estadía
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Entrada</label>
                <p className="text-gray-900">{formatDate(reserva.fecha_entrada)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Fecha de Salida</label>
                <p className="text-gray-900">{formatDate(reserva.fecha_salida)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Duración</label>
                <p className="text-gray-900 flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {calcularNoches(reserva.fecha_entrada, reserva.fecha_salida)} noche(s)
                </p>
              </div>
            </div>
          </div>

          {/* Información Financiera */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-tourism-teal" />
              Información Financiera
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Precio por Noche</label>
                <p className="text-gray-900 font-medium">
                  {formatCurrency(calcularPrecioPorNoche())}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total de la Reserva</label>
                <p className="text-gray-900 font-bold text-lg text-tourism-teal">
                  {formatCurrency(reserva.total_reserva || reserva.precio_total)}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Pagado/Abonado</label>
                <p className="text-gray-900 font-medium text-green-600">
                  {formatCurrency(reserva.total_pagado || 0)}
                </p>
                <p className="text-xs text-gray-500">
                  {reserva.total_pagado === 0 ? 'Sin abonos' : 
                   reserva.total_pagado === (reserva.total_reserva || reserva.precio_total) ? 'Pagado completo' : 
                   'Abono parcial'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Pendiente</label>
                <p className={`font-medium ${
                  (reserva.total_pendiente || (reserva.precio_total - (reserva.total_pagado || 0))) === 0 ? 'text-green-600' :
                  (reserva.total_pendiente || (reserva.precio_total - (reserva.total_pagado || 0))) === (reserva.total_reserva || reserva.precio_total) ? 'text-red-600' : 
                  'text-orange-600'
                }`}>
                  {formatCurrency(reserva.total_pendiente || (reserva.precio_total - (reserva.total_pagado || 0)))}
                </p>
              </div>
            </div>
          </div>

          {/* Observaciones */}
          {reserva.observaciones && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-3">Observaciones</h4>
              <p className="text-gray-700">{reserva.observaciones}</p>
            </div>
          )}

          <div className="flex justify-end pt-4">
            <Button
              onClick={onClose}
              variant="default"
              className="bg-tourism-teal text-white hover:bg-tourism-teal/90"
            >
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaDetailModal;
