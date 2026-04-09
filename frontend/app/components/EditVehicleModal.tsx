'use client';
import { useState } from 'react';
import { X, Car } from 'lucide-react';
import type { Vehicle } from '../../types/vehicle';
import { vehicleApi } from '../../lib/api';

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdated: (v: Vehicle) => void;
}

export default function EditVehicleModal({ vehicle, onClose, onUpdated }: Props) {
  const [vehicleName, setVehicleName] = useState(vehicle.vehicleName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!vehicleName.trim()) { setError('Vehicle name is required.'); return; }
    setLoading(true);
    setError('');
    try {
      const updated = await vehicleApi.update(vehicle.id, { vehicleName: vehicleName.trim() });
      onUpdated(updated);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to update vehicle.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
            Edit Vehicle
          </h2>
          <button className="btn-ghost p-2" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
            Vehicle Name / Model
          </label>
          <div className="relative">
            <Car size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="input-field"
              style={{ paddingLeft: '2.25rem' }}
              value={vehicleName}
              onChange={e => setVehicleName(e.target.value)}
              placeholder="e.g. Honda Scoopy"
              autoFocus
            />
          </div>
          {error && <p className="text-xs mt-2" style={{ color: '#F87171' }}>{error}</p>}
        </div>

        <div className="flex gap-3">
          <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Cancel</button>
          <button className="btn-primary flex-1 justify-center" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
