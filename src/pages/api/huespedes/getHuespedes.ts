import { NextApiRequest, NextApiResponse } from 'next';
import { IHuespedTableData } from '../../../interfaces/Huesped';

// Función para mapear la respuesta de la API externa a nuestro formato
const mapHuespedFromAPI = (huespedAPI: any): IHuespedTableData => {
  return {
    id_huesped: huespedAPI.id_huesped || huespedAPI.id,
    nombre: huespedAPI.nombre || 'Sin nombre',
    apellido: huespedAPI.apellido || 'Sin apellido',
    documento_numero: huespedAPI.documento_numero || 'Sin documento',
    email: huespedAPI.email || 'Sin email',
    telefono: huespedAPI.telefono || 'Sin teléfono',
    estado: huespedAPI.estado === 'activo' || huespedAPI.estado === true ? 'activo' : 'inactivo'
  };
};

// Datos simulados para desarrollo
const mockHuespedes: IHuespedTableData[] = [
  {
    id_huesped: 1,
    nombre: 'Juan Carlos',
    apellido: 'Pérez González',
    documento_numero: '12345678',
    email: 'juan.perez@email.com',
    telefono: '+57 300 123 4567',
    estado: 'activo'
  },
  {
    id_huesped: 2,
    nombre: 'María Elena',
    apellido: 'García Rodríguez',
    documento_numero: '23456789',
    email: 'maria.garcia@email.com',
    telefono: '+57 301 234 5678',
    estado: 'activo'
  },
  {
    id_huesped: 3,
    nombre: 'Carlos Alberto',
    apellido: 'López Martínez',
    documento_numero: '34567890',
    email: 'carlos.lopez@email.com',
    telefono: '+57 302 345 6789',
    estado: 'inactivo'
  },
  {
    id_huesped: 4,
    nombre: 'Ana Sofía',
    apellido: 'Hernández Silva',
    documento_numero: '45678901',
    email: 'ana.hernandez@email.com',
    telefono: '+57 303 456 7890',
    estado: 'activo'
  },
  {
    id_huesped: 5,
    nombre: 'Roberto',
    apellido: 'Morales Castro',
    documento_numero: '56789012',
    email: 'roberto.morales@email.com',
    telefono: '+57 304 567 8901',
    estado: 'activo'
  },
  {
    id_huesped: 6,
    nombre: 'Patricia',
    apellido: 'Vargas Ruiz',
    documento_numero: '67890123',
    email: 'patricia.vargas@email.com',
    telefono: '+57 305 678 9012',
    estado: 'activo'
  }
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      isError: true,
      data: null,
      message: 'Método no permitido'
    });
  }

  try {
    const { id_empresa } = req.query;
    
    console.log('Returning mock data for huespedes');
    console.log('Query params:', { id_empresa });
    
    // Simular pequeña demora para mostrar el loading
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retornar datos simulados
    let huespedes = [...mockHuespedes];

    // Filtrar por empresa si se proporciona (simulado)
    if (id_empresa) {
      console.log(`Filtering by empresa: ${id_empresa}`);
      // Para la simulación, todos los huéspedes pertenecen a la empresa 1
      if (parseInt(id_empresa as string) !== 1) {
        huespedes = [];
      }
    }

    console.log('Returning huespedes:', huespedes.length);

    res.status(200).json({
      isError: false,
      data: huespedes,
      message: 'Huéspedes obtenidos exitosamente (datos simulados)'
    });

  } catch (error) {
    console.error('Error in getHuespedes API:', error);
    
    res.status(500).json({
      isError: true,
      data: null,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}