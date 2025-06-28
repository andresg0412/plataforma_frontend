import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Obtener el token de autorización del header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization token provided' }, { status: 401 });
    }

    // Realizar la petición a la API externa del backend
    const externalApiUrl = `${process.env.NEXT_PUBLIC_API_URL}/inmuebles`;
    
    const response = await fetch(externalApiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `Error from external API: ${errorText}` }, 
        { status: response.status }
      );
    }

    const inmuebles = await response.json();
    return NextResponse.json(inmuebles);

  } catch (error) {
    console.error('Error fetching inmuebles:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}