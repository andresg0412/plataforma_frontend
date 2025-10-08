import type { NextApiRequest, NextApiResponse } from 'next';
import { IIngreso, IIngresoApiResponse, IFiltrosIngresos } from '../../../interfaces/Ingreso';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Método no permitido' 
    });
  }

  try {
    const { fecha, id_inmueble } = req.query;

    if (!fecha || typeof fecha !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      });
    }

    const filtros: IFiltrosIngresos = {
      fecha,
      id_inmueble: id_inmueble && typeof id_inmueble === 'string' ? id_inmueble : undefined
    };

    // En el futuro, aquí se haría la llamada a la API externa real
    // Por ahora, usamos data mockeada simulando la respuesta esperada
    
    const mockResponse = await getMockIngresos(filtros);
    
    res.status(200).json(mockResponse);

  } catch (error) {
    console.error('❌ Error in getIngresos API:', error);
    
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}

// Función mock que simula la respuesta de la API externa
async function getMockIngresos(filtros: IFiltrosIngresos): Promise<IIngresoApiResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock data para movimientos tipo ingreso
  const mockMovimientos = [
    {
      id: '1',
      fecha: '2025-10-08',
      tipo: 'ingreso',
      concepto: 'reserva',
      descripcion: 'Pago reserva - Check-in',
      monto: 250000,
      id_inmueble: '1',
      nombre_inmueble: 'Apartamento Centro 101',
      id_reserva: '1',
      codigo_reserva: 'RSV-2025-001',
      metodo_pago: 'transferencia',
      comprobante: 'TRF-001234',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T08:00:00Z',
      fecha_actualizacion: '2025-10-08T08:00:00Z'
    },
    {
      id: '2',
      fecha: '2025-10-08',
      tipo: 'ingreso',
      concepto: 'limpieza',
      descripcion: 'Cargo por limpieza adicional',
      monto: 50000,
      id_inmueble: '1',
      nombre_inmueble: 'Apartamento Centro 101',
      id_reserva: '1',
      codigo_reserva: 'RSV-2025-001',
      metodo_pago: 'efectivo',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T10:30:00Z',
      fecha_actualizacion: '2025-10-08T10:30:00Z'
    },
    {
      id: '4',
      fecha: '2025-10-08',
      tipo: 'ingreso',
      concepto: 'deposito_garantia',
      descripcion: 'Depósito de garantía',
      monto: 100000,
      id_inmueble: '3',
      nombre_inmueble: 'Studio Chapinero 205',
      id_reserva: '2',
      codigo_reserva: 'RSV-2025-002',
      metodo_pago: 'tarjeta',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T16:45:00Z',
      fecha_actualizacion: '2025-10-08T16:45:00Z'
    },
    {
      id: '6',
      fecha: '2025-10-08',
      tipo: 'ingreso',
      concepto: 'reserva',
      descripcion: 'Pago reserva - Check-in',
      monto: 180000,
      id_inmueble: '2',
      nombre_inmueble: 'Casa Zona Rosa',
      id_reserva: '3',
      codigo_reserva: 'RSV-2025-003',
      metodo_pago: 'efectivo',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T11:30:00Z',
      fecha_actualizacion: '2025-10-08T11:30:00Z'
    },
    {
      id: '7',
      fecha: '2025-10-08',
      tipo: 'ingreso',
      concepto: 'servicios_adicionales',
      descripcion: 'Servicio de lavandería',
      monto: 25000,
      id_inmueble: '2',
      nombre_inmueble: 'Casa Zona Rosa',
      metodo_pago: 'transferencia',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T14:00:00Z',
      fecha_actualizacion: '2025-10-08T14:00:00Z'
    }
  ];

  // Mock data para pagos
  const mockPagos = [
    {
      id: 1,
      id_reserva: 1,
      codigo_reserva: 'RSV-2025-001',
      monto: 150000,
      fecha_pago: '2025-10-08',
      metodo_pago: 'transferencia',
      concepto: 'Pago parcial reserva',
      descripcion: 'Segundo pago de la reserva',
      comprobante: 'TRF-001236',
      id_empresa: 1,
      fecha_creacion: '2025-10-08T12:00:00Z',
      fecha_actualizacion: '2025-10-08T12:00:00Z'
    },
    {
      id: 2,
      id_reserva: 2,
      codigo_reserva: 'RSV-2025-002',
      monto: 200000,
      fecha_pago: '2025-10-08',
      metodo_pago: 'tarjeta',
      concepto: 'Pago total reserva',
      descripcion: 'Pago completo de la estadía',
      id_empresa: 1,
      fecha_creacion: '2025-10-08T15:30:00Z',
      fecha_actualizacion: '2025-10-08T15:30:00Z'
    }
  ];

  // Filtrar movimientos tipo ingreso por fecha
  const movimientosIngreso = mockMovimientos
    .filter(mov => mov.tipo === 'ingreso' && mov.fecha === filtros.fecha)
    .map(mov => ({
      id: mov.id,
      fecha: mov.fecha,
      concepto: mov.concepto,
      descripcion: mov.descripcion,
      monto: mov.monto,
      id_inmueble: mov.id_inmueble,
      nombre_inmueble: mov.nombre_inmueble,
      id_reserva: mov.id_reserva,
      codigo_reserva: mov.codigo_reserva,
      metodo_pago: mov.metodo_pago as 'efectivo' | 'transferencia' | 'tarjeta' | 'otro',
      comprobante: mov.comprobante,
      tipo_ingreso: 'movimiento' as const,
      id_empresa: mov.id_empresa,
      fecha_creacion: mov.fecha_creacion,
      fecha_actualizacion: mov.fecha_actualizacion
    }));

  // Filtrar pagos por fecha y convertir a formato de ingreso
  const pagosIngreso = mockPagos
    .filter(pago => pago.fecha_pago === filtros.fecha)
    .map(pago => ({
      id: `pago_${pago.id}`,
      fecha: pago.fecha_pago,
      concepto: pago.concepto || 'pago_reserva',
      descripcion: pago.descripcion || 'Pago de reserva',
      monto: pago.monto,
      id_inmueble: '1', // Mock: todos los pagos van al inmueble 1
      nombre_inmueble: 'Apartamento Centro 101',
      id_reserva: pago.id_reserva.toString(),
      codigo_reserva: pago.codigo_reserva,
      metodo_pago: pago.metodo_pago as 'efectivo' | 'transferencia' | 'tarjeta' | 'otro',
      comprobante: pago.comprobante,
      tipo_ingreso: 'pago' as const,
      id_empresa: pago.id_empresa.toString(),
      fecha_creacion: pago.fecha_creacion,
      fecha_actualizacion: pago.fecha_actualizacion
    }));

  // Combinar ambos tipos de ingresos
  let todosLosIngresos = [...movimientosIngreso, ...pagosIngreso];

  // Filtrar por inmueble si se especifica
  if (filtros.id_inmueble) {
    todosLosIngresos = todosLosIngresos.filter(ingreso => ingreso.id_inmueble === filtros.id_inmueble);
  }

  // Ordenar por fecha de creación (más recientes primero)
  todosLosIngresos.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());

  return {
    success: true,
    data: todosLosIngresos,
    message: 'Ingresos obtenidos exitosamente'
  };
}