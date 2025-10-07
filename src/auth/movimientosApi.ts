import { IMovimiento, IMovimientoForm, IMovimientoApiResponse, IResumenDiario } from '../interfaces/Movimiento';

// Mock data para movimientos
const mockMovimientos: IMovimiento[] = [
  {
    id: '1',
    fecha: '2025-10-07',
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
    fecha_creacion: '2025-10-07T08:00:00Z',
    fecha_actualizacion: '2025-10-07T08:00:00Z'
  },
  {
    id: '2',
    fecha: '2025-10-07',
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
    fecha_creacion: '2025-10-07T10:30:00Z',
    fecha_actualizacion: '2025-10-07T10:30:00Z'
  },
  {
    id: '3',
    fecha: '2025-10-07',
    tipo: 'egreso',
    concepto: 'mantenimiento',
    descripcion: 'Reparación grifo cocina',
    monto: 75000,
    id_inmueble: '2',
    nombre_inmueble: 'Casa Zona Rosa',
    metodo_pago: 'transferencia',
    comprobante: 'FAC-567890',
    id_empresa: '1',
    fecha_creacion: '2025-10-07T14:15:00Z',
    fecha_actualizacion: '2025-10-07T14:15:00Z'
  },
  {
    id: '4',
    fecha: '2025-10-07',
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
    fecha_creacion: '2025-10-07T16:45:00Z',
    fecha_actualizacion: '2025-10-07T16:45:00Z'
  },
  {
    id: '5',
    fecha: '2025-10-06',
    tipo: 'egreso',
    concepto: 'servicios_publicos',
    descripcion: 'Pago energía eléctrica',
    monto: 120000,
    id_inmueble: '1',
    nombre_inmueble: 'Apartamento Centro 101',
    metodo_pago: 'transferencia',
    comprobante: 'CODENSA-202510',
    id_empresa: '1',
    fecha_creacion: '2025-10-06T09:00:00Z',
    fecha_actualizacion: '2025-10-06T09:00:00Z'
  },
  {
    id: '6',
    fecha: '2025-10-06',
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
    fecha_creacion: '2025-10-06T11:30:00Z',
    fecha_actualizacion: '2025-10-06T11:30:00Z'
  }
];

// Función para generar un nuevo ID
const generateId = (): string => {
  return Date.now().toString();
};

// Simular delay de red
const delay = (ms: number = 500): Promise<void> => 
  new Promise(resolve => setTimeout(resolve, ms));

// API functions
export const getMovimientosByFecha = async (fecha: string): Promise<IMovimientoApiResponse> => {
  await delay();
  try {
    const movimientos = mockMovimientos.filter(mov => mov.fecha === fecha);
    return {
      success: true,
      data: movimientos,
      message: 'Movimientos obtenidos exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener movimientos',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const getResumenDiario = async (fecha: string): Promise<{ success: boolean; data?: IResumenDiario; message: string; error?: string }> => {
  await delay();
  try {
    const movimientos = mockMovimientos.filter(mov => mov.fecha === fecha);
    const total_ingresos = movimientos
      .filter(mov => mov.tipo === 'ingreso')
      .reduce((sum, mov) => sum + mov.monto, 0);
    
    const total_egresos = movimientos
      .filter(mov => mov.tipo === 'egreso')
      .reduce((sum, mov) => sum + mov.monto, 0);

    const resumen: IResumenDiario = {
      fecha,
      total_ingresos,
      total_egresos,
      balance: total_ingresos - total_egresos,
      cantidad_movimientos: movimientos.length
    };

    return {
      success: true,
      data: resumen,
      message: 'Resumen obtenido exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener resumen',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const createMovimiento = async (movimientoData: IMovimientoForm): Promise<IMovimientoApiResponse> => {
  await delay();
  try {
    // Simular validaciones
    if (!movimientoData.concepto || !movimientoData.monto || !movimientoData.id_inmueble) {
      return {
        success: false,
        message: 'Datos incompletos'
      };
    }

    const nuevoMovimiento: IMovimiento = {
      id: generateId(),
      fecha: movimientoData.fecha,
      tipo: movimientoData.tipo,
      concepto: movimientoData.concepto,
      descripcion: movimientoData.descripcion,
      monto: movimientoData.monto,
      id_inmueble: movimientoData.id_inmueble,
      nombre_inmueble: 'Inmueble ' + movimientoData.id_inmueble, // Mock
      id_reserva: movimientoData.id_reserva,
      codigo_reserva: movimientoData.id_reserva ? `RSV-${movimientoData.id_reserva}` : undefined,
      metodo_pago: movimientoData.metodo_pago,
      comprobante: movimientoData.comprobante,
      id_empresa: '1',
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    };

    mockMovimientos.push(nuevoMovimiento);

    return {
      success: true,
      data: nuevoMovimiento,
      message: 'Movimiento creado exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al crear movimiento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const updateMovimiento = async (id: string, movimientoData: IMovimientoForm): Promise<IMovimientoApiResponse> => {
  await delay();
  try {
    const index = mockMovimientos.findIndex(mov => mov.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Movimiento no encontrado'
      };
    }

    const movimientoActualizado: IMovimiento = {
      ...mockMovimientos[index],
      fecha: movimientoData.fecha,
      tipo: movimientoData.tipo,
      concepto: movimientoData.concepto,
      descripcion: movimientoData.descripcion,
      monto: movimientoData.monto,
      id_inmueble: movimientoData.id_inmueble,
      nombre_inmueble: 'Inmueble ' + movimientoData.id_inmueble, // Mock
      id_reserva: movimientoData.id_reserva,
      codigo_reserva: movimientoData.id_reserva ? `RSV-${movimientoData.id_reserva}` : undefined,
      metodo_pago: movimientoData.metodo_pago,
      comprobante: movimientoData.comprobante,
      fecha_actualizacion: new Date().toISOString()
    };

    mockMovimientos[index] = movimientoActualizado;

    return {
      success: true,
      data: movimientoActualizado,
      message: 'Movimiento actualizado exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al actualizar movimiento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const deleteMovimiento = async (id: string): Promise<IMovimientoApiResponse> => {
  await delay();
  try {
    const index = mockMovimientos.findIndex(mov => mov.id === id);
    if (index === -1) {
      return {
        success: false,
        message: 'Movimiento no encontrado'
      };
    }

    mockMovimientos.splice(index, 1);

    return {
      success: true,
      message: 'Movimiento eliminado exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al eliminar movimiento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const getMovimientoById = async (id: string): Promise<IMovimientoApiResponse> => {
  await delay();
  try {
    const movimiento = mockMovimientos.find(mov => mov.id === id);
    if (!movimiento) {
      return {
        success: false,
        message: 'Movimiento no encontrado'
      };
    }

    return {
      success: true,
      data: movimiento,
      message: 'Movimiento obtenido exitosamente'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Error al obtener movimiento',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};