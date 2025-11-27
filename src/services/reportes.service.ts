import { apiFetch } from '../auth/apiFetch';

export interface ReporteFinancieroFilters {
    empresaId?: number;
    inmuebleId?: number;
    propietarioId?: number;
    fechaInicio?: string;
    fechaFin?: string;
}

export const getReporteFinanciero = async (filters: ReporteFinancieroFilters) => {
    const queryParams = new URLSearchParams();
    if (filters.empresaId) queryParams.append('empresaId', filters.empresaId.toString());
    if (filters.inmuebleId) queryParams.append('inmuebleId', filters.inmuebleId.toString());
    if (filters.propietarioId) queryParams.append('propietarioId', filters.propietarioId.toString());
    if (filters.fechaInicio) queryParams.append('fechaInicio', filters.fechaInicio);
    if (filters.fechaFin) queryParams.append('fechaFin', filters.fechaFin);

    // Call internal Next.js API
    return apiFetch(`/api/reportes/financiero?${queryParams.toString()}`);
};
