/* eslint-disable @typescript-eslint/no-explicit-any */
// src/auth/editInmuebleApi.ts
export async function editInmuebleApi(inmueble: any): Promise<{ success: boolean; message: string; data?: any }> {
  const res = await fetch('/api/inmuebles/editInmueble', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(inmueble),
  });
  return res.json();
}
