import { NextApiRequest, NextApiResponse } from 'next';
import { IPropietarioForm, IPropietarioTableData } from '../../../interfaces/Propietario';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({
      isError: true,
      data: null,
      message: 'Método no permitido'
    });
  }

  try {
    const { id } = req.query;
    const propietarioData: IPropietarioForm = req.body;

    if (!id) {
      return res.status(400).json({
        isError: true,
        data: null,
        message: 'ID del propietario es requerido'
      });
    }

    // Validaciones básicas
    if (!propietarioData.nombre || !propietarioData.apellido || !propietarioData.email || !propietarioData.cedula) {
      return res.status(400).json({
        isError: true,
        data: null,
        message: 'Faltan campos obligatorios: nombre, apellido, email, cedula'
      });
    }

    // Simular actualización del propietario
    const updatedPropietario: IPropietarioTableData = {
      id: parseInt(id as string),
      ...propietarioData,
      fecha_registro: '2024-01-15', // Mantener fecha original
      inmuebles: ['INM001'] // Mantener inmuebles existentes (esto vendría de la DB)
    };

    // Simular delay de red
    setTimeout(() => {
      res.status(200).json({
        isError: false,
        data: updatedPropietario,
        message: 'Propietario actualizado exitosamente'
      });
    }, 600);

  } catch (error) {
    res.status(500).json({
      isError: true,
      data: null,
      message: 'Error interno del servidor'
    });
  }
}
