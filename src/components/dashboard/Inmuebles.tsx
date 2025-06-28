/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from 'react';
import InmueblesTable, { IDataInmuebleIn as TableInmueble } from './InmueblesTable';
import ConfirmModal from './ConfirmModal';
import SuccessModal from './SuccessModal';
import { getInmueblesApi } from '../../auth/getInmueblesApi';
import { useAuth } from '../../auth/AuthContext';

const Inmuebles: React.FC = () => {
  const [inmuebles, setInmuebles] = useState<TableInmueble[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorDeleteMsg, setErrorDeleteMsg] = useState('');
  const [inmuebleToDelete, setInmuebleToDelete] = useState<TableInmueble | null>(null);
  const [editSuccessOpen, setEditSuccessOpen] = useState(false);
  const [editMsg, setEditMsg] = useState('');
  const { user } = useAuth();
  const canCreate = user?.permisos?.includes('crear_inmuebles');

  useEffect(() => {
    getInmueblesApi()
      .then(setInmuebles)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleEdit = (inmueble: TableInmueble) => {
    // TODO: Implementar edición de inmuebles
    setEditMsg('Funcionalidad de edición próximamente');
    setEditSuccessOpen(true);
  };

  const handleDelete = (inmueble: TableInmueble) => {
    setInmuebleToDelete(inmueble);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    setConfirmOpen(false);
    if (!inmuebleToDelete) return;
    
    // TODO: Implementar eliminación de inmuebles
    try {
      setSuccessMsg('Funcionalidad de eliminación próximamente');
      setSuccessOpen(true);
      setInmuebleToDelete(null);
    } catch (e) {
      setErrorDeleteMsg('Error eliminando inmueble');
      setSuccessOpen(true);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Gestión de Inmuebles</h2>
        {/* TODO: Agregar botón de crear inmueble cuando se implemente */}
      </div>
      {loading ? (
        <div className="text-center py-8">Cargando inmuebles...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : (
        <InmueblesTable inmuebles={inmuebles} onEdit={handleEdit} onDelete={handleDelete} />
      )}
      <ConfirmModal
        open={confirmOpen}
        message={`¿Estás seguro de que deseas eliminar el inmueble ${inmuebleToDelete?.nombre || ''}?`}
        onConfirm={handleConfirmDelete}
        onClose={() => setConfirmOpen(false)}
      />
      <SuccessModal 
        open={successOpen} 
        message={errorDeleteMsg ? errorDeleteMsg : successMsg} 
        onClose={() => { setSuccessOpen(false); setErrorDeleteMsg(''); }} 
      />
      <SuccessModal 
        open={editSuccessOpen} 
        message={editMsg} 
        onClose={() => setEditSuccessOpen(false)} 
      />
    </div>
  );
};

export default Inmuebles;