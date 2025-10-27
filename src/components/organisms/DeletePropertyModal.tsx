import React, { useState } from 'react';
import { Button } from '../atoms/Button';

interface DeletePropertyModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  propertyName: string;
}

export const DeletePropertyModal: React.FC<DeletePropertyModalProps> = ({ 
  open, 
  onClose, 
  onConfirm, 
  propertyName 
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const handleConfirm = async () => {
    setError(null);
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
        <button 
          className="absolute top-2 right-3 text-gray-500" 
          onClick={onClose}
          disabled={loading}
        >
          &times;
        </button>
        
        <h3 className="text-lg font-bold mb-4 text-center">Eliminar Propiedad</h3>
        
        <div className="mb-4">
          <p className="text-gray-700 text-center">
            ¿Estás seguro de que deseas eliminar la propiedad:
          </p>
          <p className="font-bold text-center mt-2">&ldquo;{propertyName}&rdquo;</p>
          <p className="text-sm text-gray-500 text-center mt-2">
            Esta acción no se puede deshacer.
          </p>
        </div>

        {error && (
          <div className="text-red-500 text-sm text-center mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-2 mt-4">
          <Button 
            type="button" 
            variant="secondary" 
            className="flex-1 !bg-[var(--gray-400)] !text-white" 
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button 
            type="button" 
            variant="destructive"
            className="flex-1" 
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </div>
      </div>
    </div>
  );
};