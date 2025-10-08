import { NextApiRequest, NextApiResponse } from 'next';
import { IPago, IPagoApiResponse, IPagoForm } from '../../../interfaces/Pago';

// Data mock para pagos por reserva
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
  ]
};

let nextPagoId = 4; // Siguiente ID disponible

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
 * Valida los datos del pago
 */
const validatePagoData = (data: IPagoForm): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!data.monto || data.monto <= 0) {
    errors.push('El monto debe ser mayor a 0');
  }
  
  if (!data.metodo_pago) {
    errors.push('Método de pago es requerido');
  }
  
  const metodosValidos = ['efectivo', 'transferencia', 'tarjeta', 'otro'];
  if (data.metodo_pago && !metodosValidos.includes(data.metodo_pago)) {
    errors.push('Método de pago no válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Obtiene los pagos de una reserva o crea un nuevo pago
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<IPagoApiResponse>) {
  try {
    if (req.method === 'GET') {
      // Obtener pagos de una reserva
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
      
      return res.status(200).json({
        success: true,
        data: pagos,
        message: `${pagos.length} pagos encontrados`
      });
      
    } else if (req.method === 'POST') {
      // Crear nuevo pago
      const { id_reserva } = req.query;
      const pagoData: IPagoForm = req.body;
      
      const reservaValidation = validateReservaId(id_reserva);
      if (!reservaValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'ID de reserva inválido',
          error: reservaValidation.errors.join(', ')
        });
      }
      
      const pagoValidation = validatePagoData(pagoData);
      if (!pagoValidation.isValid) {
        return res.status(400).json({
          success: false,
          message: 'Datos del pago inválidos',
          error: pagoValidation.errors.join(', ')
        });
      }
      
      const reservaId = parseInt(id_reserva as string);
      const now = new Date().toISOString();
      
      const nuevoPago: IPago = {
        id: nextPagoId++,
        id_reserva: reservaId,
        codigo_reserva: `RES-${reservaId.toString().padStart(3, '0')}`,
        monto: pagoData.monto,
        fecha_pago: new Date().toISOString().split('T')[0],
        metodo_pago: pagoData.metodo_pago,
        concepto: pagoData.concepto || 'Pago de reserva',
        descripcion: pagoData.descripcion,
        comprobante: pagoData.comprobante,
        id_empresa: 1, // Mock empresa ID
        fecha_creacion: now,
        fecha_actualizacion: now
      };
      
      // Guardar en mock data
      if (!mockPagos[reservaId]) {
        mockPagos[reservaId] = [];
      }
      mockPagos[reservaId].push(nuevoPago);
      
      console.log('✅ Pago creado exitosamente:', nuevoPago);
      
      return res.status(201).json({
        success: true,
        data: nuevoPago,
        message: 'Pago registrado exitosamente'
      });
      
    } else {
      return res.status(405).json({
        success: false,
        message: 'Método no permitido'
      });
    }
    
  } catch (error) {
    console.error('❌ Error en API de pagos:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}