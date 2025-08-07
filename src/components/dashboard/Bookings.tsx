/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import ReservasTable from './ReservasTable';
import CreateReservaModal from './CreateReservaModal';
import CreateReservaButton from './CreateReservaButton';
import ReservaDetailModal from './ReservaDetailModal';
import HuespedesListModal from './HuespedesListModal';
import SuccessModal from './SuccessModal';
import ConfirmModal from './ConfirmModal';
import { useAuth } from '../../auth/AuthContext';
import { IReservaForm, IReservaTableData, IHuesped } from '../../interfaces/Reserva';

// Data simulada para huéspedes
const mockHuespedes: IHuesped[] = [
  // Huéspedes para Reserva 1
  {
    id: 1,
    nombre: 'María',
    apellido: 'García',
    email: 'maria.garcia@email.com',
    telefono: '+57 300 123 4567',
    documento_tipo: 'cedula',
    documento_numero: '12345678',
    fecha_nacimiento: '1985-03-15',
    es_principal: true,
    id_reserva: 1,
  },
  {
    id: 2,
    nombre: 'Pedro',
    apellido: 'García',
    email: 'pedro.garcia@email.com',
    telefono: '+57 300 123 4568',
    documento_tipo: 'cedula',
    documento_numero: '87654321',
    fecha_nacimiento: '1983-07-22',
    es_principal: false,
    id_reserva: 1,
  },
  // Huéspedes para Reserva 2
  {
    id: 3,
    nombre: 'Juan Carlos',
    apellido: 'Rodríguez',
    email: 'juan.rodriguez@email.com',
    telefono: '+57 310 987 6543',
    documento_tipo: 'cedula',
    documento_numero: '23456789',
    fecha_nacimiento: '1978-11-10',
    es_principal: true,
    id_reserva: 2,
  },
  {
    id: 4,
    nombre: 'Carmen',
    apellido: 'Rodríguez',
    email: 'carmen.rodriguez@email.com',
    telefono: '+57 310 987 6544',
    documento_tipo: 'cedula',
    documento_numero: '34567890',
    fecha_nacimiento: '1980-05-18',
    es_principal: false,
    id_reserva: 2,
  },
  {
    id: 5,
    nombre: 'Sofia',
    apellido: 'Rodríguez',
    email: '',
    telefono: '',
    documento_tipo: 'cedula',
    documento_numero: '45678901',
    fecha_nacimiento: '2010-09-03',
    es_principal: false,
    id_reserva: 2,
  },
  {
    id: 6,
    nombre: 'Miguel',
    apellido: 'Rodríguez',
    email: '',
    telefono: '',
    documento_tipo: 'cedula',
    documento_numero: '56789012',
    fecha_nacimiento: '2012-12-25',
    es_principal: false,
    id_reserva: 2,
  },
  // Huéspedes para Reserva 3
  {
    id: 7,
    nombre: 'Ana',
    apellido: 'Martínez',
    email: 'ana.martinez@email.com',
    telefono: '+57 320 456 7890',
    documento_tipo: 'pasaporte',
    documento_numero: 'AB123456',
    fecha_nacimiento: '1992-01-28',
    es_principal: true,
    id_reserva: 3,
  },
  // Huéspedes para Reserva 4
  {
    id: 8,
    nombre: 'Carlos',
    apellido: 'López',
    email: 'carlos.lopez@email.com',
    telefono: '+57 315 789 0123',
    documento_tipo: 'cedula',
    documento_numero: '67890123',
    fecha_nacimiento: '1975-06-14',
    es_principal: true,
    id_reserva: 4,
  },
  {
    id: 9,
    nombre: 'Isabel',
    apellido: 'López',
    email: 'isabel.lopez@email.com',
    telefono: '+57 315 789 0124',
    documento_tipo: 'cedula',
    documento_numero: '78901234',
    fecha_nacimiento: '1977-09-20',
    es_principal: false,
    id_reserva: 4,
  },
  // Huéspedes para Reserva 5
  {
    id: 10,
    nombre: 'Laura',
    apellido: 'Fernández',
    email: 'laura.fernandez@email.com',
    telefono: '+57 318 555 0123',
    documento_tipo: 'cedula',
    documento_numero: '89012345',
    fecha_nacimiento: '1988-04-12',
    es_principal: true,
    id_reserva: 5,
  },
  {
    id: 11,
    nombre: 'Roberto',
    apellido: 'Fernández',
    email: 'roberto.fernandez@email.com',
    telefono: '+57 318 555 0124',
    documento_tipo: 'cedula',
    documento_numero: '90123456',
    fecha_nacimiento: '1985-08-30',
    es_principal: false,
    id_reserva: 5,
  },
  {
    id: 12,
    nombre: 'Lucia',
    apellido: 'Fernández',
    email: '',
    telefono: '',
    documento_tipo: 'cedula',
    documento_numero: '01234567',
    fecha_nacimiento: '2015-02-14',
    es_principal: false,
    id_reserva: 5,
  },
];

