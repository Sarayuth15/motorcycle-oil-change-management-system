'use client';
import { useState } from 'react';
import { X, Car, User, Mail, Gauge, Info } from 'lucide-react';
import type { Vehicle } from '../../types/vehicle';
import { vehicleApi } from '../../lib/api';

interface Props {
  onClose: () => void;
  onCreated: (v: Vehicle) => void;
}

export default function AddVehicleModal({ onClose, onCreated }: Props) {
  const [form, setForm] = useState({
    ownerName: '',
    ownerEmail: '',
    vehicleName: '',
    currentKilometers: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const SERVICE_INTERVAL = 2500;
  const currentKm = parseFloat(form.currentKilometers) || 0;
  const nextService = currentKm + SERVICE_INTERVAL;

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.ownerName.trim()) e.ownerName = 'Name is required';
    if (!form.ownerEmail.trim()) e.ownerEmail = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.ownerEmail)) e.ownerEmail = 'Invalid email format';
    if (!form.vehicleName.trim()) e.vehicleName = 'Vehicle name is required';
    const km = parseFloat(form.currentKilometers);
    if (isNaN(km) || km < 0) e.currentKilometers = 'Enter a valid odometer reading';
    return e;
  };

  const handleSubmit = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    setLoading(true);
    try {
      const created = await vehicleApi.create({
        ownerName: form.ownerName.trim(),
        ownerEmail: form.ownerEmail.trim(),
        vehicleName: form.vehicleName.trim(),
        currentKilometers: parseFloat(form.currentKilometers),
      });
      onCreated(created);
    } catch (err: any) {
      const apiErrors = err?.response?.data?.errors;
      if (apiErrors) setErrors(apiErrors);
      else setErrors({ general: err?.response?.data?.error || 'Failed to register vehicle.' });
    } finally {
      setLoading(false);
    }
  };

  const field = (
    key: keyof typeof form,
    label: string,
    placeholder: string,
    icon: React.ReactNode,
    type = 'text'
  ) => (
    <div>
      <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }}>
          {icon}
        </span>
        <input
          type={type}
          className="input-field"
          style={{ paddingLeft: '2.25rem' }}
          value={form[key]}
          onChange={e => { setForm(f => ({ ...f, [key]: e.target.value })); setErrors(er => ({ ...er, [key]: '' })); }}
          placeholder={placeholder}
        />
      </div>
      {errors[key] && <p className="text-xs mt-1.5" style={{ color: '#F87171' }}>{errors[key]}</p>}
    </div>
  );

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-card w-full"
        style={{ maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Register Vehicle
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Track your service intervals
            </p>
          </div>
          <button className="btn-ghost p-2" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {field('ownerName', 'Your Name', 'e.g. John Doe', <User size={15} />)}
          {field('ownerEmail', 'Email Address', 'e.g. john@example.com', <Mail size={15} />, 'email')}
          {field('vehicleName', 'Vehicle Name / Model', 'e.g. Honda Scoopy', <Car size={15} />)}
          {field('currentKilometers', 'Current Odometer (km)', 'e.g. 13500', <Gauge size={15} />, 'number')}
        </div>

        {/* Calculation preview */}
        {form.currentKilometers && !isNaN(currentKm) && (
          <div
            className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: 'rgba(245,166,35,0.07)', border: '1px solid rgba(245,166,35,0.2)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Info size={13} style={{ color: 'var(--amber)' }} />
              <span className="text-xs font-semibold" style={{ color: 'var(--amber)' }}>
                Service Interval Preview
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: 'var(--text-secondary)' }}>Current odometer</span>
              <span className="font-mono">{currentKm.toLocaleString()} km</span>
            </div>
            <div className="flex justify-between mt-1">
              <span style={{ color: 'var(--text-secondary)' }}>+ Service interval</span>
              <span className="font-mono">+ {SERVICE_INTERVAL.toLocaleString()} km</span>
            </div>
            <div className="h-px mt-2 mb-2" style={{ background: 'rgba(245,166,35,0.2)' }} />
            <div className="flex justify-between font-semibold">
              <span style={{ color: 'var(--amber)' }}>Next service due at</span>
              <span className="font-mono" style={{ color: 'var(--amber)' }}>
                {nextService.toLocaleString()} km
              </span>
            </div>
          </div>
        )}

        {errors.general && (
          <p className="mt-3 text-sm" style={{ color: '#F87171' }}>{errors.general}</p>
        )}

        {/* Info note */}
        <p className="mt-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
          📧 A confirmation email will be sent to the address above. You'll also receive a reminder when service is due.
        </p>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Cancel</button>
          <button className="btn-primary flex-1 justify-center" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Registering...' : 'Register Vehicle'}
          </button>
        </div>
      </div>
    </div>
  );
}
