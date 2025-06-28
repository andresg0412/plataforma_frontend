import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const body = await request.json();
    
    // Basic validation
    const { nombre, direccion, capacidad, id_propietario, id_empresa, estado } = body;
    
    if (!nombre || !direccion || !capacidad || !id_propietario || !id_empresa) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      );
    }

    // Validate capacidad is a positive number
    if (typeof capacidad !== 'number' || capacidad <= 0) {
      return NextResponse.json(
        { error: 'La capacidad debe ser un número válido mayor a 0' },
        { status: 400 }
      );
    }

    // Get authorization header (assuming it exists from auth context)
    const authHeader = request.headers.get('authorization');
    
    // Call external API
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    if (!externalApiUrl) {
      return NextResponse.json(
        { error: 'API URL no configurada' },
        { status: 500 }
      );
    }

    const response = await fetch(`${externalApiUrl}/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { 'Authorization': authHeader }),
      },
      body: JSON.stringify({
        nombre,
        direccion,
        capacidad,
        id_propietario,
        id_empresa,
        estado: estado || 'activo'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Error en el servidor externo' },
        { status: response.status }
      );
    }

    const result = await response.json();
    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}