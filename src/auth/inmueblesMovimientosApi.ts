import { IInmueble, IInmuebleApiResponse } from '../interfaces/Inmueble';

// Mock data para inmuebles (para usar en el modal de movimientos)
const mockInmuebles: IInmueble[] = [
  {
    id: '1',
    id_inmueble: 'INM001',
    nombre: 'Apartamento Centro 101',
    direccion: 'Carrera 7 # 26-85',
    edificio: 'Torre Central',
    apartamento: '101',
    comision: 10,
    id_propietario: '1',
    tipo: 'apartamento',
    estado: 'disponible',
    precio: 250000,
    precio_limpieza: 50000,
    id_producto_sigo: 'SIGO001',
    descripcion: 'Apartamento en el centro de la ciudad',
    capacidad_maxima: 4,
    habitaciones: 2,
    banos: 2,
    area: 65,
    tiene_cocina: true,
    id_empresa: '1',
    nombre_empresa: 'WaiwaHost',
    fecha_creacion: '2025-01-01',
    fecha_actualizacion: '2025-01-01'
  },
  {
    id: '2',
    id_inmueble: 'INM002',
    nombre: 'Casa Zona Rosa',
    direccion: 'Calle 85 # 15-23',
    edificio: '',
    apartamento: '',
    comision: 12,
    id_propietario: '2',
    tipo: 'casa',
    estado: 'disponible',
    precio: 350000,
    precio_limpieza: 75000,
    id_producto_sigo: 'SIGO002',
    descripcion: 'Casa completa en zona rosa',
    capacidad_maxima: 6,
    habitaciones: 3,
    banos: 3,
    area: 120,
    tiene_cocina: true,
    id_empresa: '1',
    nombre_empresa: 'WaiwaHost',
    fecha_creacion: '2025-01-01',
    fecha_actualizacion: '2025-01-01'
  },
  {
    id: '3',
    id_inmueble: 'INM003',
    nombre: 'Studio Chapinero 205',
    direccion: 'Carrera 13 # 63-42',
    edificio: 'Edificio Norte',
    apartamento: '205',
    comision: 8,
    id_propietario: '3',
    tipo: 'studio',
    estado: 'disponible',
    precio: 180000,
    precio_limpieza: 40000,
    id_producto_sigo: 'SIGO003',
    descripcion: 'Studio moderno en Chapinero',
    capacidad_maxima: 2,
    habitaciones: 1,
    banos: 1,
    area: 35,
    tiene_cocina: true,
    id_empresa: '1',
    nombre_empresa: 'WaiwaHost',
    fecha_creacion: '2025-01-01',
    fecha_actualizacion: '2025-01-01'
  }
];

// Simular delay de red
const delay = (ms: number = 300): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

export const getInmueblesForMovimientos = async (): Promise<IInmuebleApiResponse> => {
  await delay();
  try {
    return {
      success: true,
      data: mockInmuebles,
      message: 'Inmuebles obtenidos exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener inmuebles',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};