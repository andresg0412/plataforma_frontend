import { NextRequest, NextResponse } from 'next/server';

// Mock data for testing when external API is not available
const mockProperties = [
  {
    id: '1',
    nombre: 'Apartamento Centro',
    direccion: 'Calle 50 #12-34',
    ciudad: 'Bogotá',
    precio: 2500000,
    tipo: 'Apartamento',
    estado: 'disponible',
    descripcion: 'Apartamento moderno en el centro de la ciudad',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    nombre: 'Casa Familiar',
    direccion: 'Carrera 15 #78-90',
    ciudad: 'Medellín',
    precio: 4200000,
    tipo: 'Casa',
    estado: 'ocupado',
    descripcion: 'Casa amplia ideal para familias',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
  {
    id: '3',
    nombre: 'Oficina Ejecutiva',
    direccion: 'Av. El Poblado #123',
    ciudad: 'Medellín',
    precio: 1800000,
    tipo: 'Oficina',
    estado: 'mantenimiento',
    descripcion: 'Oficina moderna en zona empresarial',
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z',
  },
];

export async function GET() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Try to fetch from external API first
    try {
      const response = await fetch(`${apiUrl}/inmuebles`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const properties = await response.json();
        return NextResponse.json(properties);
      }
    } catch (error) {
      console.log('External API not available, using mock data:', error);
    }

    // Return mock data if external API is not available
    return NextResponse.json(mockProperties);
  } catch (error) {
    console.error('Error in properties API:', error);
    return NextResponse.json(
      { error: 'Error al obtener las propiedades' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Try external API first
    try {
      const response = await fetch(`${apiUrl}/inmuebles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const property = await response.json();
        return NextResponse.json(property);
      }
    } catch (error) {
      console.log('External API not available for POST:', error);
    }

    // Mock response for POST
    const newProperty = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(newProperty);
  } catch (error) {
    console.error('Error in properties POST API:', error);
    return NextResponse.json(
      { error: 'Error al crear la propiedad' },
      { status: 500 }
    );
  }
}