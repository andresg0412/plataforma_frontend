import { NextApiRequest, NextApiResponse } from 'next';
import { externalApiServerFetch, extractTokenFromRequest } from '../../../lib/externalApiClient';
import { IMovimiento } from '../../../interfaces/Movimiento';

interface MovimientoApiResponse {
  success: boolean;
  data?: IMovimiento[] | { ingresos: number; egresos: number; movimientos: IMovimiento[] };
  message: string;
  error?: string;
}

/**
 * Valida los parámetros de entrada
 */
const validateParams = (id_inmueble: any, fecha: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!id_inmueble) {
    errors.push('ID de inmueble es requerido');
  }
  
  if (!fecha) {
    errors.push('Fecha es requerida');
  } else {
    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha as string)) {
      errors.push('Formato de fecha inválido. Use YYYY-MM-DD');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * API Interna: Obtiene los movimientos de un inmueble para una fecha específica
 * GET /api/inmuebles/movimientos?id_inmueble=1&fecha=2025-10-12
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<MovimientoApiResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido'
    });
  }

  try {
    const { id_inmueble, fecha } = req.query;
    
    const validation = validateParams(id_inmueble, fecha);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros inválidos',
        error: validation.errors.join(', ')
      });
    }

    // Extraer token
    const token = extractTokenFromRequest(req);

    // Llamar a la API externa
    const endpoint = `/movimientos/inmueble?id_inmueble=${id_inmueble}&fecha=${fecha}`;
    const externalResponse = await externalApiServerFetch(endpoint, {
      method: 'GET'
    }, token);

    // Verificar si la respuesta externa es exitosa
    if (externalResponse.isError) {
      return res.status(400).json({
        success: false,
        message: externalResponse.message || 'Error al obtener movimientos del inmueble',
        error: externalResponse.error
      });
    }

    console.log(`✅ Movimientos del inmueble ${id_inmueble} obtenidos exitosamente:`, {
      cantidad: externalResponse.data.movimientos?.length || 0,
      ingresos: externalResponse.data.ingresos,
      egresos: externalResponse.data.egresos
    });

    // Respuesta exitosa
    return res.status(200).json({
      success: true,
      data: externalResponse.data,
      message: 'Movimientos del inmueble obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error en API movimientos por inmueble:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
        concepto: 'Pago de reserva',
        descripcion: 'Segundo abono reserva RES-001',
        monto: 150000,
        id_inmueble: '1',
        nombre_inmueble: 'Apartamento Centro',
        id_reserva: '1',
        codigo_reserva: 'RES-001',
        metodo_pago: 'efectivo',
        id_empresa: '1',
        fecha_creacion: '2024-10-08T16:45:00.000Z',
        fecha_actualizacion: '2024-10-08T16:45:00.000Z'
      }
    ],
    '2024-10-07': [
      {
        id: 'MOV-004',
        fecha: '2024-10-07',
        tipo: 'ingreso',
        concepto: 'Depósito de garantía',
        descripcion: 'Depósito por daños reserva RES-002',
        monto: 100000,
        id_inmueble: '1',
        nombre_inmueble: 'Apartamento Centro',
        id_reserva: '2',
        codigo_reserva: 'RES-002',
        metodo_pago: 'tarjeta',
        comprobante: 'TJT-002',
        id_empresa: '1',
        fecha_creacion: '2024-10-07T09:20:00.000Z',
        fecha_actualizacion: '2024-10-07T09:20:00.000Z'
      },
      {
        id: 'MOV-005',
        fecha: '2024-10-07',
        tipo: 'egreso',
        concepto: 'Mantenimiento',
        descripcion: 'Reparación plomería',
        monto: 80000,
        id_inmueble: '1',
        nombre_inmueble: 'Apartamento Centro',
        metodo_pago: 'transferencia',
        comprobante: 'TRF-005',
        id_empresa: '1',
        fecha_creacion: '2024-10-07T11:30:00.000Z',
        fecha_actualizacion: '2024-10-07T11:30:00.000Z'
      }
    ]
  },
  '2': {
    '2024-10-08': [
      {
        id: 'MOV-006',
        fecha: '2024-10-08',
        tipo: 'ingreso',
        concepto: 'Pago de reserva',
        descripcion: 'Pago completo reserva RES-003',
        monto: 300000,
        id_inmueble: '2',
        nombre_inmueble: 'Casa Familiar',
        id_reserva: '3',
        codigo_reserva: 'RES-003',
        metodo_pago: 'transferencia',
        comprobante: 'TRF-003',
        id_empresa: '1',
        fecha_creacion: '2024-10-08T08:15:00.000Z',
        fecha_actualizacion: '2024-10-08T08:15:00.000Z'
      }
    ]
  }
};

/**
 * Valida los parámetros de entrada
 */
const validateParams = (id_inmueble: any, fecha: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!id_inmueble) {
    errors.push('ID de inmueble es requerido');
  }
  
  if (!fecha) {
    errors.push('Fecha es requerida');
  } else {
    // Validar formato de fecha (YYYY-MM-DD)
    const fechaRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!fechaRegex.test(fecha as string)) {
      errors.push('Formato de fecha inválido. Use YYYY-MM-DD');
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Calcula resumen de movimientos
 */
const calcularResumen = (movimientos: IMovimiento[]) => {
  const ingresos = movimientos
    .filter(mov => mov.tipo === 'ingreso')
    .reduce((sum, mov) => sum + mov.monto, 0);
    
  const egresos = movimientos
    .filter(mov => mov.tipo === 'egreso')
    .reduce((sum, mov) => sum + mov.monto, 0);
    
  return { ingresos, egresos };
};

/**
 * Obtiene los movimientos de un inmueble para una fecha específica
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<MovimientoApiResponse>) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido'
    });
  }

  try {
    const { id_inmueble, fecha } = req.query;
    
    const validation = validateParams(id_inmueble, fecha);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'Parámetros inválidos',
        error: validation.errors.join(', ')
      });
    }
    
    const inmuebleId = id_inmueble as string;
    const fechaConsulta = fecha as string;
    
    // Obtener movimientos del inmueble para la fecha específica
    const movimientosInmueble = mockMovimientosPorInmueble[inmuebleId] || {};
    const movimientos = movimientosInmueble[fechaConsulta] || [];
    
    // Calcular resumen
    const resumen = calcularResumen(movimientos);
    
    console.log(`✅ Movimientos obtenidos para inmueble ${inmuebleId} fecha ${fechaConsulta}:`, {
      cantidad: movimientos.length,
      ingresos: resumen.ingresos,
      egresos: resumen.egresos
    });
    
    return res.status(200).json({
      success: true,
      data: {
        ingresos: resumen.ingresos,
        egresos: resumen.egresos,
        movimientos: movimientos
      },
      message: `${movimientos.length} movimientos encontrados para la fecha ${fechaConsulta}`
    });
    
  } catch (error) {
    console.error('❌ Error en API de movimientos por inmueble:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}