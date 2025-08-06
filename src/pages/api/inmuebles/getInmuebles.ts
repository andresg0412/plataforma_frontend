import type { NextApiRequest, NextApiResponse } from 'next';
import { IInmueble } from '../../../interfaces/Inmueble';

// Datos mockeados para la simulación
const mockInmuebles: IInmueble[] = [
  {
    id: '1',
    nombre: 'Apartamento Centro',
    direccion: 'Calle 10 #5-20, Centro',
    tipo: 'apartamento',
    estado: 'disponible',
    precio: 800000,
    descripcion: 'Hermoso apartamento en el centro de la ciudad',
    habitaciones: 2,
    banos: 1,
    area: 65,
    id_empresa: '1',
    nombre_empresa: 'Inmobiliaria Central',
    fecha_creacion: '2025-01-01T10:00:00Z',
    fecha_actualizacion: '2025-01-01T10:00:00Z'
  },
  {
    id: '2',
    nombre: 'Casa Familiar Norte',
    direccion: 'Carrera 15 #25-10, Norte',
    tipo: 'casa',
    estado: 'ocupado',
    precio: 1200000,
    descripcion: 'Casa amplia ideal para familias',
    habitaciones: 4,
    banos: 3,
    area: 120,
    id_empresa: '1',
    nombre_empresa: 'Inmobiliaria Central',
    fecha_creacion: '2025-01-02T10:00:00Z',
    fecha_actualizacion: '2025-01-05T15:30:00Z'
  },
  {
    id: '3',
    nombre: 'Studio Zona Rosa',
    direccion: 'Calle 80 #12-34, Zona Rosa',
    tipo: 'studio',
    estado: 'disponible',
    precio: 600000,
    descripcion: 'Studio moderno en zona exclusiva',
    habitaciones: 1,
    banos: 1,
    area: 35,
    id_empresa: '2',
    nombre_empresa: 'Propiedades Premium',
    fecha_creacion: '2025-01-03T10:00:00Z',
    fecha_actualizacion: '2025-01-03T10:00:00Z'
  },
  {
    id: '4',
    nombre: 'Penthouse Vista Mar',
    direccion: 'Avenida Costera #100-50, Bocagrande',
    tipo: 'penthouse',
    estado: 'mantenimiento',
    precio: 2500000,
    descripcion: 'Penthouse de lujo con vista al mar',
    habitaciones: 3,
    banos: 4,
    area: 180,
    id_empresa: '2',
    nombre_empresa: 'Propiedades Premium',
    fecha_creacion: '2025-01-04T10:00:00Z',
    fecha_actualizacion: '2025-01-05T08:00:00Z'
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Método no permitido' });
  }

  try {
    // Simulación de delay de red usando Promise
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simulación de respuesta exitosa
    res.status(200).json({
      success: true,
      data: mockInmuebles,
      message: 'Inmuebles obtenidos exitosamente'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
