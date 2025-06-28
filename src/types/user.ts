export interface User {
  id: string;
  nombre: string;
  email: string;
  permisos: string[];
  exp?: number;
  iat?: number;
}