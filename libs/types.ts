export interface User {
  id: string;
  nombre: string;
  email: string;
  role?: string;
  rol?: string;
  permisos?: string[];
}

export interface Inmueble {
  id: string;
  nombre: string;
  direccion: string;
  capacidad: number;
  id_propietario: string;
  id_empresa: string;
  estado: 'activo' | 'inactivo' | 'mantenimiento';
}