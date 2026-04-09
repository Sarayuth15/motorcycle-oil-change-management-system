'use client';
import { useState } from 'react';
import { X, Gauge } from 'lucide-react';
import type { Vehicle } from '../../types/vehicle';
import { vehicleApi } from '../../lib/api';

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdated: (v: Vehicle) => void;
}

export default function UpdateKmModal({ vehicle, onClose, onUpdated }: Props) {
  const [km, setKm] = useState(String(vehicle.currentKilometers));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const newKm = parseFloat(km) || 0;
  const newNext = newKm < vehicle.nextServiceKilometers - vehicle.serviceIntervalKm
    ? newKm + vehicle.serviceIntervalKm
    : vehicle.nextServiceKilometers;

  const handleSubmit = async () => {
    const val = parseFloat(km);
    if (isNaN(val) || val < 0) { setError('Please enter a valid kilometer value.'); return; }
    if (val < vehicle.currentKilometers) {
      setError('New odometer reading cannot be less than the current value.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const updated = await vehicleApi.updateKilometers(vehicle.id, { currentKilometers: val });
      onUpdated(updated);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to update odometer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-display text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
              Update Odometer
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{vehicle.vehicleName}</p>
          </div>
          <button className="btn-ghost p-2" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
            Current Odometer Reading (km)
          </label>
          <div className="relative">
            <Gauge size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="number"
              className="input-field"
              style={{ paddingLeft: '2.25rem' }}
              value={km}
              onChange={e => setKm(e.target.value)}
              min={vehicle.currentKilometers}
              placeholder="e.g. 13500"
              autoFocus
            />
          </div>
          {error && <p className="text-xs mt-2" style={{ color: '#F87171' }}>{error}</p>}
        </div>

        {/* Preview calculation */}
        <div
          className="rounded-xl p-4 mb-5 text-sm space-y-2"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
        >
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>New odometer</span>
            <span className="font-mono font-semibold">{newKm.toLocaleString()} km</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Next service at</span>
            <span className="font-mono font-semibold" style={{ color: 'var(--amber)' }}>
              {vehicle.nextServiceKilometers.toLocaleString()} km
            </span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Remaining</span>
            <span
              className="font-mono font-semibold"
              style={{ color: newKm >= vehicle.nextServiceKilometers ? '#F87171' : '#34D399' }}
            >
              {newKm >= vehicle.nextServiceKilometers
                ? `${(newKm - vehicle.nextServiceKilometers).toLocaleString()} km overdue`
                : `${(vehicle.nextServiceKilometers - newKm).toLocaleString()} km`
              }
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Cancel</button>
          <button className="btn-primary flex-1 justify-center" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
