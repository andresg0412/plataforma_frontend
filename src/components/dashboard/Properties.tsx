import React, { useState, useEffect, useCallback } from 'react';
import { apiFetch } from '../../auth/apiFetch';
import { ChevronUp, ChevronDown, Search } from 'lucide-react';

// Interface para la estructura de datos de propiedad
interface Property {
  id: string;
  nombre: string;
  direccion: string;
  capacidad: number;
  estado: 'disponible' | 'ocupado' | 'mantenimiento' | 'inactivo';
  tipo?: string;
  precio?: number;
  descripcion?: string;
}

// Tipos para el ordenamiento
type SortField = 'nombre' | 'direccion' | 'capacidad' | 'estado' | 'tipo' | 'precio';
type SortDirection = 'asc' | 'desc';

// Interface para filtros
interface PropertyFilters {
  nombre: string;
  direccion: string;
  estado: string;
  tipo: string;
  capacidadMin: string;
  capacidadMax: string;
}

const Properties: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para ordenamiento
  const [sortField, setSortField] = useState<SortField>('nombre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Estados para filtros
  const [filters, setFilters] = useState<PropertyFilters>({
    nombre: '',
    direccion: '',
    estado: '',
    tipo: '',
    capacidadMin: '',
    capacidadMax: ''
  });

  // Cargar propiedades desde la API
  const fetchProperties = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Mock data for demonstration when API is not available
      const mockProperties: Property[] = [
        {
          id: '1',
          nombre: 'Apartamento Centro',
          direccion: 'Calle Mayor 123, Madrid',
          capacidad: 4,
          estado: 'disponible',
          tipo: 'Apartamento',
          precio: 1200,
          descripcion: 'Moderno apartamento en el centro de la ciudad'
        },
        {
          id: '2',
          nombre: 'Casa de Playa',
          direccion: 'Av. Costanera 456, Valencia',
          capacidad: 8,
          estado: 'ocupado',
          tipo: 'Casa',
          precio: 2500,
          descripcion: 'Hermosa casa frente al mar'
        },
        {
          id: '3',
          nombre: 'Estudio Barcelona',
          direccion: 'Rambla Catalunya 789, Barcelona',
          capacidad: 2,
          estado: 'mantenimiento',
          tipo: 'Estudio',
          precio: 800,
          descripcion: 'Estudio moderno en zona privilegiada'
        },
        {
          id: '4',
          nombre: 'Villa Andalucía',
          direccion: 'Calle Flores 321, Sevilla',
          capacidad: 12,
          estado: 'disponible',
          tipo: 'Villa',
          precio: 3500,
          descripcion: 'Villa tradicional andaluza con piscina'
        },
        {
          id: '5',
          nombre: 'Loft Industrial',
          direccion: 'Zona Industrial 654, Bilbao',
          capacidad: 6,
          estado: 'inactivo',
          tipo: 'Loft',
          precio: 1800,
          descripcion: 'Loft con diseño industrial moderno'
        }
      ];

      // Try to fetch from API, fallback to mock data
      try {
        // Construir parámetros de consulta para filtros y ordenamiento
        const params = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });
        
        params.append('sortField', sortField);
        params.append('sortDirection', sortDirection);
        
        const queryString = params.toString();
        const url = `${process.env.NEXT_PUBLIC_API_URL}/properties${queryString ? `?${queryString}` : ''}`;
        
        const data = await apiFetch(url);
        setProperties(data || []);
      } catch {
        // Use mock data when API is not available
        console.log('API not available, using mock data for demonstration');
        setProperties(mockProperties);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar propiedades');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, sortField, sortDirection]);

  // Aplicar filtros y ordenamiento local
  const applyFiltersAndSort = useCallback(() => {
    let filtered = [...properties];
    
    // Aplicar filtros
    if (filters.nombre) {
      filtered = filtered.filter(p => 
        p.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
      );
    }
    
    if (filters.direccion) {
      filtered = filtered.filter(p => 
        p.direccion.toLowerCase().includes(filters.direccion.toLowerCase())
      );
    }
    
    if (filters.estado) {
      filtered = filtered.filter(p => p.estado === filters.estado);
    }
    
    if (filters.tipo) {
      filtered = filtered.filter(p => 
        p.tipo?.toLowerCase().includes(filters.tipo.toLowerCase())
      );
    }
    
    if (filters.capacidadMin) {
      const min = parseInt(filters.capacidadMin);
      if (!isNaN(min)) {
        filtered = filtered.filter(p => p.capacidad >= min);
      }
    }
    
    if (filters.capacidadMax) {
      const max = parseInt(filters.capacidadMax);
      if (!isNaN(max)) {
        filtered = filtered.filter(p => p.capacidad <= max);
      }
    }
    
    // Aplicar ordenamiento
    filtered.sort((a, b) => {
      let aValue: string | number = a[sortField] ?? '';
      let bValue: string | number = b[sortField] ?? '';
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = (bValue as string).toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
    setFilteredProperties(filtered);
  }, [properties, filters, sortField, sortDirection]);

  // Efecto para cargar datos iniciales
  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  // Efecto para aplicar filtros y ordenamiento cuando cambien los datos
  useEffect(() => {
    applyFiltersAndSort();
  }, [applyFiltersAndSort]);

  // Manejar cambio de ordenamiento
  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Manejar cambio de filtros
  const handleFilterChange = (filterKey: keyof PropertyFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [filterKey]: value
    }));
  };

  // Limpiar filtros
  const clearFilters = () => {
    setFilters({
      nombre: '',
      direccion: '',
      estado: '',
      tipo: '',
      capacidadMin: '',
      capacidadMax: ''
    });
  };

  // Renderizar icono de ordenamiento
  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <div className="w-4 h-4" />; // Espacio vacío
    }
    
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  // Obtener color del estado
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'disponible': return 'text-green-600 bg-green-100';
      case 'ocupado': return 'text-red-600 bg-red-100';
      case 'mantenimiento': return 'text-yellow-600 bg-yellow-100';
      case 'inactivo': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-tourism-navy">Propiedades</h2>
        <div className="text-sm text-gray-600">
          {filteredProperties.length} de {properties.length} propiedades
        </div>
      </div>

      {/* Barra de filtros */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-gray-400" />
          <span className="font-medium text-tourism-navy">Filtros</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              value={filters.nombre}
              onChange={(e) => handleFilterChange('nombre', e.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={filters.direccion}
              onChange={(e) => handleFilterChange('direccion', e.target.value)}
              placeholder="Buscar por dirección..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              value={filters.estado}
              onChange={(e) => handleFilterChange('estado', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal focus:border-transparent"
            >
              <option value="">Todos los estados</option>
              <option value="disponible">Disponible</option>
              <option value="ocupado">Ocupado</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <input
              type="text"
              value={filters.tipo}
              onChange={(e) => handleFilterChange('tipo', e.target.value)}
              placeholder="Buscar por tipo..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad mín.
            </label>
            <input
              type="number"
              value={filters.capacidadMin}
              onChange={(e) => handleFilterChange('capacidadMin', e.target.value)}
              placeholder="Mín."
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal focus:border-transparent"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Capacidad máx.
            </label>
            <input
              type="number"
              value={filters.capacidadMax}
              onChange={(e) => handleFilterChange('capacidadMax', e.target.value)}
              placeholder="Máx."
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-tourism-teal focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex justify-end mt-4">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-sm text-tourism-navy hover:text-tourism-teal transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Tabla de propiedades */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tourism-teal mx-auto"></div>
            <p className="mt-2 text-gray-600">Cargando propiedades...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchProperties}
              className="mt-2 px-4 py-2 bg-tourism-teal text-white rounded-md hover:bg-tourism-navy transition-colors"
            >
              Reintentar
            </button>
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">
              {properties.length === 0 
                ? 'No hay propiedades registradas' 
                : 'No se encontraron propiedades que coincidan con los filtros aplicados'}
            </p>
            {properties.length > 0 && (
              <button
                onClick={clearFilters}
                className="mt-2 px-4 py-2 bg-tourism-teal text-white rounded-md hover:bg-tourism-navy transition-colors"
              >
                Limpiar filtros
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    onClick={() => handleSort('nombre')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Nombre
                      {renderSortIcon('nombre')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('direccion')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Dirección
                      {renderSortIcon('direccion')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('capacidad')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Capacidad
                      {renderSortIcon('capacidad')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('estado')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Estado
                      {renderSortIcon('estado')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('tipo')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Tipo
                      {renderSortIcon('tipo')}
                    </div>
                  </th>
                  <th
                    onClick={() => handleSort('precio')}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      Precio
                      {renderSortIcon('precio')}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {property.nombre}
                      </div>
                      {property.descripcion && (
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {property.descripcion}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.direccion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.capacidad} {property.capacidad === 1 ? 'persona' : 'personas'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(property.estado)}`}>
                        {property.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.tipo || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {property.precio ? `$${property.precio.toLocaleString()}` : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties;
