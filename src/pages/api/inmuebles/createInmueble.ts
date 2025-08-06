import type { NextApiRequest, NextApiResponse } from 'next';
import { IInmueble, IInmuebleForm } from '../../../interfaces/Inmueble';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      message: 'Método no permitido. Solo se permite POST.' 
    });
  }

  try {
    const inmuebleData: IInmuebleForm = req.body;

    // Validaciones básicas
    if (!inmuebleData.nombre || !inmuebleData.direccion || !inmuebleData.tipo) {
      return res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: nombre, dirección y tipo son obligatorios'
      });
    }

    if (!inmuebleData.precio || inmuebleData.precio <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El precio debe ser mayor a 0'
      });
    }

    if (!inmuebleData.area || inmuebleData.area <= 0) {
      return res.status(400).json({
        success: false,
        message: 'El área debe ser mayor a 0'
      });
    }

    // Simulación de delay de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Simulación de creación exitosa
    const nuevoInmueble: IInmueble = {
      id: (Math.random() * 100000).toFixed(0), // ID simulado
      nombre: inmuebleData.nombre,
      direccion: inmuebleData.direccion,
      tipo: inmuebleData.tipo,
      estado: inmuebleData.estado,
      precio: Number(inmuebleData.precio),
      descripcion: inmuebleData.descripcion || '',
      habitaciones: Number(inmuebleData.habitaciones),
      banos: Number(inmuebleData.banos),
      area: Number(inmuebleData.area),
      id_empresa: inmuebleData.id_empresa || '1',
      nombre_empresa: inmuebleData.id_empresa === '2' ? 'Propiedades Premium' : 'Inmobiliaria Central',
      fecha_creacion: new Date().toISOString(),
      fecha_actualizacion: new Date().toISOString()
    };

    // Simulación de respuesta exitosa
    res.status(201).json({
      success: true,
      data: nuevoInmueble,
      message: 'Inmueble creado exitosamente'
    });

  } catch (error) {
    console.error('Error en createInmueble:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}
