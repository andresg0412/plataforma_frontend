// src/auth/deleteUserApi.ts
export async function deleteUserApi(id: string): Promise<{ success: boolean; message: string }> {
  const res = await fetch('/api/users/deleteUser', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  return res.json();
}
