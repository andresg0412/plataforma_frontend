import { IEgreso, IEgresoApiResponse, IResumenEgresos, IFiltrosEgresos } from '../interfaces/Egreso';
import { IMovimiento } from '../interfaces/Movimiento';

// Mock data para egresos (solo movimientos tipo egreso)
const mockMovimientos: IMovimiento[] = [
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
  },
  {
    id: '13',
    fecha: '2025-10-07',
    tipo: 'egreso',
    concepto: 'limpieza',
    descripcion: 'Servicio de limpieza profunda',
    monto: 60000,
    id_inmueble: '2',
    nombre_inmueble: 'Casa Zona Rosa',
    metodo_pago: 'efectivo',
    id_empresa: '1',
    fecha_creacion: '2025-10-07T15:00:00Z',
    fecha_actualizacion: '2025-10-07T15:00:00Z'
  },
  {
    id: '14',
    fecha: '2025-10-07',
    tipo: 'egreso',
    concepto: 'devolucion',
    descripcion: 'Devolución depósito huésped',
    monto: 50000,
    id_inmueble: '3',
    nombre_inmueble: 'Studio Chapinero 205',
    id_reserva: '5',
    codigo_reserva: 'RSV-2025-005',
    metodo_pago: 'transferencia',
    comprobante: 'DEV-001235',
    id_empresa: '1',
    fecha_creacion: '2025-10-07T18:30:00Z',
    fecha_actualizacion: '2025-10-07T18:30:00Z'
  },
  {
    id: '15',
    fecha: '2025-10-07',
    tipo: 'egreso',
    concepto: 'mantenimiento',
    descripcion: 'Reparación aire acondicionado',
    monto: 280000,
    id_inmueble: '1',
    nombre_inmueble: 'Apartamento Centro 101',
    metodo_pago: 'transferencia',
    comprobante: 'MAN-567891',
    id_empresa: '1',
    fecha_creacion: '2025-10-07T10:15:00Z',
    fecha_actualizacion: '2025-10-07T10:15:00Z'
  }
];

// Mock data para inmuebles (simplificado para el selector)
const mockInmuebles = [
  { id: '1', nombre: 'Apartamento Centro 101' },
  { id: '2', nombre: 'Casa Zona Rosa' },
  { id: '3', nombre: 'Studio Chapinero 205' }
];

// Función para convertir movimiento a egreso
const convertMovimientoToEgreso = (movimiento: IMovimiento): IEgreso => ({
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
  tipo_egreso: 'movimiento',
  id_empresa: movimiento.id_empresa,
  fecha_creacion: movimiento.fecha_creacion,
  fecha_actualizacion: movimiento.fecha_actualizacion
});

// Simular delay de red
const delay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const getEgresosByFiltros = async (filtros: IFiltrosEgresos): Promise<IEgresoApiResponse> => {
  await delay();
  try {
    // Filtrar movimientos tipo egreso por fecha
    const movimientosEgreso = mockMovimientos
      .filter(mov => mov.tipo === 'egreso' && mov.fecha === filtros.fecha)
      .map(convertMovimientoToEgreso);

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
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener egresos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const getResumenEgresos = async (fecha: string, id_inmueble?: string): Promise<{ success: boolean; data?: IResumenEgresos; message: string; error?: string }> => {
  await delay();
  try {
    const filtros: IFiltrosEgresos = { fecha, id_inmueble };
    const response = await getEgresosByFiltros(filtros);
    
    if (!response.success || !Array.isArray(response.data)) {
      return {
        success: false,
        message: 'Error al obtener datos para el resumen'
      };
    }

    const egresos = response.data;
    const total_egresos = egresos.reduce((sum, egreso) => sum + egreso.monto, 0);

    // Agrupar por inmueble
    const egresosPorInmuebleMap = new Map<string, { total: number; cantidad: number; nombre: string }>();
    
    egresos.forEach(egreso => {
      const existing = egresosPorInmuebleMap.get(egreso.id_inmueble);
      if (existing) {
        existing.total += egreso.monto;
        existing.cantidad += 1;
      } else {
        egresosPorInmuebleMap.set(egreso.id_inmueble, {
          total: egreso.monto,
          cantidad: 1,
          nombre: egreso.nombre_inmueble
        });
      }
    });

    const egresos_por_inmueble = Array.from(egresosPorInmuebleMap.entries()).map(([id_inmueble, data]) => ({
      id_inmueble,
      nombre_inmueble: data.nombre,
      total_egresos: data.total,
      cantidad_egresos: data.cantidad
    }));

    const resumen: IResumenEgresos = {
      fecha,
      total_egresos,
      cantidad_egresos: egresos.length,
      egresos_por_inmueble
    };

    return {
      success: true,
      data: resumen,
      message: 'Resumen de egresos obtenido exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener resumen de egresos',
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