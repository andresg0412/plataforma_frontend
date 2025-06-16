import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Método no permitido' });
  }

  const { id } = req.body;
  const apiUrl = process.env.API_URL;

  if (!id) {
    return res.status(400).json({ success: false, message: 'ID de usuario requerido' });
  }
  if (!apiUrl) {
    return res.status(500).json({ success: false, message: 'API URL no configurada' });
  }

  try {
    const response = await fetch(`${apiUrl}/users/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    if (response.ok && data.success) {
      return res.status(200).json({ success: true, message: data.message || 'Usuario eliminado correctamente' });
    } else {
      return res.status(response.status).json({ success: false, message: data.message || 'Error eliminando usuario' });
    }
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Error eliminando usuario' });
  }
}
