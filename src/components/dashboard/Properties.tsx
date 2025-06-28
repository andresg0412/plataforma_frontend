import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { DeletePropertyModal } from '../organisms/DeletePropertyModal';
import { apiFetch } from '../../auth/apiFetch';

// Tipo de inmueble/propiedad
type Property = {
  id: string;
  nombre: string;
  direccion: string;
  tipo: string;
  precio: number;
  estado: 'disponible' | 'ocupado' | 'mantenimiento';
};

// Datos mock para desarrollo
const mockProperties: Property[] = [
  {
    id: '1',
    nombre: 'Casa de Playa Marbella',
    direccion: 'Calle 15 #123, Marbella',
    tipo: 'Casa',
    precio: 250000,
    estado: 'disponible'
  },
  {
    id: '2',
    nombre: 'Apartamento Centro',
    direccion: 'Carrera 10 #45-67, Centro',
    tipo: 'Apartamento',
    precio: 180000,
    estado: 'ocupado'
  },
  {
    id: '3',
    nombre: 'Villa Campestre',
    direccion: 'Vereda El Paraíso, Km 5',
    tipo: 'Villa',
    precio: 350000,
    estado: 'mantenimiento'
  }
];

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [deleteModal, setDeleteModal] = useState<{
    open: boolean;
    property: Property | null;
  }>({ open: false, property: null });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDeleteClick = (property: Property) => {
    setDeleteModal({ open: true, property });
    setError(null);
    setSuccessMessage(null);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!deleteModal.property) return;

    try {
      // Llamar a la API interna de Next.js para eliminar
      await apiFetch(`/api/properties/${deleteModal.property.id}`, {
        method: 'DELETE',
      });

      // Remover la propiedad de la lista local
      setProperties(prev => prev.filter(p => p.id !== deleteModal.property!.id));
      
      // Mostrar mensaje de éxito
      setSuccessMessage(`Propiedad "${deleteModal.property.nombre}" eliminada exitosamente`);
      
      // Cerrar modal
      setDeleteModal({ open: false, property: null });
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccessMessage(null), 3000);
      
    } catch (error: unknown) {
      throw new Error(error instanceof Error ? error.message : 'Error al eliminar la propiedad');
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, property: null });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadge = (estado: Property['estado']) => {
    const colors = {
      disponible: 'bg-green-100 text-green-800',
      ocupado: 'bg-red-100 text-red-800', 
      mantenimiento: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[estado]}`}>
        {estado}
      </span>
    );
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Propiedades</h2>
      
      {/* Mensajes de éxito y error */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Dirección
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {properties.map((property) => (
              <tr key={property.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{property.nombre}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{property.direccion}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{property.tipo}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{formatPrice(property.precio)}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(property.estado)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteClick(property)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de confirmación de eliminación */}
      <DeletePropertyModal
        open={deleteModal.open}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteConfirm}
        propertyName={deleteModal.property?.nombre || ''}
      />
    </div>
  );
};

export default Properties;
