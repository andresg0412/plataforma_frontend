export async function createUserApi(user: { nombre: string; cedula: string; email: string; username: string; empresa: string; rol: string }) {
  const res = await fetch('/api/users/createUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Error al crear usuario');
  return res.json();
}
