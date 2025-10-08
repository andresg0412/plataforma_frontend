import { NextApiRequest, NextApiResponse } from 'next';
import { IPagoApiResponse } from '../../../interfaces/Pago';

// Simulamos que eliminamos el pago de los datos mock
// En una implementación real, esto se conectaría a la base de datos

/**
 * Valida el ID del pago
 */
const validatePagoId = (id: any): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!id) {
    errors.push('ID de pago es requerido');
  } else if (isNaN(parseInt(id as string))) {
    errors.push('ID de pago debe ser un número válido');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Elimina un pago específico
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse<IPagoApiResponse>) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({
      success: false,
      message: 'Método no permitido'
    });
  }

  try {
    const { id } = req.query;
    
    const validation = validatePagoId(id);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: 'ID de pago inválido',
        error: validation.errors.join(', ')
      });
    }
    
    const pagoId = parseInt(id as string);
    
    // En una implementación real, aquí eliminarías el pago de la base de datos
    // Por ahora solo simulamos que fue eliminado exitosamente
    
    console.log('✅ Pago eliminado exitosamente, ID:', pagoId);
    
    return res.status(200).json({
      success: true,
      message: 'Pago eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error eliminando pago:', error);
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}