import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IReservaForm } from '../../interfaces/Reserva';

interface CreateReservaModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: IReservaForm) => void;
  initialData?: IReservaForm;
  isEdit?: boolean;
}

// Mock de inmuebles disponibles
const mockInmuebles = [
  { id: 1, nombre: 'Apartamento Centro Histórico' },
  { id: 2, nombre: 'Casa de Playa Cartagena' },
  { id: 3, nombre: 'Loft Zona Rosa' },
  { id: 4, nombre: 'Estudio Chapinero' },
];

const CreateReservaModal: React.FC<CreateReservaModalProps> = ({
  open,
  onClose,
  onCreate,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<IReservaForm>({
    id_inmueble: 0,
    huesped_nombre: '',
    huesped_email: '',
    huesped_telefono: '',
    fecha_entrada: '',
    fecha_salida: '',
    numero_huespedes: 1,
    precio_total: 0,
    estado: 'pendiente',
    observaciones: '',
    id_empresa: 1, // Por ahora hardcodeado
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IReservaForm, string>>>({});

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          id_inmueble: 0,
          huesped_nombre: '',
          huesped_email: '',
          huesped_telefono: '',
          fecha_entrada: '',
          fecha_salida: '',
          numero_huespedes: 1,
          precio_total: 0,
          estado: 'pendiente',
          observaciones: '',
          id_empresa: 1,
        });
      }
      setErrors({});
    }
  }, [open, initialData]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof IReservaForm, string>> = {};

    if (!formData.id_inmueble) {
      newErrors.id_inmueble = 'Debes seleccionar un inmueble';
    }

    if (!formData.huesped_nombre.trim()) {
      newErrors.huesped_nombre = 'El nombre del huésped es requerido';
    }

    if (!formData.huesped_email.trim()) {
      newErrors.huesped_email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.huesped_email)) {
      newErrors.huesped_email = 'El email no es válido';
    }

    if (!formData.huesped_telefono.trim()) {
      newErrors.huesped_telefono = 'El teléfono es requerido';
    }

    if (!formData.fecha_entrada) {
      newErrors.fecha_entrada = 'La fecha de entrada es requerida';
    }

    if (!formData.fecha_salida) {
      newErrors.fecha_salida = 'La fecha de salida es requerida';
    }

    if (formData.fecha_entrada && formData.fecha_salida) {
      if (new Date(formData.fecha_entrada) >= new Date(formData.fecha_salida)) {
        newErrors.fecha_salida = 'La fecha de salida debe ser posterior a la entrada';
      }
    }

    if (formData.numero_huespedes < 1) {
      newErrors.numero_huespedes = 'Debe haber al menos 1 huésped';
    }

    if (formData.precio_total <= 0) {
      newErrors.precio_total = 'El precio debe ser mayor a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onCreate(formData);
    }
  };

  const handleInputChange = (field: keyof IReservaForm, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {isEdit ? 'Editar Reserva' : 'Crear Nueva Reserva'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Inmueble *
              </label>
              <select
                value={formData.id_inmueble}
                onChange={(e) => handleInputChange('id_inmueble', parseInt(e.target.value))}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.id_inmueble ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value={0}>Selecciona un inmueble</option>
                {mockInmuebles.map(inmueble => (
                  <option key={inmueble.id} value={inmueble.id}>
                    {inmueble.nombre}
                  </option>
                ))}
              </select>
              {errors.id_inmueble && (
                <p className="text-red-500 text-xs mt-1">{errors.id_inmueble}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Huésped *
              </label>
              <input
                type="text"
                value={formData.huesped_nombre}
                onChange={(e) => handleInputChange('huesped_nombre', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.huesped_nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Nombre completo"
              />
              {errors.huesped_nombre && (
                <p className="text-red-500 text-xs mt-1">{errors.huesped_nombre}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email del Huésped *
              </label>
              <input
                type="email"
                value={formData.huesped_email}
                onChange={(e) => handleInputChange('huesped_email', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.huesped_email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="correo@ejemplo.com"
              />
              {errors.huesped_email && (
                <p className="text-red-500 text-xs mt-1">{errors.huesped_email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono del Huésped *
              </label>
              <input
                type="tel"
                value={formData.huesped_telefono}
                onChange={(e) => handleInputChange('huesped_telefono', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.huesped_telefono ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="+57 300 123 4567"
              />
              {errors.huesped_telefono && (
                <p className="text-red-500 text-xs mt-1">{errors.huesped_telefono}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Huéspedes *
              </label>
              <input
                type="number"
                min="1"
                value={formData.numero_huespedes}
                onChange={(e) => handleInputChange('numero_huespedes', parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.numero_huespedes ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.numero_huespedes && (
                <p className="text-red-500 text-xs mt-1">{errors.numero_huespedes}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Entrada *
              </label>
              <input
                type="date"
                value={formData.fecha_entrada}
                onChange={(e) => handleInputChange('fecha_entrada', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.fecha_entrada ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fecha_entrada && (
                <p className="text-red-500 text-xs mt-1">{errors.fecha_entrada}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Salida *
              </label>
              <input
                type="date"
                value={formData.fecha_salida}
                onChange={(e) => handleInputChange('fecha_salida', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.fecha_salida ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.fecha_salida && (
                <p className="text-red-500 text-xs mt-1">{errors.fecha_salida}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio Total *
              </label>
              <input
                type="number"
                min="0"
                step="1000"
                value={formData.precio_total}
                onChange={(e) => handleInputChange('precio_total', parseFloat(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.precio_total ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ej: 150000"
              />
              {errors.precio_total && (
                <p className="text-red-500 text-xs mt-1">{errors.precio_total}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado *
              </label>
              <select
                value={formData.estado}
                onChange={(e) => handleInputChange('estado', e.target.value as any)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
              >
                <option value="pendiente">Pendiente</option>
                <option value="confirmada">Confirmada</option>
                <option value="en_proceso">En Proceso</option>
                <option value="completada">Completada</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observaciones
              </label>
              <textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
                placeholder="Observaciones adicionales..."
                rows={3}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-tourism-teal text-white hover:bg-tourism-teal/90"
            >
              {isEdit ? 'Actualizar' : 'Crear'} Reserva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateReservaModal;
