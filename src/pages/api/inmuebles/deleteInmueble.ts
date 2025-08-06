/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { id } = req.body;
  const apiUrl = process.env.API_URL;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID de inmueble requerido' });
  }

  try {
    // Por ahora simulamos la respuesta exitosa de la API externa
    // TODO: Implementar llamada real a la API externa
    // const response = await fetch(`${apiUrl}/inmuebles/${id}`, {
    //   method: 'DELETE',
    //   headers: { 'Content-Type': 'application/json' },
    // });
    // const apiData = await response.json();

    // Simulando respuesta exitosa de la API externa
    const simulatedResponse = {
      success: true,
      message: 'Inmueble eliminado correctamente',
      data: { id }
    };

    // Simular un pequeño delay para emular llamada a API
    await new Promise(resolve => setTimeout(resolve, 300));

    return res.status(200).json(simulatedResponse);
  } catch (error: any) {
    return res.status(500).json({ 
      success: false, 
      message: error.message || 'Error eliminando inmueble' 
    });
  }
}
