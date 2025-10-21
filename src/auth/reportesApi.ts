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

/**
 * Interfaces para Reportes por Plataforma
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

/**
 * Obtiene reporte de ingresos por plataforma en un rango de fechas
 * Conectado a la API externa a través de API interna
 */
export const getReportePorPlataforma = async (
  fechaInicio: string, 
  fechaFin: string
): Promise<IReportePlataformaResponse> => {
  try {
    console.log('🔄 Obteniendo reporte por plataforma:', { fechaInicio, fechaFin });
    
    const response: IReportePlataformaResponse = await apiFetch(
      `/api/reportes/porPlataforma?fecha_inicio=${fechaInicio}&fecha_fin=${fechaFin}`, 
      {
        method: 'GET',
      }
    );

    console.log('✅ Reporte por plataforma obtenido exitosamente:', response.data);
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

/**
 * Obtiene resumen de una plataforma específica para un período
 * Función de utilidad que extrae datos de una plataforma específica del reporte completo
 */
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
 * FUNCIONES DE REPORTES GENERALES EXISTENTES
 * ========================================
 */

// Obtener opciones para los filtros (empresas, inmuebles, propietarios)
export const getOpcionesReporte = async (): Promise<IOpcionesReporte | null> => {
  try {
    // TODO: Cambiar por llamada real al backend cuando esté disponible
    // const response = await apiFetch(`${API_BASE_URL}/reportes/opciones`, {
    //   method: 'GET',
    // });

    // Simulación de datos mock
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simular carga
    return mockOpcionesReporte;

    // Código para cuando el backend esté listo:
    /*
    if (response.success && response.data) {
      return response.data as IOpcionesReporte;
    }
    
    console.error('Error al obtener opciones de reporte:', response.message);
    return null;
    */
  } catch (error) {
    console.error('Error en getOpcionesReporte:', error);
    return null;
  }
};

// Generar reporte financiero
export const generarReporteFinanciero = async (config: IReporteConfig): Promise<IReporteFinanciero | null> => {
  try {
    // TODO: Cambiar por llamada real al backend cuando esté disponible
    // const response = await apiFetch(`${API_BASE_URL}/reportes/financiero`, {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(config),
    // });

    // Simulación de datos mock
    await new Promise(resolve => setTimeout(resolve, 2000)); // Simular procesamiento
    
    // Actualizar config del mock con los datos reales
    const reporteConConfig = {
      ...mockReporteCompleto,
      config: config,
      fecha_generacion: new Date().toISOString()
    };
    
    return reporteConConfig;

    // Código para cuando el backend esté listo:
    /*
    if (response.success && response.data) {
      return response.data as IReporteFinanciero;
    }
    
    console.error('Error al generar reporte:', response.message);
    return null;
    */
  } catch (error) {
    console.error('Error en generarReporteFinanciero:', error);
    return null;
  }
};

// Obtener reporte rápido (resumen básico para dashboard)
export const getResumenRapido = async (
  tipo: 'empresa' | 'inmueble' | 'propietario',
  id: string,
  año: number,
  mes: number
): Promise<any | null> => {
  try {
    const params = new URLSearchParams({
      tipo,
      id,
      año: año.toString(),
      mes: mes.toString()
    });

    const response = await apiFetch(`${API_BASE_URL}/reportes/resumen?${params}`, {
      method: 'GET',
    });

    if (response.success && response.data) {
      return response.data;
    }
    
    console.error('Error al obtener resumen rápido:', response.message);
    return null;
  } catch (error) {
    console.error('Error en getResumenRapido:', error);
    return null;
  }
};

// Obtener datos de comparación mensual
export const getComparacionMensual = async (
  tipo: 'empresa' | 'inmueble' | 'propietario',
  id: string,
  año: number
): Promise<any | null> => {
  try {
    const params = new URLSearchParams({
      tipo,
      id,
      año: año.toString()
    });

    const response = await apiFetch(`${API_BASE_URL}/reportes/comparacion-mensual?${params}`, {
      method: 'GET',
    });

    if (response.success && response.data) {
      return response.data;
    }
    
    console.error('Error al obtener comparación mensual:', response.message);
    return null;
  } catch (error) {
    console.error('Error en getComparacionMensual:', error);
    return null;
  }
};

// Obtener tendencias anuales
export const getTendenciasAnuales = async (
  tipo: 'empresa' | 'inmueble' | 'propietario',
  id: string,
  años: number[]
): Promise<any | null> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/reportes/tendencias`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipo,
        id,
        años
      }),
    });

    if (response.success && response.data) {
      return response.data;
    }
    
    console.error('Error al obtener tendencias:', response.message);
    return null;
  } catch (error) {
    console.error('Error en getTendenciasAnuales:', error);
    return null;
  }
};

// Descargar reporte en PDF (obtiene URL de descarga)
export const descargarReportePDF = async (config: IReporteConfig): Promise<string | null> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/reportes/export/pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (response.success && response.data) {
      return response.data.download_url;
    }
    
    console.error('Error al generar PDF:', response.message);
    return null;
  } catch (error) {
    console.error('Error en descargarReportePDF:', error);
    return null;
  }
};

// Exportar reporte en Excel
export const descargarReporteExcel = async (config: IReporteConfig): Promise<string | null> => {
  try {
    const response = await apiFetch(`${API_BASE_URL}/reportes/export/excel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(config),
    });

    if (response.success && response.data) {
      return response.data.download_url;
    }
    
    console.error('Error al generar Excel:', response.message);
    return null;
  } catch (error) {
    console.error('Error en descargarReporteExcel:', error);
    return null;
  }
};