'use client';
import { useState } from 'react';
import { X, CheckCircle, RefreshCw } from 'lucide-react';
import type { Vehicle } from '../../types/vehicle';
import { vehicleApi } from '../../lib/api';

interface Props {
  vehicle: Vehicle;
  onClose: () => void;
  onUpdated: (v: Vehicle) => void;
}

export default function AcknowledgeModal({ vehicle, onClose, onUpdated }: Props) {
  const [km, setKm] = useState(String(vehicle.currentKilometers));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const newKm = parseFloat(km) || 0;
  const nextService = newKm + vehicle.serviceIntervalKm;

  const handleSubmit = async () => {
    const val = parseFloat(km);
    if (isNaN(val) || val < 0) { setError('Please enter a valid odometer reading after service.'); return; }
    setLoading(true);
    setError('');
    try {
      const updated = await vehicleApi.acknowledgeService(vehicle.id, { newCurrentKilometers: val });
      onUpdated(updated);
    } catch (e: any) {
      setError(e?.response?.data?.error || 'Failed to acknowledge service.');
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
              Oil Change Done! 🎉
            </h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--text-secondary)' }}>{vehicle.vehicleName}</p>
          </div>
          <button className="btn-ghost p-2" onClick={onClose}><X size={18} /></button>
        </div>

        <div
          className="rounded-xl p-4 mb-5 flex items-start gap-3"
          style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}
        >
          <CheckCircle size={18} style={{ color: '#34D399', flexShrink: 0, marginTop: 1 }} />
          <p className="text-sm" style={{ color: '#86EFAC' }}>
            Great job keeping up with maintenance! Enter your odometer reading after the oil change to reset your service interval.
          </p>
        </div>

        <div className="mb-5">
          <label className="block text-sm mb-2 font-medium" style={{ color: 'var(--text-secondary)' }}>
            Odometer Reading After Service (km)
          </label>
          <input
            type="number"
            className="input-field"
            value={km}
            onChange={e => setKm(e.target.value)}
            min={0}
            placeholder="e.g. 16000"
            autoFocus
          />
          {error && <p className="text-xs mt-2" style={{ color: '#F87171' }}>{error}</p>}
        </div>

        {/* Next interval preview */}
        <div
          className="rounded-xl p-4 mb-5 text-sm space-y-2"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <RefreshCw size={13} style={{ color: 'var(--amber)' }} />
            <span className="text-xs font-semibold" style={{ color: 'var(--amber)' }}>New Service Interval</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Post-service odometer</span>
            <span className="font-mono font-semibold">{newKm.toLocaleString()} km</span>
          </div>
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Interval</span>
            <span className="font-mono font-semibold">+ {vehicle.serviceIntervalKm.toLocaleString()} km</span>
          </div>
          <div className="h-px" style={{ background: 'var(--border)' }} />
          <div className="flex justify-between">
            <span style={{ color: 'var(--text-secondary)' }}>Next service due at</span>
            <span className="font-mono font-semibold" style={{ color: 'var(--amber)' }}>
              {nextService.toLocaleString()} km
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-ghost flex-1 justify-center" onClick={onClose}>Cancel</button>
          <button className="btn-primary flex-1 justify-center" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Confirm Service Done'}
          </button>
        </div>
      </div>
    </div>
  );
}
