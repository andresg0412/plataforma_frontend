/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';

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
      const response = await fetch(`${apiUrl}/inmuebles`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const apiData = await response.json();
      if (apiData.isError) {
        return res.status(apiData.code || 500).json({ error: apiData.message || 'Error al obtener inmuebles' });
      }
      // Mapear los datos externos al formato esperado por el frontend
      const inmuebles = (apiData.data || []).map((inmueble: any) => ({
        id: String(inmueble.id_inmueble || inmueble.id),
        nombre: inmueble.nombre || 'Sin nombre',
        direccion: inmueble.direccion || 'Sin dirección',
        capacidad: inmueble.capacidad || 0,
        id_propietario: inmueble.id_propietario || 'Sin propietario',
        id_empresa: inmueble.id_empresa || 'Sin empresa',
        estado: inmueble.estado || 'activo',
      }));
      return res.status(200).json(inmuebles);
    } catch (error) {
      return res.status(500).json({ error: error || 'Error interno' });
    }
  }
  res.setHeader('Allow', ['GET']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}