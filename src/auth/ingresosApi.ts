import { IIngreso, IIngresoApiResponse, IResumenIngresos, IFiltrosIngresos } from '../interfaces/Ingreso';
import { IMovimiento } from '../interfaces/Movimiento';
import { IPago } from '../interfaces/Pago';

// Mock data para ingresos (combinando movimientos tipo ingreso y pagos)
const mockMovimientos: IMovimiento[] = [
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
  },
  {
    id: '8',
    fecha: '2025-10-07',
    tipo: 'ingreso',
    concepto: 'reserva',
    descripcion: 'Pago adelantado reserva',
    monto: 320000,
    id_inmueble: '1',
    nombre_inmueble: 'Apartamento Centro 101',
    id_reserva: '4',
    codigo_reserva: 'RSV-2025-004',
    metodo_pago: 'transferencia',
    comprobante: 'TRF-001235',
    id_empresa: '1',
    fecha_creacion: '2025-10-07T09:15:00Z',
    fecha_actualizacion: '2025-10-07T09:15:00Z'
  },
  {
    id: '9',
    fecha: '2025-10-07',
    tipo: 'ingreso',
    concepto: 'multa',
    descripcion: 'Multa por daños menores',
    monto: 75000,
    id_inmueble: '3',
    nombre_inmueble: 'Studio Chapinero 205',
    metodo_pago: 'efectivo',
    id_empresa: '1',
    fecha_creacion: '2025-10-07T18:30:00Z',
    fecha_actualizacion: '2025-10-07T18:30:00Z'
  }
];

const mockPagos: IPago[] = [
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
  },
  {
    id: 3,
    id_reserva: 3,
    codigo_reserva: 'RSV-2025-003',
    monto: 95000,
    fecha_pago: '2025-10-07',
    metodo_pago: 'efectivo',
    concepto: 'Pago adicional',
    descripcion: 'Extensión de estadía',
    id_empresa: 1,
    fecha_creacion: '2025-10-07T20:00:00Z',
    fecha_actualizacion: '2025-10-07T20:00:00Z'
  }
];

// Mock data para inmuebles (simplificado para el selector)
const mockInmuebles = [
  { id: '1', nombre: 'Apartamento Centro 101' },
  { id: '2', nombre: 'Casa Zona Rosa' },
  { id: '3', nombre: 'Studio Chapinero 205' }
];

// Función para convertir movimiento a ingreso
const convertMovimientoToIngreso = (movimiento: IMovimiento): IIngreso => ({
  id: movimiento.id,
  fecha: movimiento.fecha,
  concepto: movimiento.concepto,
  descripcion: movimiento.descripcion,
  monto: movimiento.monto,
  id_inmueble: movimiento.id_inmueble,
  nombre_inmueble: movimiento.nombre_inmueble,
  id_reserva: movimiento.id_reserva,
  codigo_reserva: movimiento.codigo_reserva,
  metodo_pago: movimiento.metodo_pago,
  comprobante: movimiento.comprobante,
  tipo_ingreso: 'movimiento',
  id_empresa: movimiento.id_empresa,
  fecha_creacion: movimiento.fecha_creacion,
  fecha_actualizacion: movimiento.fecha_actualizacion
});

// Función para convertir pago a ingreso
const convertPagoToIngreso = (pago: IPago): IIngreso => {
  const inmueble = mockInmuebles.find(inm => inm.id === '1'); // Mock: asociar pagos al inmueble 1 por defecto
  return {
    id: `pago_${pago.id}`,
    fecha: pago.fecha_pago,
    concepto: pago.concepto || 'pago_reserva',
    descripcion: pago.descripcion || 'Pago de reserva',
    monto: pago.monto,
    id_inmueble: '1', // Mock: todos los pagos van al inmueble 1
    nombre_inmueble: inmueble?.nombre || 'Apartamento Centro 101',
    id_reserva: pago.id_reserva.toString(),
    codigo_reserva: pago.codigo_reserva,
    metodo_pago: pago.metodo_pago,
    comprobante: pago.comprobante,
    tipo_ingreso: 'pago',
    id_empresa: pago.id_empresa.toString(),
    fecha_creacion: pago.fecha_creacion,
    fecha_actualizacion: pago.fecha_actualizacion
  };
};

// Simular delay de red
const delay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const getIngresosByFiltros = async (filtros: IFiltrosIngresos): Promise<IIngresoApiResponse> => {
  await delay();
  try {
    // Filtrar movimientos tipo ingreso por fecha
    const movimientosIngreso = mockMovimientos
      .filter(mov => mov.tipo === 'ingreso' && mov.fecha === filtros.fecha)
      .map(convertMovimientoToIngreso);

    // Filtrar pagos por fecha
    const pagosIngreso = mockPagos
      .filter(pago => pago.fecha_pago === filtros.fecha)
      .map(convertPagoToIngreso);

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
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener ingresos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const getResumenIngresos = async (fecha: string, id_inmueble?: string): Promise<{ success: boolean; data?: IResumenIngresos; message: string; error?: string }> => {
  await delay();
  try {
    const filtros: IFiltrosIngresos = { fecha, id_inmueble };
    const response = await getIngresosByFiltros(filtros);
    
    if (!response.success || !Array.isArray(response.data)) {
      return {
        success: false,
        message: 'Error al obtener datos para el resumen'
      };
    }

    const ingresos = response.data;
    const total_ingresos = ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0);

    // Agrupar por inmueble
    const ingresosPorInmuebleMap = new Map<string, { total: number; cantidad: number; nombre: string }>();
    
    ingresos.forEach(ingreso => {
      const existing = ingresosPorInmuebleMap.get(ingreso.id_inmueble);
      if (existing) {
        existing.total += ingreso.monto;
        existing.cantidad += 1;
      } else {
        ingresosPorInmuebleMap.set(ingreso.id_inmueble, {
          total: ingreso.monto,
          cantidad: 1,
          nombre: ingreso.nombre_inmueble
        });
      }
    });

    const ingresos_por_inmueble = Array.from(ingresosPorInmuebleMap.entries()).map(([id_inmueble, data]) => ({
      id_inmueble,
      nombre_inmueble: data.nombre,
      total_ingresos: data.total,
      cantidad_ingresos: data.cantidad
    }));

    const resumen: IResumenIngresos = {
      fecha,
      total_ingresos,
      cantidad_ingresos: ingresos.length,
      ingresos_por_inmueble
    };

    return {
      success: true,
      data: resumen,
      message: 'Resumen de ingresos obtenido exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener resumen de ingresos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const getInmueblesParaFiltro = async (): Promise<{ success: boolean; data?: { id: string; nombre: string }[]; message: string; error?: string }> => {
  await delay(200);
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