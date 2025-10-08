import type { NextApiRequest, NextApiResponse } from 'next';
import { IResumenEgresos } from '../../../interfaces/Egreso';

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
    
    const resumen = await getMockResumenEgresos(fecha, id_inmueble as string);
    
    res.status(200).json({
      success: true,
      data: resumen,
      message: 'Resumen de egresos obtenido exitosamente'
    });

  } catch (error) {
    console.error('❌ Error in getResumenEgresos API:', error);
    
    res.status(500).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Error interno del servidor'
    });
  }
}

// Función mock que simula la respuesta de la API externa
async function getMockResumenEgresos(fecha: string, id_inmueble?: string): Promise<IResumenEgresos> {
  // Simular delay de red
  await new Promise(resolve => setTimeout(resolve, 200));

  // Obtener los egresos del día usando la misma lógica del endpoint de egresos
  const egresosPorInmueble = [
    {
      id_inmueble: '1',
      nombre_inmueble: 'Apartamento Centro 101',
      egresos: [
        { monto: 120000, concepto: 'servicios_publicos' },
        { monto: 25000, concepto: 'comision' },
        { monto: 180000, concepto: 'impuestos' }
      ]
    },
    {
      id_inmueble: '2',
      nombre_inmueble: 'Casa Zona Rosa',
      egresos: [
        { monto: 75000, concepto: 'mantenimiento' }
      ]
    },
    {
      id_inmueble: '3',
      nombre_inmueble: 'Studio Chapinero 205',
      egresos: [
        { monto: 45000, concepto: 'suministros' }
      ]
    }
  ];

  // Si se especifica un inmueble, filtrar solo ese
  const inmueblesFiltrados = id_inmueble 
    ? egresosPorInmueble.filter(item => item.id_inmueble === id_inmueble)
    : egresosPorInmueble;

  // Calcular totales
  let total_egresos = 0;
  let cantidad_egresos = 0;
  
  const egresos_por_inmueble = inmueblesFiltrados.map(item => {
    const totalInmueble = item.egresos.reduce((sum, egreso) => sum + egreso.monto, 0);
    const cantidadInmueble = item.egresos.length;
    
    total_egresos += totalInmueble;
    cantidad_egresos += cantidadInmueble;
    
    return {
      id_inmueble: item.id_inmueble,
      nombre_inmueble: item.nombre_inmueble,
      total_egresos: totalInmueble,
      cantidad_egresos: cantidadInmueble
    };
  });

  // Para fechas diferentes a hoy, usar datos mock diferentes
  if (fecha !== '2025-10-08') {
    // Simular datos para otros días con menos actividad
    const factorReduccion = Math.random() * 0.7 + 0.3; // Entre 0.3 y 1.0
    total_egresos = Math.floor(total_egresos * factorReduccion);
    cantidad_egresos = Math.floor(cantidad_egresos * factorReduccion);
    
    egresos_por_inmueble.forEach(item => {
      item.total_egresos = Math.floor(item.total_egresos * factorReduccion);
      item.cantidad_egresos = Math.floor(item.cantidad_egresos * factorReduccion);
    });
  }

  return {
    fecha,
    total_egresos,
    cantidad_egresos,
    egresos_por_inmueble
  };
}