import { NextApiRequest, NextApiResponse } from 'next';
import { ExternalUser } from '../../../interfaces/ExternalUser';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const apiUrl = process.env.API_URL || 'http://localhost:3001';
      // Obtener el token del header Authorization
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No autorizado: token faltante' });
      }
      const token = authHeader.replace('Bearer ', '');
      const response = await fetch(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) throw new Error('Error al consultar la API externa');
      const data: ExternalUser[] = await response.json();
      // Mapear los datos externos al formato esperado por el frontend
      const users = data.map((u: ExternalUser) => ({
        id: String(u.id_usuario),
        nombre: u.nombre,
        username: u.username,
        email: u.email,
        rol: u.rol_name,
        empresa: u.empresa_nombre || 'Sin empresa',
        estado: true ? 'activo' : 'inactivo', // Por ahora todos activos
      }));
      return res.status(200).json(users);
    } catch (error) {
      return res.status(500).json({ error: error || 'Error interno' });
    }
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
