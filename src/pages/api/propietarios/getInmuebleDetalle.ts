import { NextApiRequest, NextApiResponse } from 'next';

// Data mockeada para inmuebles
const mockInmuebles = {
  'INM001': {
    id: 'INM001',
    nombre: 'Apartamento Vista Norte',
    direccion: 'Carrera 15 #85-23, Bogotá',
    tipo: 'apartamento',
    estado: 'disponible',
    precio: 1500000,
    descripcion: 'Hermoso apartamento con vista panorámica de la ciudad, ubicado en zona exclusiva.',
    habitaciones: 3,
    banos: 2,
    area: 85,
    id_propietario: 1,
    fecha_creacion: '2024-01-15',
    fecha_actualizacion: '2024-01-15'
  },
  'INM002': {
    id: 'INM002',
    nombre: 'Casa Familiar Los Rosales',
    direccion: 'Calle 72 #11-45, Bogotá',
    tipo: 'casa',
    estado: 'ocupado',
    precio: 2800000,
    descripcion: 'Casa familiar de dos pisos en barrio residencial tranquilo.',
    habitaciones: 4,
    banos: 3,
    area: 150,
    id_propietario: 2,
    fecha_creacion: '2024-02-10',
    fecha_actualizacion: '2024-02-10'
  },
  'INM003': {
    id: 'INM003',
    nombre: 'Studio Moderno Centro',
    direccion: 'Carrera 10 #20-30, Bogotá',
    tipo: 'studio',
    estado: 'mantenimiento',
    precio: 900000,
    descripcion: 'Studio moderno en el centro de la ciudad, ideal para profesionales.',
    habitaciones: 1,
    banos: 1,
    area: 45,
    id_propietario: 1,
    fecha_creacion: '2024-01-28',
    fecha_actualizacion: '2024-03-01'
  },
  'INM004': {
    id: 'INM004',
    nombre: 'Penthouse Luxury',
    direccion: 'Carrera 10 #30-55, Cali',
    tipo: 'penthouse',
    estado: 'disponible',
    precio: 4500000,
    descripcion: 'Lujoso penthouse con terraza privada y acabados de primera calidad.',
    habitaciones: 5,
    banos: 4,
    area: 220,
    id_propietario: 4,
    fecha_creacion: '2024-03-05',
    fecha_actualizacion: '2024-03-05'
  },
  'INM005': {
    id: 'INM005',
    nombre: 'Oficina Ejecutiva',
    direccion: 'Avenida El Poblado #45-67, Cali',
    tipo: 'oficina',
    estado: 'disponible',
    precio: 1200000,
    descripcion: 'Oficina ejecutiva en edificio corporativo con excelente ubicación.',
    habitaciones: 0,
    banos: 1,
    area: 60,
    id_propietario: 4,
    fecha_creacion: '2024-03-05',
    fecha_actualizacion: '2024-03-05'
  }
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      isError: true,
      data: null,
      message: 'Método no permitido'
    });
  }

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        isError: true,
        data: null,
        message: 'ID del inmueble es requerido'
      });
    }

    const inmueble = mockInmuebles[id as keyof typeof mockInmuebles];

    if (!inmueble) {
      return res.status(404).json({
        isError: true,
        data: null,
        message: 'Inmueble no encontrado'
      });
    }

    // Simular delay de red
    setTimeout(() => {
      res.status(200).json({
        isError: false,
        data: inmueble,
        message: 'Detalle del inmueble obtenido exitosamente'
      });
    }, 400);

  } catch (error) {
    res.status(500).json({
      isError: true,
      data: null,
      message: 'Error interno del servidor'
    });
  }
}
