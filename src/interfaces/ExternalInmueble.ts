export interface ExternalInmueble {
  id_inmueble: number;
  nombre: string;
  direccion: string;
  capacidad: number;
  id_propietario: number | null;
  id_empresa: number | null;
  estado: string;
  // Puedes agregar más campos si la API externa los provee
}

export interface IDataInmuebleIn {
  id: string;
  nombre: string;
  direccion: string;
  capacidad: number;
  id_propietario: string;
  id_empresa: string;
  estado: string;
}