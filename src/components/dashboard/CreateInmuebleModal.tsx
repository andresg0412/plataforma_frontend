/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { IInmuebleForm } from '../../interfaces/Inmueble';
import { useAuth } from '../../auth/AuthContext';

interface CreateInmuebleModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (inmueble: IInmuebleForm) => void;
  initialData?: Partial<IInmuebleForm>;
  isEdit?: boolean;
}

const CreateInmuebleModal: React.FC<CreateInmuebleModalProps> = ({
  open,
  onClose,
  onCreate,
  initialData,
  isEdit = false
}) => {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<IInmuebleForm>({
    defaultValues: initialData || {
      nombre: '',
      direccion: '',
      tipo: 'apartamento',
      estado: 'disponible',
      precio: 0,
      descripcion: '',
      habitaciones: 1,
      banos: 1,
      area: 0,
      id_empresa: '1' // Por ahora usamos un valor predeterminado
    }
  });

  useEffect(() => {
    if (open && initialData) {
      reset(initialData);
    } else if (open && !isEdit) {
      reset({
        nombre: '',
        direccion: '',
        tipo: 'apartamento',
        estado: 'disponible',
        precio: 0,
        descripcion: '',
        habitaciones: 1,
        banos: 1,
        area: 0,
        id_empresa: '1' // Por ahora usamos un valor predeterminado
      });
    }
  }, [open, initialData, isEdit, reset, user]);

  const onSubmit = async (data: IInmuebleForm) => {
    try {
      await onCreate(data);
      if (!isEdit) {
        reset();
      }
    } catch (error) {
      console.error('Error al procesar inmueble:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {isEdit ? 'Editar Inmueble' : 'Crear Nuevo Inmueble'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Información básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del Inmueble *
                </label>
                <input
                  type="text"
                  {...register('nombre', { required: 'El nombre es requerido' })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="Ej: Apartamento Centro"
                  disabled={isEdit}
                />
                {errors.nombre && (
                  <p className="text-red-500 text-xs mt-1">{errors.nombre.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Inmueble *
                </label>
                <select
                  {...register('tipo', { required: 'El tipo es requerido' })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  disabled={isEdit}
                >
                  <option value="apartamento">Apartamento</option>
                  <option value="casa">Casa</option>
                  <option value="studio">Studio</option>
                  <option value="penthouse">Penthouse</option>
                  <option value="oficina">Oficina</option>
                  <option value="local">Local Comercial</option>
                </select>
                {errors.tipo && (
                  <p className="text-red-500 text-xs mt-1">{errors.tipo.message}</p>
                )}
              </div>
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Dirección *
              </label>
              <input
                type="text"
                {...register('direccion', { required: 'La dirección es requerida' })}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Ej: Calle 10 #5-20, Centro"
                disabled={isEdit}
              />
              {errors.direccion && (
                <p className="text-red-500 text-xs mt-1">{errors.direccion.message}</p>
              )}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                {...register('descripcion')}
                rows={3}
                className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                placeholder="Descripción del inmueble"
              />
            </div>

            {/* Precio y Estado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio (COP) *
                </label>
                <input
                  type="number"
                  {...register('precio', { 
                    required: 'El precio es requerido',
                    min: { value: 0, message: 'El precio debe ser mayor a 0' }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="800000"
                />
                {errors.precio && (
                  <p className="text-red-500 text-xs mt-1">{errors.precio.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Estado *
                </label>
                <select
                  {...register('estado', { required: 'El estado es requerido' })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                >
                  <option value="disponible">Disponible</option>
                  <option value="ocupado">Ocupado</option>
                  <option value="mantenimiento">En Mantenimiento</option>
                  <option value="inactivo">Inactivo</option>
                </select>
                {errors.estado && (
                  <p className="text-red-500 text-xs mt-1">{errors.estado.message}</p>
                )}
              </div>
            </div>

            {/* Características */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Habitaciones *
                </label>
                <input
                  type="number"
                  {...register('habitaciones', { 
                    required: 'Las habitaciones son requeridas',
                    min: { value: 0, message: 'Debe ser mayor o igual a 0' }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="2"
                />
                {errors.habitaciones && (
                  <p className="text-red-500 text-xs mt-1">{errors.habitaciones.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Baños *
                </label>
                <input
                  type="number"
                  {...register('banos', { 
                    required: 'Los baños son requeridos',
                    min: { value: 1, message: 'Debe tener al menos 1 baño' }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="1"
                />
                {errors.banos && (
                  <p className="text-red-500 text-xs mt-1">{errors.banos.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Área (m²) *
                </label>
                <input
                  type="number"
                  {...register('area', { 
                    required: 'El área es requerida',
                    min: { value: 1, message: 'El área debe ser mayor a 0' }
                  })}
                  className="w-full p-2 border border-gray-300 rounded-md dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  placeholder="65"
                />
                {errors.area && (
                  <p className="text-red-500 text-xs mt-1">{errors.area.message}</p>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isSubmitting ? 'Procesando...' : (isEdit ? 'Actualizar' : 'Crear')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateInmuebleModal;
