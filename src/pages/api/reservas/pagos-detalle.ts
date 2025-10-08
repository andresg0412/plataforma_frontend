import { NextApiRequest, NextApiResponse } from 'next';
import { IPago, IPagoApiResponse } from '../../../interfaces/Pago';

// Data mock para pagos por reserva (igual que en el otro endpoint)
const mockPagos: { [key: number]: IPago[] } = {
  1: [
    {
      id: 1,
      id_reserva: 1,
      codigo_reserva: 'RES-001',
      monto: 200000,
      fecha_pago: '2024-01-15',
      metodo_pago: 'transferencia',
      concepto: 'Abono inicial',
      descripcion: 'Primer abono de la reserva',
      comprobante: 'TRF-001',
      id_empresa: 1,
      fecha_creacion: '2024-01-15T10:30:00.000Z',
      fecha_actualizacion: '2024-01-15T10:30:00.000Z'
    },
    {
      id: 2,
      id_reserva: 1,
      codigo_reserva: 'RES-001',
      monto: 150000,
      fecha_pago: '2024-01-20',
      metodo_pago: 'efectivo',
      concepto: 'Segundo abono',
      descripcion: 'Abono parcial',
      id_empresa: 1,
      fecha_creacion: '2024-01-20T14:20:00.000Z',
      fecha_actualizacion: '2024-01-20T14:20:00.000Z'
    }
  ],
  2: [
    {
      id: 3,
      id_reserva: 2,
      codigo_reserva: 'RES-002',
      monto: 300000,
      fecha_pago: '2024-01-18',
      metodo_pago: 'tarjeta',
      concepto: 'Pago completo',
      descripcion: 'Pago total de la reserva',
      comprobante: 'TJT-001',
      id_empresa: 1,
      fecha_creacion: '2024-01-18T09:15:00.000Z',
      fecha_actualizacion: '2024-01-18T09:15:00.000Z'
    }
  ],
  3: [
    {
      id: 4,
      id_reserva: 3,
      codigo_reserva: 'RES-003',
      monto: 100000,
      fecha_pago: '2024-01-22',
      metodo_pago: 'transferencia',
      concepto: 'Primer abono',
      descripcion: 'Abono inicial de la reserva',
      comprobante: 'TRF-003',
      id_empresa: 1,
      fecha_creacion: '2024-01-22T16:45:00.000Z',
      fecha_actualizacion: '2024-01-22T16:45:00.000Z'
    }
  ]
};

/**
 * Valida el ID de reserva
 */
const validateReservaId = (id: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!id) {
    errors.push('ID de reserva es requerido');
  } else if (isNaN(parseInt(id as string))) {
    errors.push('ID de reserva debe ser un número válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Obtiene los pagos de una reserva específica para el modal de detalle
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<IPagoApiResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido'
    });
  }

  try {
    const { id_reserva } = req.query;
    
    const validation = validateReservaId(id_reserva);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Datos inválidos',
        error: validation.errors.join(', ')
      });
    }
    
    const reservaId = parseInt(id_reserva as string);
    const pagos = mockPagos[reservaId] || [];
    
    console.log(`✅ Pagos obtenidos para reserva ${reservaId}:`, pagos.length);
    
    return res.status(200).json({
      success: true,
      data: pagos,
      message: `${pagos.length} pagos encontrados para la reserva`
    });
    
  } catch (error) {
    console.error('❌ Error en API de pagos detalle:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}