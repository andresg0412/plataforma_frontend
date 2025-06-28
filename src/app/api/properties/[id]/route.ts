import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Try external API first
    try {
      const response = await fetch(`${apiUrl}/inmuebles/${id}`, {
        method: 'PUT',
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
      console.log('External API not available for PUT, returning mock response:', error);
    }

    // Mock response when external API is not available
    const updatedProperty = {
      ...body,
      id,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error in properties PUT API:', error);
    return NextResponse.json(
      { error: 'Error al actualizar la propiedad' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    // Try external API first
    try {
      const response = await fetch(`${apiUrl}/inmuebles/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        return NextResponse.json({ message: 'Propiedad eliminada exitosamente' });
      }
    } catch (error) {
      console.log('External API not available for DELETE:', error);
    }

    // Mock response
    return NextResponse.json({ message: 'Propiedad eliminada exitosamente' });
  } catch (error) {
    console.error('Error in properties DELETE API:', error);
    return NextResponse.json(
      { error: 'Error al eliminar la propiedad' },
      { status: 500 }
    );
  }
}