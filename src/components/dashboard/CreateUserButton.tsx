import React from 'react';

interface CreateUserButtonProps {
  onClick: () => void;
}

const CreateUserButton: React.FC<CreateUserButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-4 py-2 bg-tourism-teal text-white rounded hover:bg-tourism-navy transition-colors font-semibold mb-4"
    title="Crear nuevo usuario"
  >
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
    Crear usuario
  </button>
);

export default CreateUserButton;
