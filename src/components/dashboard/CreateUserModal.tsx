import React, { useState } from 'react';
import { companies, roles } from '../../lib/companiesAndRoles';

interface CreateUserModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (user: { nombre: string; cedula: string; email: string; username: string; empresa: string; rol: string; estado?: string }) => Promise<void>;
}

const initialForm = { nombre: '', cedula: '', email: '', username: '', empresa: '', rol: '', estado: 'activo' };

const CreateUserModal: React.FC<CreateUserModalProps> = ({ open, onClose, onCreate }) => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const newErrors: { [k: string]: string } = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!form.cedula.trim()) newErrors.cedula = 'La cédula es obligatoria';
    if (!form.email.trim()) newErrors.email = 'El correo es obligatorio';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) newErrors.email = 'Correo inválido';
    if (!form.username.trim()) newErrors.username = 'El username es obligatorio';
    if (!form.empresa) newErrors.empresa = 'Selecciona una empresa';
    if (!form.rol) newErrors.rol = 'Selecciona un rol';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validate();
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSubmitting(true);
    await onCreate({ ...form, estado: form.estado || 'activo' });
    setSubmitting(false);
    setForm(initialForm);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button className="absolute top-2 right-3 text-gray-500 text-xl" onClick={onClose}>&times;</button>
        <h3 className="text-lg font-bold mb-4">Crear nuevo usuario</h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" className="w-full border rounded px-3 py-2" />
            {errors.nombre && <div className="text-red-500 text-xs mt-1">{errors.nombre}</div>}
          </div>
          <div>
            <input name="cedula" value={form.cedula} onChange={handleChange} placeholder="Cédula" className="w-full border rounded px-3 py-2" />
            {errors.cedula && <div className="text-red-500 text-xs mt-1">{errors.cedula}</div>}
          </div>
          <div>
            <input name="email" value={form.email} onChange={handleChange} placeholder="Correo electrónico" className="w-full border rounded px-3 py-2" type="email" />
            {errors.email && <div className="text-red-500 text-xs mt-1">{errors.email}</div>}
          </div>
          <div>
            <input name="username" value={form.username} onChange={handleChange} placeholder="Username" className="w-full border rounded px-3 py-2" />
            {errors.username && <div className="text-red-500 text-xs mt-1">{errors.username}</div>}
          </div>
          <div>
            <select name="empresa" value={form.empresa} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">Selecciona empresa</option>
              {companies.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {errors.empresa && <div className="text-red-500 text-xs mt-1">{errors.empresa}</div>}
          </div>
          <div>
            <select name="rol" value={form.rol} onChange={handleChange} className="w-full border rounded px-3 py-2">
              <option value="">Selecciona rol</option>
              {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
            </select>
            {errors.rol && <div className="text-red-500 text-xs mt-1">{errors.rol}</div>}
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancelar</button>
            <button type="submit" className="px-4 py-2 bg-tourism-teal text-white rounded hover:bg-tourism-navy" disabled={submitting}>{submitting ? 'Creando...' : 'Crear'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUserModal;
