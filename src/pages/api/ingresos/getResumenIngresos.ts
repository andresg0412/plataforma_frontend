import type { NextApiRequest, NextApiResponse } from 'next';
import { IResumenIngresos } from '../../../interfaces/Ingreso';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      success: false,
      message: 'Método no permitido' 
    });
  }

  try {
    const { fecha, id_inmueble } = req.query;

    if (!fecha || typeof fecha !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'La fecha es requerida'
      });
    }

    // En el futuro, aquí se haría la llamada a la API externa real
    // Por ahora, usamos data mockeada simulando la respuesta esperada
    
    const resumen = await getMockResumenIngresos(fecha, id_inmueble as string);
    
    res.status(200).json({
      success: true,
      data: resumen,
      message: 'Resumen de ingresos obtenido exitosamente'
    });

  } catch (error) {
    console.error('❌ Error in getResumenIngresos API:', error);
    
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}

// Función mock que simula la respuesta de la API externa
async function getMockResumenIngresos(fecha: string, id_inmueble?: string): Promise<IResumenIngresos> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));

  // Obtener los ingresos del día usando la misma lógica del endpoint de ingresos
  const ingresosPorInmueble = [
    {
      id_inmueble: '1',
      nombre_inmueble: 'Apartamento Centro 101',
      ingresos: [
        { monto: 250000, tipo: 'movimiento' },
        { monto: 50000, tipo: 'movimiento' },
        { monto: 150000, tipo: 'pago' }
      ]
    },
    {
      id_inmueble: '2',
      nombre_inmueble: 'Casa Zona Rosa',
      ingresos: [
        { monto: 180000, tipo: 'movimiento' },
        { monto: 25000, tipo: 'movimiento' }
      ]
    },
    {
      id_inmueble: '3',
      nombre_inmueble: 'Studio Chapinero 205',
      ingresos: [
        { monto: 100000, tipo: 'movimiento' },
        { monto: 200000, tipo: 'pago' }
      ]
    }
  ];

  // Si se especifica un inmueble, filtrar solo ese
  const inmueblesFiltrados = id_inmueble 
    ? ingresosPorInmueble.filter(item => item.id_inmueble === id_inmueble)
    : ingresosPorInmueble;

  // Calcular totales
  let total_ingresos = 0;
  let cantidad_ingresos = 0;
  
  const ingresos_por_inmueble = inmueblesFiltrados.map(item => {
    const totalInmueble = item.ingresos.reduce((sum, ingreso) => sum + ingreso.monto, 0);
    const cantidadInmueble = item.ingresos.length;
    
    total_ingresos += totalInmueble;
    cantidad_ingresos += cantidadInmueble;
    
    return {
      id_inmueble: item.id_inmueble,
      nombre_inmueble: item.nombre_inmueble,
      total_ingresos: totalInmueble,
      cantidad_ingresos: cantidadInmueble
    };
  });

  // Para fechas diferentes a hoy, usar datos mock diferentes
  if (fecha !== '2025-10-08') {
    // Simular datos para otros días con menos actividad
    const factorReduccion = Math.random() * 0.7 + 0.3; // Entre 0.3 y 1.0
    total_ingresos = Math.floor(total_ingresos * factorReduccion);
    cantidad_ingresos = Math.floor(cantidad_ingresos * factorReduccion);
    
    ingresos_por_inmueble.forEach(item => {
      item.total_ingresos = Math.floor(item.total_ingresos * factorReduccion);
      item.cantidad_ingresos = Math.floor(item.cantidad_ingresos * factorReduccion);
    });
  }

  return {
    fecha,
    total_ingresos,
    cantidad_ingresos,
    ingresos_por_inmueble
  };
}