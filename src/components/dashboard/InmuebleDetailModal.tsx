import React from 'react';
import { X, Home, MapPin, DollarSign, Bed, Bath, Square } from 'lucide-react';

interface InmuebleDetailModalProps {
  open: boolean;
  onClose: () => void;
  inmueble: {
    id: string;
    nombre: string;
    direccion: string;
    tipo: string;
    estado: string;
    precio: number;
    descripcion: string;
    habitaciones: number;
    banos: number;
    area: number;
  } | null;
}

const InmuebleDetailModal: React.FC<InmuebleDetailModalProps> = ({
  open,
  onClose,
  inmueble
}) => {
  if (!open || !inmueble) return null;

  const getEstadoBadge = (estado: string) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    
    switch (estado) {
      case 'disponible':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'ocupado':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'mantenimiento':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'inactivo':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getTipoBadge = (tipo: string) => {
    return "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800";
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">Detalle del Inmueble</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Home className="h-5 w-5 mr-2" />
                {inmueble.nombre}
              </h3>
              <div className="flex space-x-2">
                <span className={getTipoBadge(inmueble.tipo)}>
                  {inmueble.tipo}
                </span>
                <span className={getEstadoBadge(inmueble.estado)}>
                  {inmueble.estado}
                </span>
              </div>
            </div>
            
            <div className="flex items-center text-gray-600 mb-2">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{inmueble.direccion}</span>
            </div>
            
            <div className="flex items-center text-gray-900">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="text-lg font-semibold">{formatPrice(inmueble.precio)}</span>
              <span className="text-sm text-gray-500 ml-1">/ mes</span>
            </div>
          </div>

          {/* Características */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Características</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Bed className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">{inmueble.habitaciones}</p>
                <p className="text-xs text-gray-500">Habitaciones</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Bath className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">{inmueble.banos}</p>
                <p className="text-xs text-gray-500">Baños</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-2">
                  <Square className="h-6 w-6 text-blue-600" />
                </div>
                <p className="text-sm font-medium text-gray-900">{inmueble.area}</p>
                <p className="text-xs text-gray-500">m²</p>
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {inmueble.descripcion || 'Sin descripción disponible'}
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default InmuebleDetailModal;
