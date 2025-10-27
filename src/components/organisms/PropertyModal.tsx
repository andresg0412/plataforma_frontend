import React, { useState } from 'react';
import { InputField } from '../molecules/InputField';
import { Button } from '../atoms/Button';
import { useAuth } from '../../auth/AuthContext';

interface PropertyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const PropertyModal: React.FC<PropertyModalProps> = ({ open, onClose, onSuccess }) => {
  const { token } = useAuth();
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [idPropietario, setIdPropietario] = useState('');
  const [idEmpresa, setIdEmpresa] = useState('');
  const [estado, setEstado] = useState('activo');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const isValid = nombre.trim() && direccion.trim() && capacidad.trim() && idPropietario.trim() && idEmpresa.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!isValid) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    const capacidadNumber = parseInt(capacidad);
    if (isNaN(capacidadNumber) || capacidadNumber <= 0) {
      setError('La capacidad debe ser un número válido mayor a 0.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify({
          nombre: nombre.trim(),
          direccion: direccion.trim(),
          capacidad: capacidadNumber,
          id_propietario: idPropietario.trim(),
          id_empresa: idEmpresa.trim(),
          estado
        }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Error al crear el inmueble');
      }
      
      // Reset form
      setNombre('');
      setDireccion('');
      setCapacidad('');
      setIdPropietario('');
      setIdEmpresa('');
      setEstado('activo');
      
      onSuccess();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 max-h-[90vh] overflow-y-auto relative">
        <button 
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700" 
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">Registrar Nuevo Inmueble</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField 
            label="Nombre del inmueble" 
            type="text" 
            value={nombre} 
            onChange={e => setNombre(e.target.value)} 
            placeholder="Ej: Casa Vista al Mar"
            required 
          />
          
          <InputField 
            label="Dirección" 
            type="text" 
            value={direccion} 
            onChange={e => setDireccion(e.target.value)} 
            placeholder="Ej: Calle 123 #45-67"
            required 
          />
          
          <InputField 
            label="Capacidad" 
            type="number" 
            value={capacidad} 
            onChange={e => setCapacidad(e.target.value)} 
            placeholder="Número de personas"
            required 
          />
          
          <InputField 
            label="ID Propietario" 
            type="text" 
            value={idPropietario} 
            onChange={e => setIdPropietario(e.target.value)} 
            placeholder="ID del propietario"
            required 
          />
          
          <InputField 
            label="ID Empresa" 
            type="text" 
            value={idEmpresa} 
            onChange={e => setIdEmpresa(e.target.value)} 
            placeholder="ID de la empresa"
            required 
          />
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-tourism-navy">Estado</label>
            <select 
              value={estado} 
              onChange={e => setEstado(e.target.value)}
              className="border border-gray-200 rounded-md px-3 py-2 h-12 focus:border-tourism-teal focus:ring-tourism-teal bg-white"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="mantenimiento">En Mantenimiento</option>
            </select>
          </div>
          
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          
          <div className="flex gap-2 mt-6">
            <Button 
              type="button" 
              variant="secondary" 
              className="flex-1 !bg-[var(--gray-400)] !text-white" 
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 !bg-[var(--primary)] !text-white" 
              disabled={loading || !isValid}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};