// Data simulada para reservas
const mockReservas: IReservaTableData[] = [
  {
    id: 1,
    codigo_reserva: 'RSV-2024-001',
    id_inmueble: 1,
    nombre_inmueble: 'Apartamento Centro Histórico',
    huesped_principal: {
      nombre: 'María',
      apellido: 'García',
      email: 'maria.garcia@email.com',
      telefono: '+57 300 123 4567',
    },
    fecha_entrada: '2024-08-15',
    fecha_salida: '2024-08-18',
    numero_huespedes: 2,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 1),
    precio_total: 450000,
    estado: 'confirmada',
    fecha_creacion: '2024-08-01',
    observaciones: 'Llegada tarde, después de las 18:00',
    id_empresa: 1,
  },
  {
    id: 2,
    codigo_reserva: 'RSV-2024-002',
    id_inmueble: 2,
    nombre_inmueble: 'Casa de Playa Cartagena',
    huesped_principal: {
      nombre: 'Juan Carlos',
      apellido: 'Rodríguez',
      email: 'juan.rodriguez@email.com',
      telefono: '+57 310 987 6543',
    },
    fecha_entrada: '2024-08-20',
    fecha_salida: '2024-08-25',
    numero_huespedes: 4,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 2),
    precio_total: 1250000,
    estado: 'pendiente',
    fecha_creacion: '2024-08-05',
    observaciones: '',
    id_empresa: 1,
  },
  {
    id: 3,
    codigo_reserva: 'RSV-2024-003',
    id_inmueble: 3,
    nombre_inmueble: 'Loft Zona Rosa',
    huesped_principal: {
      nombre: 'Ana',
      apellido: 'Martínez',
      email: 'ana.martinez@email.com',
      telefono: '+57 320 456 7890',
    },
    fecha_entrada: '2024-08-10',
    fecha_salida: '2024-08-12',
    numero_huespedes: 1,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 3),
    precio_total: 280000,
    estado: 'completada',
    fecha_creacion: '2024-07-25',
    observaciones: 'Cliente frecuente',
    id_empresa: 1,
  },
  {
    id: 4,
    codigo_reserva: 'RSV-2024-004',
    id_inmueble: 4,
    nombre_inmueble: 'Estudio Chapinero',
    huesped_principal: {
      nombre: 'Carlos',
      apellido: 'López',
      email: 'carlos.lopez@email.com',
      telefono: '+57 315 789 0123',
    },
    fecha_entrada: '2024-08-12',
    fecha_salida: '2024-08-14',
    numero_huespedes: 2,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 4),
    precio_total: 320000,
    estado: 'en_proceso',
    fecha_creacion: '2024-08-02',
    observaciones: 'Necesita cuna para bebé',
    id_empresa: 1,
  },
  {
    id: 5,
    codigo_reserva: 'RSV-2024-005',
    id_inmueble: 1,
    nombre_inmueble: 'Apartamento Centro Histórico',
    huesped_principal: {
      nombre: 'Laura',
      apellido: 'Fernández',
      email: 'laura.fernandez@email.com',
      telefono: '+57 318 555 0123',
    },
    fecha_entrada: '2024-08-25',
    fecha_salida: '2024-08-27',
    numero_huespedes: 3,
    huespedes: mockHuespedes.filter(h => h.id_reserva === 5),
    precio_total: 300000,
    estado: 'cancelada',
    fecha_creacion: '2024-08-03',
    observaciones: 'Cancelada por el cliente',
    id_empresa: 1,
  },
];

