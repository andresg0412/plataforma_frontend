/* eslint-disable @typescript-eslint/no-explicit-any */
// src/auth/deleteInmuebleApi.ts
export async function deleteInmuebleApi(id: string): Promise<{ success: boolean; message: string; data?: any }> {
  const res = await fetch('/api/inmuebles/deleteInmueble', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
