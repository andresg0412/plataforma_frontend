import { NextRequest, NextResponse } from 'next/server';

const mockUser = {
  id: '1',
  nombre: 'Usuario de Prueba',
  email: 'test@example.com',
  permisos: ['ver_inmuebles', 'crear_reservas', 'ver_reportes'],
};

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Mock authentication - accept any email/password combination
    if (email && password) {
      // Create a simple JWT-like token for testing (without actual JWT for simplicity)
      const mockToken = Buffer.from(JSON.stringify({
        ...mockUser,
        exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
        iat: Math.floor(Date.now() / 1000)
      })).toString('base64');
      
      return NextResponse.json({ token: mockToken });
    }

    return NextResponse.json(
      { error: 'Email y contraseña son requeridos' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error in login API:', error);
    return NextResponse.json(
      { error: 'Error en el servidor' },
      { status: 500 }
    );
  }
}