import type { NextApiRequest, NextApiResponse } from 'next';
import { IReservaTableData, IHuesped } from '../../../interfaces/Reserva';
import { PlataformaOrigen } from '../../../constants/plataformas';

// Data mockeada para huéspedes (la misma que en getReservas)
const mockHuespedes: IHuesped[] = [
  // Huéspedes para Reserva 1
  {
    id: 1,
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@email.com',
    telefono: '+57 300 123 4567',
    documento_tipo: 'cedula',
    documento_numero: '12345678',
    fecha_nacimiento: '1985-03-15',
    es_principal: true,
    id_reserva: 1,
  },
  {
    id: 2,
    nombre: 'Pedro',
    apellido: 'García',
    email: 'pedro.garcia@email.com',
    telefono: '+57 300 123 4568',
    documento_tipo: 'cedula',
    documento_numero: '87654321',
    fecha_nacimiento: '1983-07-22',
    es_principal: false,
    id_reserva: 1,
  },
  // Huéspedes para Reserva 2
  {
    id: 3,
    nombre: 'Juan Carlos',
    apellido: 'Rodríguez',
    email: 'juan.rodriguez@email.com',
    telefono: '+57 310 987 6543',
    documento_tipo: 'cedula',
    documento_numero: '23456789',
    fecha_nacimiento: '1978-11-10',
    es_principal: true,
    id_reserva: 2,
  },
  {
    id: 4,
    nombre: 'Carmen',
    apellido: 'Rodríguez',
    email: 'carmen.rodriguez@email.com',
    telefono: '+57 310 987 6544',
    documento_tipo: 'cedula',
    documento_numero: '34567890',
    fecha_nacimiento: '1980-05-18',
    es_principal: false,
    id_reserva: 2,
  },
  {
    id: 5,
    nombre: 'Sofia',
    apellido: 'Rodríguez',
    email: '',
    telefono: '',
    documento_tipo: 'cedula',
    documento_numero: '45678901',
    fecha_nacimiento: '2010-09-03',
    es_principal: false,
    id_reserva: 2,
  },
  {
    id: 6,
    nombre: 'Miguel',
    apellido: 'Rodríguez',
    email: '',
    telefono: '',
    documento_tipo: 'cedula',
    documento_numero: '56789012',
    fecha_nacimiento: '2012-12-25',
    es_principal: false,
    id_reserva: 2,
  },
  // Huéspedes para Reserva 3
  {
    id: 7,
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@email.com',
    telefono: '+57 320 456 7890',
    documento_tipo: 'pasaporte',
    documento_numero: 'AB123456',
    fecha_nacimiento: '1992-01-28',
    es_principal: true,
    id_reserva: 3,
  },
  // Huéspedes para Reserva 4
  {
    id: 8,
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@email.com',
    telefono: '+57 315 789 0123',
    documento_tipo: 'cedula',
    documento_numero: '67890123',
    fecha_nacimiento: '1975-06-14',
    es_principal: true,
    id_reserva: 4,
  },
  {
    id: 9,
    nombre: 'Isabel',
    apellido: 'López',
    email: 'isabel.lopez@email.com',
    telefono: '+57 315 789 0124',
    documento_tipo: 'cedula',
    documento_numero: '78901234',
    fecha_nacimiento: '1977-09-20',
    es_principal: false,
    id_reserva: 4,
  },
  // Huéspedes para Reserva 5
  {
    id: 10,
    nombre: 'Laura',
    apellido: 'Fernández',
    email: 'laura.fernandez@email.com',
    telefono: '+57 318 555 0123',
    documento_tipo: 'cedula',
    documento_numero: '89012345',
    fecha_nacimiento: '1988-04-12',
    es_principal: true,
    id_reserva: 5,
  },
  {
    id: 11,
    nombre: 'Roberto',
    apellido: 'Fernández',
    email: 'roberto.fernandez@email.com',
    telefono: '+57 318 555 0124',
    documento_tipo: 'cedula',
    documento_numero: '90123456',
    fecha_nacimiento: '1985-08-30',
    es_principal: false,
    id_reserva: 5,
  },
  {
    id: 12,
    nombre: 'Lucia',
    apellido: 'Fernández',
    email: '',
    telefono: '',
    documento_tipo: 'cedula',
    documento_numero: '01234567',
    fecha_nacimiento: '2015-02-14',
    es_principal: false,
    id_reserva: 5,
  },
];

