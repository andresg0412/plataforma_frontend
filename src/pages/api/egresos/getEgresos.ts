import type { NextApiRequest, NextApiResponse } from 'next';
import { IEgreso, IEgresoApiResponse, IFiltrosEgresos } from '../../../interfaces/Egreso';

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

    const filtros: IFiltrosEgresos = {
      fecha,
      id_inmueble: id_inmueble && typeof id_inmueble === 'string' ? id_inmueble : undefined
    };

    // En el futuro, aquí se haría la llamada a la API externa real
    // Por ahora, usamos data mockeada simulando la respuesta esperada
    
    const mockResponse = await getMockEgresos(filtros);
    
    res.status(200).json(mockResponse);

  } catch (error) {
    console.error('❌ Error in getEgresos API:', error);
    
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}

// Función mock que simula la respuesta de la API externa
async function getMockEgresos(filtros: IFiltrosEgresos): Promise<IEgresoApiResponse> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 300));

  // Mock data para movimientos tipo egreso
  const mockMovimientos = [
    {
      id: '3',
      fecha: '2025-10-08',
      tipo: 'egreso',
      concepto: 'mantenimiento',
      descripcion: 'Reparación grifo cocina',
      monto: 75000,
      id_inmueble: '2',
      nombre_inmueble: 'Casa Zona Rosa',
      metodo_pago: 'transferencia',
      comprobante: 'FAC-567890',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T14:15:00Z',
      fecha_actualizacion: '2025-10-08T14:15:00Z'
    },
    {
      id: '5',
      fecha: '2025-10-08',
      tipo: 'egreso',
      concepto: 'servicios_publicos',
      descripcion: 'Pago energía eléctrica',
      monto: 120000,
      id_inmueble: '1',
      nombre_inmueble: 'Apartamento Centro 101',
      metodo_pago: 'transferencia',
      comprobante: 'CODENSA-202510',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T09:00:00Z',
      fecha_actualizacion: '2025-10-08T09:00:00Z'
    },
    {
      id: '10',
      fecha: '2025-10-08',
      tipo: 'egreso',
      concepto: 'suministros',
      descripcion: 'Productos de limpieza',
      monto: 45000,
      id_inmueble: '3',
      nombre_inmueble: 'Studio Chapinero 205',
      metodo_pago: 'efectivo',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T11:30:00Z',
      fecha_actualizacion: '2025-10-08T11:30:00Z'
    },
    {
      id: '11',
      fecha: '2025-10-08',
      tipo: 'egreso',
      concepto: 'comision',
      descripcion: 'Comisión plataforma reserva RSV-2025-001',
      monto: 25000,
      id_inmueble: '1',
      nombre_inmueble: 'Apartamento Centro 101',
      id_reserva: '1',
      codigo_reserva: 'RSV-2025-001',
      metodo_pago: 'transferencia',
      comprobante: 'COM-001234',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T16:45:00Z',
      fecha_actualizacion: '2025-10-08T16:45:00Z'
    },
    {
      id: '12',
      fecha: '2025-10-08',
      tipo: 'egreso',
      concepto: 'impuestos',
      descripcion: 'Impuesto predial apartamento',
      monto: 180000,
      id_inmueble: '1',
      nombre_inmueble: 'Apartamento Centro 101',
      metodo_pago: 'transferencia',
      comprobante: 'PRED-2025-101',
      id_empresa: '1',
      fecha_creacion: '2025-10-08T13:20:00Z',
      fecha_actualizacion: '2025-10-08T13:20:00Z'
    }
  ];

  // Filtrar movimientos tipo egreso por fecha
  const movimientosEgreso = mockMovimientos
    .filter(mov => mov.tipo === 'egreso' && mov.fecha === filtros.fecha)
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
      tipo_egreso: 'movimiento' as const,
      id_empresa: mov.id_empresa,
      fecha_creacion: mov.fecha_creacion,
      fecha_actualizacion: mov.fecha_actualizacion
    }));

  // Filtrar por inmueble si se especifica
  let todosLosEgresos = [...movimientosEgreso];
  if (filtros.id_inmueble) {
    todosLosEgresos = todosLosEgresos.filter(egreso => egreso.id_inmueble === filtros.id_inmueble);
  }

  // Ordenar por fecha de creación (más recientes primero)
  todosLosEgresos.sort((a, b) => new Date(b.fecha_creacion).getTime() - new Date(a.fecha_creacion).getTime());

  return {
    success: true,
    data: todosLosEgresos,
    message: 'Egresos obtenidos exitosamente'
  };
}