const Bookings: React.FC = () => {
  const [reservas, setReservas] = useState<IReservaTableData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [huespedesModalOpen, setHuespedesModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [reservaToEdit, setReservaToEdit] = useState<IReservaTableData | null>(null);
  const [reservaToDelete, setReservaToDelete] = useState<IReservaTableData | null>(null);
  const [reservaToView, setReservaToView] = useState<IReservaTableData | null>(null);
  const [reservaToViewHuespedes, setReservaToViewHuespedes] = useState<IReservaTableData | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const canCreate = user?.permisos?.includes('crear_reservas') || true; // TEMPORAL: siempre true para debugging
  const canEdit = user?.permisos?.includes('editar_reservas') || true; // TEMPORAL: siempre true para debugging
  const canDelete = user?.permisos?.includes('eliminar_reservas') || true; // TEMPORAL: siempre true para debugging

  console.log('=== RESERVAS DEBUG ===');
  console.log('user:', user);
  console.log('user permisos:', user?.permisos);
  console.log('canCreate:', canCreate);
  console.log('canEdit:', canEdit);
  console.log('canDelete:', canDelete);
  console.log('========================');

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setReservas(mockReservas);
      setLoading(false);
    }, 1000);
  }, []);

  const generateReservaCode = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RSV-${year}-${randomNum}`;
  };

  const handleCreate = async (reservaData: IReservaForm) => {
    try {
      // Encontrar el nombre del inmueble
      const inmuebles = [
        { id: 1, nombre: 'Apartamento Centro Histórico' },
        { id: 2, nombre: 'Casa de Playa Cartagena' },
        { id: 3, nombre: 'Loft Zona Rosa' },
        { id: 4, nombre: 'Estudio Chapinero' },
      ];
      
      const inmueble = inmuebles.find(i => i.id === reservaData.id_inmueble);
      
      // Separar nombre y apellido del huésped
      const nombreCompleto = reservaData.huesped_nombre.split(' ');
      const nombre = nombreCompleto[0] || '';
      const apellido = nombreCompleto.slice(1).join(' ') || '';
      
      // Simular creación
      const newReserva: IReservaTableData = {
        id: Date.now(), // ID temporal
        codigo_reserva: generateReservaCode(),
        nombre_inmueble: inmueble?.nombre || 'Inmueble no encontrado',
        huesped_principal: {
          nombre: nombre,
          apellido: apellido,
          email: reservaData.huesped_email,
          telefono: reservaData.huesped_telefono,
        },
        huespedes: [
          {
            id: Date.now(),
            nombre: nombre,
            apellido: apellido,
            email: reservaData.huesped_email,
            telefono: reservaData.huesped_telefono,
            documento_tipo: 'cedula',
            documento_numero: '00000000',
            fecha_nacimiento: '1990-01-01',
            es_principal: true,
            id_reserva: Date.now(),
          }
        ],
        id_inmueble: reservaData.id_inmueble,
        fecha_entrada: reservaData.fecha_entrada,
        fecha_salida: reservaData.fecha_salida,
        numero_huespedes: reservaData.numero_huespedes,
        precio_total: reservaData.precio_total,
        estado: reservaData.estado,
        observaciones: reservaData.observaciones,
        id_empresa: reservaData.id_empresa,
        fecha_creacion: new Date().toISOString().split('T')[0],
      };
      
      setReservas(prev => [...prev, newReserva]);
      setSuccessMsg('Reserva creada exitosamente');
      setSuccessOpen(true);
      setModalOpen(false);
    } catch (e) {
      alert(e || 'Error al crear reserva');
    }
  };

  const handleEdit = (reserva: IReservaTableData) => {
    if (!canEdit) return;
    setReservaToEdit(reserva);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (reservaData: IReservaForm) => {
    if (!reservaToEdit) return;
    
    try {
      // Encontrar el nombre del inmueble
      const inmuebles = [
        { id: 1, nombre: 'Apartamento Centro Histórico' },
        { id: 2, nombre: 'Casa de Playa Cartagena' },
        { id: 3, nombre: 'Loft Zona Rosa' },
        { id: 4, nombre: 'Estudio Chapinero' },
      ];
      
      const inmueble = inmuebles.find(i => i.id === reservaData.id_inmueble);
      
      // Separar nombre y apellido del huésped
      const nombreCompleto = reservaData.huesped_nombre.split(' ');
      const nombre = nombreCompleto[0] || '';
      const apellido = nombreCompleto.slice(1).join(' ') || '';
      
      // Simular edición
      setReservas(prev => prev.map(reserva => 
        reserva.id === reservaToEdit.id 
          ? { 
              ...reserva, 
              id_inmueble: reservaData.id_inmueble,
              nombre_inmueble: inmueble?.nombre || reserva.nombre_inmueble,
              huesped_principal: {
                nombre: nombre,
                apellido: apellido,
                email: reservaData.huesped_email,
                telefono: reservaData.huesped_telefono,
              },
              fecha_entrada: reservaData.fecha_entrada,
              fecha_salida: reservaData.fecha_salida,
              numero_huespedes: reservaData.numero_huespedes,
              precio_total: reservaData.precio_total,
              estado: reservaData.estado,
              observaciones: reservaData.observaciones,
            }
          : reserva
      ));
      
      setSuccessMsg('Reserva actualizada exitosamente');
      setSuccessOpen(true);
      setEditModalOpen(false);
      setReservaToEdit(null);
    } catch (e) {
      alert(e || 'Error al actualizar reserva');
    }
  };

  const handleDelete = (reserva: IReservaTableData) => {
    if (!canDelete) return;
    setReservaToDelete(reserva);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!reservaToDelete) return;
    setConfirmDeleteOpen(false);
    
    try {
      // Simular eliminación
      setReservas(prev => prev.filter(reserva => reserva.id !== reservaToDelete.id));
      setSuccessMsg('Reserva eliminada exitosamente');
      setSuccessOpen(true);
    } catch (e) {
      setSuccessMsg('Error eliminando reserva');
      setSuccessOpen(true);
    }
    
    setReservaToDelete(null);
  };

  const handleViewDetail = (reserva: IReservaTableData) => {
    setReservaToView(reserva);
    setDetailModalOpen(true);
  };

  const handleViewHuespedes = (reserva: IReservaTableData) => {
    setReservaToViewHuespedes(reserva);
    setHuespedesModalOpen(true);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Reservas</h2>
        <CreateReservaButton
          onClick={() => canCreate && setModalOpen(true)}
          disabled={!canCreate}
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Cargando reservas...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <ReservasTable 
          reservas={reservas} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          onViewDetail={handleViewDetail}
          onViewHuespedes={handleViewHuespedes}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )}
      
      <CreateReservaModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onCreate={handleCreate} 
      />
      
      <CreateReservaModal 
        open={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setReservaToEdit(null);
        }} 
        onCreate={handleEditSubmit}
        initialData={reservaToEdit ? {
          id_inmueble: reservaToEdit.id_inmueble,
          huesped_nombre: reservaToEdit.huesped_principal.nombre + ' ' + reservaToEdit.huesped_principal.apellido,
          huesped_email: reservaToEdit.huesped_principal.email,
          huesped_telefono: reservaToEdit.huesped_principal.telefono,
          fecha_entrada: reservaToEdit.fecha_entrada,
          fecha_salida: reservaToEdit.fecha_salida,
          numero_huespedes: reservaToEdit.numero_huespedes,
          precio_total: reservaToEdit.precio_total,
          estado: reservaToEdit.estado,
          observaciones: reservaToEdit.observaciones || '',
          id_empresa: reservaToEdit.id_empresa
        } : undefined}
        isEdit={true}
      />

      <ReservaDetailModal
        open={detailModalOpen}
        onClose={() => {
          setDetailModalOpen(false);
          setReservaToView(null);
        }}
        reserva={reservaToView}
      />

      <HuespedesListModal
        open={huespedesModalOpen}
        onClose={() => {
          setHuespedesModalOpen(false);
          setReservaToViewHuespedes(null);
        }}
        huespedes={reservaToViewHuespedes?.huespedes || []}
        codigoReserva={reservaToViewHuespedes?.codigo_reserva || ''}
      />
      
      <ConfirmModal
        open={confirmDeleteOpen}
        message={`¿Estás seguro de que deseas eliminar la reserva "${reservaToDelete?.codigo_reserva || ''}"?`}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setReservaToDelete(null);
        }}
      />
      
      <SuccessModal 
        open={successOpen} 
        message={successMsg} 
        onClose={() => setSuccessOpen(false)} 
      />
    </div>
  );
};

export default Bookings;
