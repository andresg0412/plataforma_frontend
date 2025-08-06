// Interfaces para inmuebles
export interface IInmueble {
  id: string;
  nombre: string;
  direccion: string;
  tipo: 'apartamento' | 'casa' | 'studio' | 'penthouse' | 'oficina' | 'local';
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'inactivo';
  precio: number;
  descripcion: string;
  habitaciones: number;
  banos: number;
  area: number;
  id_empresa: string;
  nombre_empresa: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
}

// Para formularios de creación/edición
export interface IInmuebleForm {
  nombre: string;
  direccion: string;
  tipo: 'apartamento' | 'casa' | 'studio' | 'penthouse' | 'oficina' | 'local';
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'inactivo';
  precio: number;
  descripcion: string;
  habitaciones: number;
  banos: number;
  area: number;
  id_empresa?: string;
}

// Para respuestas de API
export interface IInmuebleApiResponse {
  success: boolean;
  data?: IInmueble | IInmueble[];
  message: string;
  error?: string;
}
