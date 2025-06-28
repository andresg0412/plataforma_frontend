export interface Property {
  id: string;
  nombre: string;
  direccion: string;
  ciudad: string;
  precio: number;
  tipo: string;
  estado: 'disponible' | 'ocupado' | 'mantenimiento';
  descripcion?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePropertyRequest {
  nombre: string;
  direccion: string;
  ciudad: string;
  precio: number;
  tipo: string;
  estado: 'disponible' | 'ocupado' | 'mantenimiento';
  descripcion?: string;
}

export interface UpdatePropertyRequest extends CreatePropertyRequest {
  id: string;
}