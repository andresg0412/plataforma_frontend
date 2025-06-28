import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../auth/apiFetch';
import type { Inmueble } from '../../../libs/types';

const Properties: React.FC = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInmuebles = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiFetch('/api/inmuebles');
        setInmuebles(data);
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Error al cargar inmuebles');
      } finally {
        setLoading(false);
      }
    };

    fetchInmuebles();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-tourism-navy">Inmuebles</h2>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tourism-teal"></div>
          <span className="ml-2 text-gray-600">Cargando inmuebles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4 text-tourism-navy">Inmuebles</h2>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-tourism-navy">Inmuebles</h2>
        <button
          onClick={() => window.location.reload()}
          className="px-3 py-1 text-sm bg-tourism-teal text-white rounded hover:bg-tourism-teal/80 transition-colors"
        >
          Actualizar
        </button>
      </div>
      
      {inmuebles.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">No hay inmuebles disponibles</p>
          <p className="text-gray-400 text-sm mt-2">Contacte al administrador para agregar inmuebles</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-tourism-sage/10">
                <tr>
                  <th className="text-left p-4 font-semibold text-tourism-navy">Nombre</th>
                  <th className="text-left p-4 font-semibold text-tourism-navy">Dirección</th>
                  <th className="text-left p-4 font-semibold text-tourism-navy">Capacidad</th>
                  <th className="text-left p-4 font-semibold text-tourism-navy">ID Propietario</th>
                  <th className="text-left p-4 font-semibold text-tourism-navy">ID Empresa</th>
                  <th className="text-left p-4 font-semibold text-tourism-navy">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {inmuebles.map((inmueble) => (
                  <tr key={inmueble.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900">{inmueble.nombre}</td>
                    <td className="p-4 text-gray-700">{inmueble.direccion}</td>
                    <td className="p-4 text-gray-700">{inmueble.capacidad} personas</td>
                    <td className="p-4 text-gray-700">{inmueble.id_propietario}</td>
                    <td className="p-4 text-gray-700">{inmueble.id_empresa}</td>
                    <td className="p-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        inmueble.estado === 'activo' 
                          ? 'bg-green-100 text-green-800'
                          : inmueble.estado === 'inactivo'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {inmueble.estado.charAt(0).toUpperCase() + inmueble.estado.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-700">
              Total: <span className="font-semibold">{inmuebles.length}</span> inmuebles
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
