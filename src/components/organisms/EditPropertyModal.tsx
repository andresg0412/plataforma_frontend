import React, { useState, useEffect } from 'react';
import { InputField } from '../molecules/InputField';
import { Button } from '../atoms/Button';
import { Property, UpdatePropertyRequest } from '../../types/property';

interface EditPropertyModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  property: Property | null;
}

export const EditPropertyModal: React.FC<EditPropertyModalProps> = ({
  open,
  onClose,
  onSuccess,
  property,
}) => {
  const [formData, setFormData] = useState<UpdatePropertyRequest>({
    id: '',
    nombre: '',
    direccion: '',
    ciudad: '',
    precio: 0,
    tipo: '',
    estado: 'disponible',
    descripcion: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (property && open) {
      setFormData({
        id: property.id,
        nombre: property.nombre,
        direccion: property.direccion,
        ciudad: property.ciudad,
        precio: property.precio,
        tipo: property.tipo,
        estado: property.estado,
        descripcion: property.descripcion || '',
      });
      setError(null);
    }
  }, [property, open]);

  if (!open) return null;

  const handleInputChange = (field: keyof UpdatePropertyRequest) => 
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = field === 'precio' ? parseFloat(e.target.value) || 0 : e.target.value;
      setFormData(prev => ({ ...prev, [field]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`/api/properties/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar la propiedad');
      }

      onSuccess();
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-[500px] relative max-h-[90vh] overflow-y-auto">
        <button 
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700" 
          onClick={onClose}
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">Editar Propiedad</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nombre"
            value={formData.nombre}
            onChange={handleInputChange('nombre')}
            required
          />
          
          <InputField
            label="Dirección"
            value={formData.direccion}
            onChange={handleInputChange('direccion')}
            required
          />
          
          <InputField
            label="Ciudad"
            value={formData.ciudad}
            onChange={handleInputChange('ciudad')}
            required
          />
          
          <InputField
            label="Precio"
            type="number"
            value={formData.precio.toString()}
            onChange={handleInputChange('precio')}
            required
          />
          
          <InputField
            label="Tipo"
            value={formData.tipo}
            onChange={handleInputChange('tipo')}
            required
          />
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-tourism-navy">Estado</label>
            <select
              value={formData.estado}
              onChange={handleInputChange('estado')}
              className="border border-gray-200 rounded-md px-3 py-2 h-12 focus:border-tourism-teal focus:ring-tourism-teal bg-white"
              required
            >
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-tourism-navy">Descripción</label>
            <textarea
              value={formData.descripcion}
              onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
              className="border border-gray-200 rounded-md px-3 py-2 min-h-[80px] focus:border-tourism-teal focus:ring-tourism-teal bg-white resize-vertical"
              placeholder="Descripción opcional de la propiedad"
            />
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
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};