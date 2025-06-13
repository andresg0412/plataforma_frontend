import React, { useState } from 'react';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (user: { nombre: string; email: string; rol: string; empresa: string; estado: string }) => void;
}

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState({ nombre: '', email: '', rol: '', empresa: '', estado: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreate(form);
    setForm({ nombre: '', email: '', rol: '', empresa: '', estado: '' });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-bold mb-4">Crear nuevo usuario</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full border rounded px-3 py-2" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="w-full border rounded px-3 py-2" type="email" required />
          <input name="rol" value={form.rol} onChange={handleChange} placeholder="Rol" className="w-full border rounded px-3 py-2" required />
          <input name="empresa" value={form.empresa} onChange={handleChange} placeholder="Empresa" className="w-full border rounded px-3 py-2" required />
          <select name="estado" value={form.estado} onChange={handleChange} className="w-full border rounded px-3 py-2" required>
            <option value="">Selecciona estado</option>
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-tourism-teal text-white rounded hover:bg-tourism-navy">Crear</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
