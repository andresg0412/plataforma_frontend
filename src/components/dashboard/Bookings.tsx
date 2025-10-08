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
import { 
  getReservasApi, 
  createReservaApi, 
  editReservaApi, 
  deleteReservaApi 
} from '../../auth/reservasApi';

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

  /**
   * Carga las reservas desde la API
   */
  const loadReservas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getReservasApi();
      setReservas(data);
    } catch (error) {
      console.error('Error cargando reservas:', error);
      setError('Error al cargar las reservas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservas();
  }, []);

  const handleCreate = async (reservaData: IReservaForm) => {
    try {
      const newReserva = await createReservaApi(reservaData);
      setReservas(prev => [...prev, newReserva]);
      setSuccessMsg('Reserva creada exitosamente');
      setSuccessOpen(true);
      setModalOpen(false);
    } catch (error) {
      console.error('Error creando reserva:', error);
      alert(error instanceof Error ? error.message : 'Error al crear reserva');
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
      const updatedReserva = await editReservaApi({
        ...reservaData,
        id: reservaToEdit.id,
        codigo_reserva: reservaToEdit.codigo_reserva,
        fecha_creacion: reservaToEdit.fecha_creacion,
        huespedes: reservaToEdit.huespedes
      });
      
      setReservas(prev => prev.map(reserva => 
        reserva.id === reservaToEdit.id ? updatedReserva : reserva
      ));
      
      setSuccessMsg('Reserva actualizada exitosamente');
      setSuccessOpen(true);
      setEditModalOpen(false);
      setReservaToEdit(null);
    } catch (error) {
      console.error('Error editando reserva:', error);
      alert(error instanceof Error ? error.message : 'Error al actualizar reserva');
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
      await deleteReservaApi(reservaToDelete.id);
      setReservas(prev => prev.filter(reserva => reserva.id !== reservaToDelete.id));
      setSuccessMsg('Reserva eliminada exitosamente');
      setSuccessOpen(true);
    } catch (error) {
      console.error('Error eliminando reserva:', error);
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
        <div className="text-red-500 text-center py-8">
          {error}
          <button 
            onClick={loadReservas}
            className="ml-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
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
          fecha_entrada: reservaToEdit.fecha_entrada,
          fecha_salida: reservaToEdit.fecha_salida,
          numero_huespedes: reservaToEdit.numero_huespedes,
          huespedes: reservaToEdit.huespedes.map(huesped => ({
            nombre: huesped.nombre,
            apellido: huesped.apellido,
            email: huesped.email,
            telefono: huesped.telefono,
            documento_tipo: huesped.documento_tipo,
            documento_numero: huesped.documento_numero,
            fecha_nacimiento: huesped.fecha_nacimiento,
            es_principal: huesped.es_principal,
          })),
          precio_total: reservaToEdit.precio_total,
          total_reserva: reservaToEdit.total_reserva || reservaToEdit.precio_total,
          total_pagado: reservaToEdit.total_pagado || 0,
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
