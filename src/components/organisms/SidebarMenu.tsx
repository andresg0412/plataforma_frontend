import React from 'react';
import {
  Building2,
  Home,
  Calendar,
  Users,
  BarChart3,
  CreditCard,
  FileText,
} from 'lucide-react';
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu as SidebarMenuList,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { useAuth } from '../../auth/AuthContext';

const menuItems = [
  { key: 'main', title: 'Panel Principal', icon: Home },
  { key: 'bookings', title: 'Reservas', icon: Calendar },
  { key: 'properties', title: 'Propiedades', icon: Building2 },
  { key: 'guests', title: 'Huéspedes', icon: Users },
  { key: 'availability', title: 'Disponibilidad', icon: FileText },
];

const analyticsItems = [
  { key: 'reports', title: 'Reportes', icon: BarChart3 },
  { key: 'cashbox', title: 'Caja', icon: CreditCard },
  { key: 'incomes', title: 'Ingresos', icon: CreditCard },
  { key: 'deductions', title: 'Deducibles', icon: FileText },
];

// Mapeo de permisos a claves de menú
const PERMISO_MENU_MAP: Record<string, string> = {
  ver_inmuebles: 'properties',
  crear_reserva: 'bookings',
  ver_reportes: 'reports',
  ver_huespedes: 'guests',
  ver_disponibilidad: 'availability',
  ver_caja: 'cashbox',
  ver_ingresos: 'incomes',
  ver_egresos: 'deductions',
  // Agrega más mapeos según tus claves de permisos
};

interface SidebarMenuProps {
  activeKey: string;
  onSelect: (key: string) => void;
}

const SidebarMenu: React.FC<SidebarMenuProps> = ({ activeKey, onSelect }) => {
  const { user } = useAuth();
  const permisos = user?.permisos || [];
  // Determina qué claves de menú mostrar según permisos
  //interface User {
  //  permisos: string[];
  //  // Agrega más propiedades si es necesario
  //}

  //interface MenuItem {
  //  key: string;
  //  title: string;
  //  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  //}

  const allowedKeys: Set<string> = new Set(
    (permisos as string[])
      .map((p: string) => PERMISO_MENU_MAP[p])
      .filter(Boolean)
  );
  // Siempre mostrar el panel principal
  allowedKeys.add('main');

  return (
    <nav className="flex flex-col gap-2 p-0">
      <SidebarGroup>
        <SidebarGroupLabel className="text-tourism-navy font-semibold">Gestión Principal</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuList>
            {menuItems.filter(item => allowedKeys.has(item.key)).map((item) => (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  className={`flex items-center gap-2 hover:bg-tourism-sage/10 hover:text-tourism-navy ${activeKey === item.key ? 'bg-tourism-teal/10 text-tourism-navy border-r-2 border-tourism-teal' : ''}`}
                  onClick={() => onSelect(item.key)}
                  data-active={activeKey === item.key}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenuList>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel className="text-tourism-navy font-semibold">Análisis y Finanzas</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenuList>
            {analyticsItems.filter(item => allowedKeys.has(item.key)).map((item) => (
              <SidebarMenuItem key={item.key}>
                <SidebarMenuButton
                  className={`flex items-center gap-2 hover:bg-tourism-sage/10 hover:text-tourism-navy ${activeKey === item.key ? 'bg-tourism-teal/10 text-tourism-navy border-r-2 border-tourism-teal' : ''}`}
                  onClick={() => onSelect(item.key)}
                  data-active={activeKey === item.key}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenuList>
        </SidebarGroupContent>
      </SidebarGroup>
    </nav>
  );
};

export default SidebarMenu;
