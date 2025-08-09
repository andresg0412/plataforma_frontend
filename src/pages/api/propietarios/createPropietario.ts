import { NextApiRequest, NextApiResponse } from 'next';
import { IPropietarioForm, IPropietarioTableData } from '../../../interfaces/Propietario';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      isError: true,
      data: null,
      message: 'Método no permitido'
    });
  }

  try {
    const propietarioData: IPropietarioForm = req.body;

    // Validaciones básicas
    if (!propietarioData.nombre || !propietarioData.apellido || !propietarioData.email || !propietarioData.cedula) {
      return res.status(400).json({
        isError: true,
        data: null,
        message: 'Faltan campos obligatorios: nombre, apellido, email, cedula'
      });
    }

    // Simular creación del propietario
    const newPropietario: IPropietarioTableData = {
      id: Date.now(), // ID temporal simulado
      ...propietarioData,
      fecha_registro: new Date().toISOString().split('T')[0],
      inmuebles: [] // Inicialmente sin inmuebles
    };

    // Simular delay de red
    setTimeout(() => {
      res.status(201).json({
        isError: false,
        data: newPropietario,
        message: 'Propietario creado exitosamente'
      });
    }, 800);

  } catch (error) {
    res.status(500).json({
      isError: true,
      data: null,
      message: 'Error interno del servidor'
    });
  }
}
