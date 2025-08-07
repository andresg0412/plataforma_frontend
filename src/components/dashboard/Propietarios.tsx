/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import PropietariosTable from './PropietariosTable';
import CreatePropietarioModal from './CreatePropietarioModal';
import CreatePropietarioButton from './CreatePropietarioButton';
import SuccessModal from './SuccessModal';
import ConfirmModal from './ConfirmModal';
import { useAuth } from '../../auth/AuthContext';
import { IPropietarioForm, IPropietarioTableData } from '../../interfaces/Propietario';

// Data simulada para propietarios
const mockPropietarios: IPropietarioTableData[] = [
  {
    id: 1,
    nombre: 'Carlos',
    apellido: 'Rodriguez',
    email: 'carlos.rodriguez@email.com',
    telefono: '+57 300 123 4567',
    direccion: 'Carrera 15 #85-23, Bogotá',
    cedula: '12345678',
    fecha_registro: '2024-01-15',
    estado: 'activo',
    id_empresa: 1,
  },
  {
    id: 2,
    nombre: 'Maria',
    apellido: 'González',
    email: 'maria.gonzalez@email.com',
    telefono: '+57 310 987 6543',
    direccion: 'Calle 72 #11-45, Bogotá',
    cedula: '87654321',
    fecha_registro: '2024-02-10',
    estado: 'activo',
    id_empresa: 1,
  },
  {
    id: 3,
    nombre: 'Luis',
    apellido: 'Martínez',
    email: 'luis.martinez@email.com',
    telefono: '+57 320 456 7890',
    direccion: 'Avenida 68 #45-12, Medellín',
    cedula: '45678912',
    fecha_registro: '2024-01-28',
    estado: 'inactivo',
    id_empresa: 1,
  },
  {
    id: 4,
    nombre: 'Ana',
    apellido: 'López',
    email: 'ana.lopez@email.com',
    telefono: '+57 315 789 0123',
    direccion: 'Carrera 10 #30-55, Cali',
    cedula: '78912345',
    fecha_registro: '2024-03-05',
    estado: 'activo',
    id_empresa: 1,
  },
];

const Propietarios: React.FC = () => {
  const [propietarios, setPropietarios] = useState<IPropietarioTableData[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [propietarioToEdit, setPropietarioToEdit] = useState<IPropietarioTableData | null>(null);
  const [propietarioToDelete, setPropietarioToDelete] = useState<IPropietarioTableData | null>(null);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { user } = useAuth();
  const canCreate = user?.permisos?.includes('crear_propietarios') || true; // TEMPORAL: siempre true para debugging
  const canEdit = user?.permisos?.includes('editar_propietarios') || true; // TEMPORAL: siempre true para debugging
  const canDelete = user?.permisos?.includes('eliminar_propietarios') || true; // TEMPORAL: siempre true para debugging

  console.log('=== PROPIETARIOS DEBUG ===');
  console.log('user:', user);
  console.log('user permisos:', user?.permisos);
  console.log('canCreate:', canCreate);
  console.log('canEdit:', canEdit);
  console.log('canDelete:', canDelete);
  console.log('============================');

  useEffect(() => {
    // Simular carga de datos
    setTimeout(() => {
      setPropietarios(mockPropietarios);
      setLoading(false);
    }, 1000);
  }, []);

  const handleCreate = async (propietarioData: IPropietarioForm) => {
    try {
      // Simular creación
      const newPropietario: IPropietarioTableData = {
        id: Date.now(), // ID temporal
        ...propietarioData,
        fecha_registro: new Date().toISOString().split('T')[0],
      };
      
      setPropietarios(prev => [...prev, newPropietario]);
      setSuccessMsg('Propietario creado exitosamente');
      setSuccessOpen(true);
      setModalOpen(false);
    } catch (e) {
      alert(e || 'Error al crear propietario');
    }
  };

  const handleEdit = (propietario: IPropietarioTableData) => {
    if (!canEdit) return;
    setPropietarioToEdit(propietario);
    setEditModalOpen(true);
  };

  const handleEditSubmit = async (propietarioData: IPropietarioForm) => {
    if (!propietarioToEdit) return;
    
    try {
      // Simular edición
      setPropietarios(prev => prev.map(propietario => 
        propietario.id === propietarioToEdit.id 
          ? { ...propietario, ...propietarioData }
          : propietario
      ));
      
      setSuccessMsg('Propietario actualizado exitosamente');
      setSuccessOpen(true);
      setEditModalOpen(false);
      setPropietarioToEdit(null);
    } catch (e) {
      alert(e || 'Error al actualizar propietario');
    }
  };

  const handleDelete = (propietario: IPropietarioTableData) => {
    if (!canDelete) return;
    setPropietarioToDelete(propietario);
    setConfirmDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!propietarioToDelete) return;
    setConfirmDeleteOpen(false);
    
    try {
      // Simular eliminación
      setPropietarios(prev => prev.filter(propietario => propietario.id !== propietarioToDelete.id));
      setSuccessMsg('Propietario eliminado exitosamente');
      setSuccessOpen(true);
    } catch (e) {
      setSuccessMsg('Error eliminando propietario');
      setSuccessOpen(true);
    }
    
    setPropietarioToDelete(null);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Propietarios</h2>
        <CreatePropietarioButton
          onClick={() => canCreate && setModalOpen(true)}
          disabled={!canCreate}
        />
      </div>
      {loading ? (
        <div className="text-center py-8">Cargando propietarios...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <PropietariosTable 
          propietarios={propietarios} 
          onEdit={handleEdit} 
          onDelete={handleDelete}
          canEdit={canEdit}
          canDelete={canDelete}
        />
      )}
      
      <CreatePropietarioModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
        onCreate={handleCreate} 
      />
      
      <CreatePropietarioModal 
        open={editModalOpen} 
        onClose={() => {
          setEditModalOpen(false);
          setPropietarioToEdit(null);
        }} 
        onCreate={handleEditSubmit}
        initialData={propietarioToEdit ? {
          nombre: propietarioToEdit.nombre,
          apellido: propietarioToEdit.apellido,
          email: propietarioToEdit.email,
          telefono: propietarioToEdit.telefono,
          direccion: propietarioToEdit.direccion,
          cedula: propietarioToEdit.cedula,
          estado: propietarioToEdit.estado,
          id_empresa: propietarioToEdit.id_empresa
        } : undefined}
        isEdit={true}
      />
      
      <ConfirmModal
        open={confirmDeleteOpen}
        message={`¿Estás seguro de que deseas eliminar al propietario "${propietarioToDelete?.nombre || ''} ${propietarioToDelete?.apellido || ''}"?`}
        onConfirm={handleConfirmDelete}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setPropietarioToDelete(null);
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

export default Propietarios;
