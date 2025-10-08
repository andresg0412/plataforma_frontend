import { apiFetch } from './apiFetch';
import { IPago, IPagoApiResponse, IPagoForm } from '../interfaces/Pago';

/**
 * Registra un pago como movimiento de ingreso
 */
const registerPagoAsMovimiento = async (pago: IPago): Promise<void> => {
  try {
    const movimientoData = {
      id_reserva: pago.id_reserva,
      codigo_reserva: pago.codigo_reserva,
      monto: pago.monto,
      metodo_pago: pago.metodo_pago,
      concepto: pago.concepto,
      descripcion: pago.descripcion,
      comprobante: pago.comprobante
    };
    
    await apiFetch('/api/pagos/registerMovimiento', {
      method: 'POST',
      body: JSON.stringify(movimientoData),
    });
    
  } catch (error) {
    console.error('Error registrando pago como movimiento:', error);
    throw error;
  }
};

/**
 * Obtiene todos los pagos de una reserva específica
 */
export const getPagosReservaApi = async (idReserva: number): Promise<IPago[]> => {
  try {
    console.log('🔄 Obteniendo pagos para reserva ID:', idReserva);
    
    const response: IPagoApiResponse = await apiFetch(`/api/pagos/${idReserva}`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener pagos');
    }

    const pagos = Array.isArray(response.data) ? response.data : [];
    console.log('✅ Pagos obtenidos exitosamente:', pagos.length);
    return pagos;
    
  } catch (error) {
    console.error('❌ Error en getPagosReservaApi:', error);
    throw error instanceof Error ? error : new Error('Error al obtener pagos');
  }
};

/**
 * Obtiene todos los pagos de una reserva específica para el modal de detalle
 */
export const getPagosReservaDetalleApi = async (idReserva: number): Promise<IPago[]> => {
  try {
    console.log('🔄 Obteniendo pagos detalle para reserva ID:', idReserva);
    
    const response: IPagoApiResponse = await apiFetch(`/api/reservas/pagos-detalle?id_reserva=${idReserva}`, {
      method: 'GET',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al obtener pagos');
    }

    const pagos = Array.isArray(response.data) ? response.data : [];
    console.log('✅ Pagos detalle obtenidos exitosamente:', pagos.length);
    return pagos;
    
  } catch (error) {
    console.error('❌ Error en getPagosReservaDetalleApi:', error);
    throw error instanceof Error ? error : new Error('Error al obtener pagos de la reserva');
  }
};

/**
 * Crea un nuevo pago para una reserva
 */
export const createPagoApi = async (idReserva: number, pagoData: IPagoForm): Promise<IPago> => {
  try {
    console.log('🔄 Creando pago para reserva ID:', idReserva, 'Datos:', pagoData);
    
    const response: IPagoApiResponse = await apiFetch(`/api/pagos/${idReserva}`, {
      method: 'POST',
      body: JSON.stringify(pagoData),
    });

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Error al crear pago');
    }

    const pago = Array.isArray(response.data) ? response.data[0] : response.data;
    console.log('✅ Pago creado exitosamente:', pago);
    
    // Registrar el pago como movimiento de ingreso
    try {
      await registerPagoAsMovimiento(pago);
      console.log('✅ Pago registrado como movimiento de ingreso');
    } catch (movimientoError) {
      console.error('⚠️ Error registrando movimiento (pago ya fue creado):', movimientoError);
      // No fallar el proceso completo si el movimiento falla
    }
    
    return pago;
    
  } catch (error) {
    console.error('❌ Error en createPagoApi:', error);
    throw error instanceof Error ? error : new Error('Error al crear pago');
  }
};

/**
 * Elimina un pago específico
 */
export const deletePagoApi = async (idPago: number): Promise<void> => {
  try {
    console.log('🔄 Eliminando pago ID:', idPago);
    
    const response: IPagoApiResponse = await apiFetch(`/api/pagos/deletePago?id=${idPago}`, {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.message || 'Error al eliminar pago');
    }

    console.log('✅ Pago eliminado exitosamente');
    
  } catch (error) {
    console.error('❌ Error en deletePagoApi:', error);
    throw error instanceof Error ? error : new Error('Error al eliminar pago');
  }
};

/**
 * Calcula el resumen de pagos para una reserva
 */
export const calcularResumenPagos = (pagos: IPago[]): { totalPagado: number; cantidadPagos: number } => {
  const totalPagado = pagos.reduce((sum, pago) => sum + pago.monto, 0);
  const cantidadPagos = pagos.length;
  
  return {
    totalPagado,
    cantidadPagos
  };
};