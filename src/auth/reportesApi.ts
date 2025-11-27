import { apiFetch } from './apiFetch';
import {
  IReporteFinanciero,
  IReporteConfig,
  IOpcionesReporte,
  IReporteApiResponse
} from '../interfaces/Reporte';
import {
  mockOpcionesReporte,
  mockReporteCompleto
} from '../lib/reportesMock';
import { PlataformaOrigen } from '../constants/plataformas';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * ========================================
 * FUNCIONES DE REPORTES POR PLATAFORMA
 * ========================================
 */

export interface IReportePlataformaData {
  [plataforma: string]: {
    total_ingresos: number;
    cantidad_reservas: number;
  };
}

export interface IReportePlataformaResponse {
  success: boolean;
  data?: IReportePlataformaData;
  message: string;
  error?: string;
}

export const getReportePorPlataforma = async (
  fechaInicio: string,
  fechaFin: string
): Promise<IReportePlataformaResponse> => {
  try {
    const response: IReportePlataformaResponse = await apiFetch(
      `/api/reportes/porPlataforma?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`,
      { method: 'GET' }
    );
    return response;
  } catch (error) {
    console.error('❌ Error al obtener reporte por plataforma:', error);
    return {
      success: false,
      message: 'Error al obtener reporte por plataforma',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

export const getResumenPlataforma = async (
  fechaInicio: string,
  fechaFin: string,
  plataforma: PlataformaOrigen
): Promise<{ success: boolean; data?: { total_ingresos: number; cantidad_reservas: number }; message: string; error?: string }> => {
  try {
    const reporteCompleto = await getReportePorPlataforma(fechaInicio, fechaFin);

    if (!reporteCompleto.success || !reporteCompleto.data) {
      return {
        success: false,
        message: reporteCompleto.message,
        error: reporteCompleto.error
      };
    }

    const dataPlataforma = reporteCompleto.data[plataforma];

    if (!dataPlataforma) {
      return {
        success: true,
        data: { total_ingresos: 0, cantidad_reservas: 0 },
        message: `No se encontraron datos para la plataforma ${plataforma}`
      };
    }

    return {
      success: true,
      data: dataPlataforma,
      message: `Resumen de ${plataforma} obtenido exitosamente`
    };
  } catch (error) {
    console.error('❌ Error al obtener resumen de plataforma:', error);
    return {
      success: false,
      message: 'Error al obtener resumen de plataforma',
      error: error instanceof Error ? error.message : 'Error desconocido'
    };
  }
};

/**
 * ========================================
 * FUNCIONES DE REPORTES GENERALES
 * ========================================
 */

// Obtener opciones para los filtros (empresas, inmuebles, propietarios)
export const getOpcionesReporte = async (empresaId?: number, tipo?: 'empresas' | 'inmuebles' | 'propietarios'): Promise<IOpcionesReporte | null> => {
  try {
    const params = new URLSearchParams();
    if (empresaId) params.append('empresaId', empresaId.toString());
    if (tipo) params.append('tipo', tipo);

    const response = await apiFetch(`/api/reportes/opciones?${params.toString()}`, {
      method: 'GET',
    });

    if (response.success && response.data) {
      return response.data as IOpcionesReporte;
    }

    console.error('Error al obtener opciones de reporte:', response.message);
    return null;
  } catch (error) {
    console.error('Error en getOpcionesReporte:', error);
    return null;
  }
};

// Generar reporte financiero
export const generarReporteFinanciero = async (config: IReporteConfig): Promise<IReporteFinanciero | null> => {
  try {
    // Pero idealmente debería usar el servicio real si ya existe
    await new Promise(resolve => setTimeout(resolve, 1000));

    const reporteConConfig = {
      ...mockReporteCompleto,
      config: config,
      fecha_generacion: new Date().toISOString()
    };

    return reporteConConfig;
  } catch (error) {
    console.error('Error en generarReporteFinanciero:', error);
    return null;
  }
};

// ... (Otras funciones auxiliares se mantienen igual o se pueden simplificar si no se usan)
export const getResumenRapido = async (
  tipo: 'empresa' | 'inmueble' | 'propietario',
  id: string,
  año: number,
  mes: number
): Promise<any | null> => {
  return null; // Placeholder
};

export const getComparacionMensual = async (
  tipo: 'empresa' | 'inmueble' | 'propietario',
  id: string,
  año: number
): Promise<any | null> => {
  return null; // Placeholder
};

export const getTendenciasAnuales = async (
  tipo: 'empresa' | 'inmueble' | 'propietario',
  id: string,
  años: number[]
): Promise<any | null> => {
  return null; // Placeholder
};

export const descargarReportePDF = async (config: IReporteConfig): Promise<string | null> => {
  return null; // Placeholder
};

export const descargarReporteExcel = async (config: IReporteConfig): Promise<string | null> => {
  return null; // Placeholder
};