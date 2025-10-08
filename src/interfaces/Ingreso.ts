// Interfaces para ingresos específicos
export interface IIngreso {
  id: string;
  fecha: string;
  concepto: string;
  descripcion: string;
  monto: number;
  id_inmueble: string;
  nombre_inmueble: string;
  id_reserva?: string;
  codigo_reserva?: string;
  metodo_pago: 'efectivo' | 'transferencia' | 'tarjeta' | 'otro';
  comprobante?: string;
  tipo_ingreso: 'movimiento' | 'pago'; // Para distinguir si viene de movimientos o pagos
  id_empresa: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

// Para respuestas de API
export interface IIngresoApiResponse {
  success: boolean;
  data?: IIngreso | IIngreso[];
  message: string;
  error?: string;
}

// Para resumen de ingresos diarios
export interface IResumenIngresos {
  fecha: string;
  total_ingresos: number;
  cantidad_ingresos: number;
  ingresos_por_inmueble: IIngresosPorInmueble[];
}

// Para agrupar ingresos por inmueble
export interface IIngresosPorInmueble {
  id_inmueble: string;
  nombre_inmueble: string;
  total_ingresos: number;
  cantidad_ingresos: number;
}

// Para filtros del componente
export interface IFiltrosIngresos {
  fecha: string;
  id_inmueble?: string; // Si está vacío, muestra todos los inmuebles
}