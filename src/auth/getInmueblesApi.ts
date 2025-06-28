export async function getInmueblesApi() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  const res = await fetch('/api/inmuebles/getInmuebles', {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) throw new Error('Error al obtener inmuebles');
  return res.json();
}