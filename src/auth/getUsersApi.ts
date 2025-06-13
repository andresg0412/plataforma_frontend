export async function getUsersApi() {
  const res = await fetch('/api/users/getUsers');
  if (!res.ok) throw new Error('Error al obtener usuarios');
  return res.json();
}
