import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '../atoms/Button';
import { IReservaForm, IHuespedForm } from '../../interfaces/Reserva';
import { getInmueblesApi } from '../../auth/getInmueblesApi';
import { IInmueble } from '../../interfaces/Inmueble';

interface CreateReservaModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: IReservaForm) => void;
  initialData?: IReservaForm;
  isEdit?: boolean;
}

const CreateReservaModal: React.FC<CreateReservaModalProps> = ({
  open,
  onClose,
  onCreate,
  initialData,
  isEdit = false
}) => {
  const [formData, setFormData] = useState<IReservaForm>({
    id_inmueble: 0,
    fecha_entrada: '',
    fecha_salida: '',
    numero_huespedes: 1,
    huespedes: [
      {
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        documento_tipo: 'cedula',
        documento_numero: '',
        fecha_nacimiento: '',
        es_principal: true,
      }
    ],
    precio_total: 0,
    estado: 'pendiente',
    observaciones: '',
    id_empresa: 1, // Por ahora hardcodeado
  });

  const [errors, setErrors] = useState<Partial<Record<keyof IReservaForm, string>>>({});
  const [inmuebles, setInmuebles] = useState<IInmueble[]>([]);
  const [loadingInmuebles, setLoadingInmuebles] = useState(false);

  // Función para cargar inmuebles desde la API
  const loadInmuebles = async () => {
    try {
      setLoadingInmuebles(true);
      console.log('🏠 Cargando inmuebles disponibles...');
      const inmueblesData = await getInmueblesApi();
      
      // Filtrar solo inmuebles disponibles/activos para reservas
      const inmueblesDisponibles = inmueblesData.filter(
        inmueble => inmueble.estado === 'disponible'
      );
      
      setInmuebles(inmueblesDisponibles);
      console.log('✅ Inmuebles cargados:', inmueblesDisponibles.length);
    } catch (error) {
      console.error('❌ Error cargando inmuebles:', error);
      setInmuebles([]);
    } finally {
      setLoadingInmuebles(false);
    }
  };

  useEffect(() => {
    if (open) {
      // Cargar inmuebles cuando se abre el modal
      loadInmuebles();
      
      if (initialData) {
        setFormData(initialData);
      } else {
        setFormData({
          id_inmueble: 0,
          fecha_entrada: '',
          fecha_salida: '',
          numero_huespedes: 1,
          huespedes: [
            {
              nombre: '',
              apellido: '',
              email: '',
              telefono: '',
              documento_tipo: 'cedula',
              documento_numero: '',
              fecha_nacimiento: '',
              es_principal: true,
            }
          ],
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

    // Validar huéspedes
    if (formData.huespedes.length === 0) {
      newErrors.huespedes = 'Debe haber al menos un huésped';
    } else {
      // Validar que cada huésped tenga los datos completos
      for (let i = 0; i < formData.huespedes.length; i++) {
        const huesped = formData.huespedes[i];
        
        if (!huesped.nombre.trim()) {
          newErrors.huespedes = `El nombre del huésped ${i + 1} es requerido`;
          break;
        }
        
        if (!huesped.apellido.trim()) {
          newErrors.huespedes = `El apellido del huésped ${i + 1} es requerido`;
          break;
        }
        
        if (!huesped.email.trim()) {
          newErrors.huespedes = `El email del huésped ${i + 1} es requerido`;
          break;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(huesped.email)) {
          newErrors.huespedes = `El email del huésped ${i + 1} no es válido`;
          break;
        }
        
        if (!huesped.telefono.trim()) {
          newErrors.huespedes = `El teléfono del huésped ${i + 1} es requerido`;
          break;
        }
        
        if (!huesped.documento_numero.trim()) {
          newErrors.huespedes = `El documento del huésped ${i + 1} es requerido`;
          break;
        }
        
        if (!huesped.fecha_nacimiento) {
          newErrors.huespedes = `La fecha de nacimiento del huésped ${i + 1} es requerida`;
          break;
        }
      }
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

    if (formData.numero_huespedes !== formData.huespedes.length) {
      newErrors.numero_huespedes = 'El número de huéspedes no coincide con los datos ingresados';
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

  const handleHuespedChange = (index: number, field: keyof IHuespedForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      huespedes: prev.huespedes.map((huesped, i) => 
        i === index ? { ...huesped, [field]: value } : huesped
      )
    }));
    
    // Limpiar errores si los hay
    if (errors.huespedes) {
      setErrors(prev => ({ ...prev, huespedes: undefined }));
    }
  };

  const handleNumeroHuespedesChange = (newNumero: number) => {
    const currentHuespedes = [...formData.huespedes];
    
    if (newNumero > currentHuespedes.length) {
      // Agregar más huéspedes
      const nuevosHuespedes = [];
      for (let i = currentHuespedes.length; i < newNumero; i++) {
        nuevosHuespedes.push({
          nombre: '',
          apellido: '',
          email: '',
          telefono: '',
          documento_tipo: 'cedula' as const,
          documento_numero: '',
          fecha_nacimiento: '',
          es_principal: i === 0, // Solo el primero es principal
        });
      }
      currentHuespedes.push(...nuevosHuespedes);
    } else if (newNumero < currentHuespedes.length) {
      // Remover huéspedes (mantener siempre el principal)
      currentHuespedes.splice(newNumero);
    }

    setFormData(prev => ({
      ...prev,
      numero_huespedes: newNumero,
      huespedes: currentHuespedes
    }));
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
                disabled={loadingInmuebles}
              >
                <option value={0}>
                  {loadingInmuebles ? 'Cargando inmuebles...' : 'Selecciona un inmueble'}
                </option>
                {inmuebles.map((inmueble) => (
                  <option key={inmueble.id_inmueble} value={parseInt(inmueble.id_inmueble)}>
                    {inmueble.nombre} - {inmueble.direccion}
                  </option>
                ))}
              </select>
              {errors.id_inmueble && (
                <p className="text-red-500 text-xs mt-1">{errors.id_inmueble}</p>
              )}
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Huéspedes *
              </label>
              <input
                type="number"
                min="1"
                max="8"
                value={formData.numero_huespedes}
                onChange={(e) => handleNumeroHuespedesChange(parseInt(e.target.value) || 1)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal ${
                  errors.numero_huespedes ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.numero_huespedes && (
                <p className="text-red-500 text-xs mt-1">{errors.numero_huespedes}</p>
              )}
            </div>

            {/* Sección de Huéspedes Dinámicos */}
            <div className="col-span-2">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Información de Huéspedes
              </h3>
              {errors.huespedes && (
                <p className="text-red-500 text-sm mb-4">{errors.huespedes}</p>
              )}
              
              {formData.huespedes.map((huesped, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <h4 className="text-md font-medium text-gray-800 mb-3">
                    {index === 0 ? 'Huésped Principal' : `Huésped Acompañante ${index}`}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        value={huesped.nombre}
                        onChange={(e) => handleHuespedChange(index, 'nombre', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
                        placeholder="Nombre"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        value={huesped.apellido}
                        onChange={(e) => handleHuespedChange(index, 'apellido', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
                        placeholder="Apellido"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={huesped.email}
                        onChange={(e) => handleHuespedChange(index, 'email', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teléfono *
                      </label>
                      <input
                        type="tel"
                        value={huesped.telefono}
                        onChange={(e) => handleHuespedChange(index, 'telefono', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
                        placeholder="+57 300 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Documento *
                      </label>
                      <select
                        value={huesped.documento_tipo}
                        onChange={(e) => handleHuespedChange(index, 'documento_tipo', e.target.value as any)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
                      >
                        <option value="cedula">Cédula</option>
                        <option value="pasaporte">Pasaporte</option>
                        <option value="tarjeta_identidad">Tarjeta de Identidad</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Número de Documento *
                      </label>
                      <input
                        type="text"
                        value={huesped.documento_numero}
                        onChange={(e) => handleHuespedChange(index, 'documento_numero', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
                        placeholder="Número de documento"
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Fecha de Nacimiento *
                      </label>
                      <input
                        type="date"
                        value={huesped.fecha_nacimiento}
                        onChange={(e) => handleHuespedChange(index, 'fecha_nacimiento', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal"
                      />
                    </div>
                  </div>
                </div>
              ))}
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
