import React, { useState } from 'react';
import { Button } from '../atoms/Button';
import { PropertyModal } from '../organisms/PropertyModal';

const Properties: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSuccessMessage(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    setIsModalOpen(false);
    setSuccessMessage('Inmueble creado exitosamente');
    // Clear success message after 3 seconds
    setTimeout(() => setSuccessMessage(null), 3000);
    // Here you would typically reload the properties list
    // For now, we'll just show the success message
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Propiedades</h2>
        <Button 
          onClick={handleOpenModal}
          className="!bg-tourism-teal !text-white hover:!bg-tourism-teal/90"
        >
          Nuevo Inmueble
        </Button>
      </div>
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <p>Listado y gestión de propiedades.</p>
      
      <PropertyModal 
        open={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default Properties;
