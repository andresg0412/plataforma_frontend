import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    // Obtener el token de autorización del header
    const authorization = request.headers.get('authorization');
    
    if (!authorization) {
      return NextResponse.json(
        { error: 'Token de autorización requerido' },
        { status: 401 }
      );
    }

    // Llamar a la API externa para eliminar el inmueble
    const externalApiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;
    
    if (!externalApiUrl) {
      return NextResponse.json(
        { error: 'URL de API externa no configurada' },
        { status: 500 }
      );
    }

    const response = await fetch(`${externalApiUrl}/properties/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authorization,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: errorText || 'Error al eliminar la propiedad' },
        { status: response.status }
      );
    }

    // Si la respuesta es exitosa pero no tiene contenido
    if (response.status === 204) {
      return NextResponse.json(
        { message: 'Propiedad eliminada exitosamente' },
        { status: 200 }
      );
    }

    // Si hay contenido en la respuesta, devolverlo
    const data = await response.json();
    return NextResponse.json(data, { status: 200 });

  } catch (error: unknown) {
    console.error('Error en API de eliminación de propiedad:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}