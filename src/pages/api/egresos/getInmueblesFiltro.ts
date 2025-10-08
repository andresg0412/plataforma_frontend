import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Método no permitido' 
    });
  }

  try {
    // En el futuro, aquí se haría la llamada a la API externa real
    // Por ahora, usamos data mockeada
    
    const mockInmuebles = [
      { id: '1', nombre: 'Apartamento Centro 101' },
      { id: '2', nombre: 'Casa Zona Rosa' },
      { id: '3', nombre: 'Studio Chapinero 205' },
      { id: '4', nombre: 'Penthouse Norte' },
      { id: '5', nombre: 'Apartamento Zona T' }
    ];

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 200));
    
    res.status(200).json({
      success: true,
      data: mockInmuebles,
      message: 'Inmuebles para filtro obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error in getInmueblesFiltro API:', error);
    
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}