// Data mockeada para reservas (la misma que en getReservas)
const mockReservas: IReservaTableData[] = [
  {
    id: 1,
    codigo_reserva: 'RSV-2024-001',
    id_inmueble: 1,
    nombre_inmueble: 'Apartamento Centro Histórico',
    huesped_principal: {
      nombre: 'María',
      apellido: 'García',
      email: 'maria.garcia@email.com',
      telefono: '+57 300 123 4567',
    },
    fecha_entrada: '2024-08-15',
    fecha_salida: '2024-08-18',
    numero_huespedes: 2,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 1),
    precio_total: 450000, // Mantener por compatibilidad
    total_reserva: 450000, // Monto total de la reserva
    total_pagado: 450000, // Completamente pagado
    total_pendiente: 0, // Sin pendientes
    estado: 'confirmada',
    fecha_creacion: '2024-08-01',
    observaciones: 'Llegada tarde, después de las 18:00',
    id_empresa: 1,
    plataforma_origen: 'directa',
  },
  {
    id: 2,
    codigo_reserva: 'RSV-2024-002',
    id_inmueble: 2,
    nombre_inmueble: 'Casa de Playa Cartagena',
    huesped_principal: {
      nombre: 'Juan Carlos',
      apellido: 'Rodríguez',
      email: 'juan.rodriguez@email.com',
      telefono: '+57 310 987 6543',
    },
    fecha_entrada: '2024-08-20',
    fecha_salida: '2024-08-25',
    numero_huespedes: 4,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 2),
    precio_total: 1250000, // Mantener por compatibilidad
    total_reserva: 1250000, // Monto total de la reserva
    total_pagado: 0, // Sin abonos
    total_pendiente: 1250000, // Todo pendiente
    estado: 'pendiente',
    fecha_creacion: '2024-08-05',
    observaciones: '',
    id_empresa: 1,
    plataforma_origen: 'booking',
  },
  {
    id: 3,
    codigo_reserva: 'RSV-2024-003',
    id_inmueble: 3,
    nombre_inmueble: 'Loft Zona Rosa',
    huesped_principal: {
      nombre: 'Ana',
      apellido: 'Martínez',
      email: 'ana.martinez@email.com',
      telefono: '+57 320 456 7890',
    },
    fecha_entrada: '2024-08-10',
    fecha_salida: '2024-08-12',
    numero_huespedes: 1,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 3),
    precio_total: 280000, // Mantener por compatibilidad
    total_reserva: 280000, // Monto total de la reserva
    total_pagado: 280000, // Completamente pagado
    total_pendiente: 0, // Sin pendientes
    estado: 'completada',
    fecha_creacion: '2024-07-25',
    observaciones: 'Cliente frecuente',
    id_empresa: 1,
    plataforma_origen: 'airbnb',
  },
  {
    id: 4,
    codigo_reserva: 'RSV-2024-004',
    id_inmueble: 4,
    nombre_inmueble: 'Estudio Chapinero',
    huesped_principal: {
      nombre: 'Carlos',
      apellido: 'López',
      email: 'carlos.lopez@email.com',
      telefono: '+57 315 789 0123',
    },
    fecha_entrada: '2024-08-12',
    fecha_salida: '2024-08-14',
    numero_huespedes: 2,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 4),
    precio_total: 320000, // Mantener por compatibilidad
    total_reserva: 320000, // Monto total de la reserva
    total_pagado: 150000, // Abono parcial
    total_pendiente: 170000, // Monto pendiente
    estado: 'en_proceso',
    fecha_creacion: '2024-08-02',
    observaciones: 'Necesita cuna para bebé',
    id_empresa: 1,
    plataforma_origen: 'pagina_web',
  },
  {
    id: 5,
    codigo_reserva: 'RSV-2024-005',
    id_inmueble: 1,
    nombre_inmueble: 'Apartamento Centro Histórico',
    huesped_principal: {
      nombre: 'Laura',
      apellido: 'Fernández',
      email: 'laura.fernandez@email.com',
      telefono: '+57 318 555 0123',
    },
    fecha_entrada: '2024-08-25',
    fecha_salida: '2024-08-27',
    numero_huespedes: 3,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 5),
    precio_total: 300000, // Mantener por compatibilidad
    total_reserva: 300000, // Monto total de la reserva
    total_pagado: 100000, // Abono parcial
    total_pendiente: 200000, // Monto pendiente (pero está cancelada)
    estado: 'cancelada',
    fecha_creacion: '2024-08-03',
    observaciones: 'Cancelada por el cliente',
    id_empresa: 1,
    plataforma_origen: 'directa',
  },
];

/**
 * Valida el ID de la reserva
 */
const validateReservaId = (id: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!id) {
    errors.push('El ID de la reserva es requerido');
  }

  const numericId = parseInt(id as string);
  if (isNaN(numericId) || numericId <= 0) {
    errors.push('El ID de la reserva debe ser un número válido mayor a 0');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Obtiene el detalle de una reserva específica
 * @param req - Request object
 * @param res - Response object
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Método no permitido' 
    });
  }

  try {
    const { id } = req.query;

    // Validar ID
    const validation = validateReservaId(id);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'ID de reserva inválido',
        errors: validation.errors
      });
    }

    const reservaId = parseInt(id as string);

    // Simular tiempo de respuesta de API externa
    await new Promise(resolve => setTimeout(resolve, 300));

    // Buscar la reserva en los datos mockeados
    const reserva = mockReservas.find(r => r.id === reservaId);

    if (!reserva) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Reserva no encontrada'
      });
    }

    // En el futuro, aquí haríamos la llamada a la API externa:
    // const apiUrl = process.env.API_URL || 'http://localhost:3001';
    // const token = req.headers.authorization?.replace('Bearer ', '') || '';
    // const response = await fetch(`${apiUrl}/reservas/${reservaId}`, {
    //   method: 'GET',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${token}`,
    //   },
    // });

    console.log('🔍 Obteniendo detalle de reserva, ID:', reservaId);
    
    res.status(200).json({
      success: true,
      data: reserva,
      message: 'Detalle de reserva obtenido exitosamente'
    });

  } catch (error) {
    console.error('❌ Error in getReservaDetalle API:', error);
    
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}
