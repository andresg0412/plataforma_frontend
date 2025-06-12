'use client';

import { useAuth } from '../../auth/AuthContext';
import { Button } from '../../components/atoms/Button';

export const LogoutButton = () => {
  const { logout } = useAuth();
  return (
    <Button onClick={logout} variant="secondary" className="ml-auto !bg-[var(--gray-400)] !text-white cursor-pointer">Cerrar sesión</Button>
  );
};
