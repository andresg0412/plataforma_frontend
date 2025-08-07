export interface IReserva {
  id: number;
  codigo_reserva: string;
  id_inmueble: number;
  nombre_inmueble: string;
  huesped_nombre: string;
  huesped_email: string;
  huesped_telefono: string;
  fecha_entrada: string;
  fecha_salida: string;
  numero_huespedes: number;
  precio_total: number;
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  fecha_creacion: string;
  observaciones?: string;
  id_empresa: number;
}

export interface IReservaForm {
  id_inmueble: number;
  huesped_nombre: string;
  huesped_email: string;
  huesped_telefono: string;
  fecha_entrada: string;
  fecha_salida: string;
  numero_huespedes: number;
  precio_total: number;
  estado: 'pendiente' | 'confirmada' | 'en_proceso' | 'completada' | 'cancelada';
  observaciones?: string;
  id_empresa: number;
}

export interface IReservaTableData extends IReserva {
  // Alias para la tabla, extiende directamente de IReserva
}
