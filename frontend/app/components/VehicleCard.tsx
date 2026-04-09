'use client';
import { useState } from 'react';
import { Gauge, Wrench, Bell, BellOff, Pencil, Trash2, CheckCircle, ChevronRight } from 'lucide-react';
import type { Vehicle } from '../../types/vehicle';
import { vehicleApi } from '../../lib/api';
import UpdateKmModal from './UpdateKmModal';
import AcknowledgeModal from './AcknowledgeModal';
import EditVehicleModal from './EditVehicleModal';

interface Props {
  vehicle: Vehicle;
  onUpdated: (v: Vehicle) => void;
  onDeleted: (id: number) => void;
}

export default function VehicleCard({ vehicle, onUpdated, onDeleted }: Props) {
  const [showUpdateKm, setShowUpdateKm] = useState(false);
  const [showAck, setShowAck] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const progressPct = Math.min(
    100,
    ((vehicle.currentKilometers - (vehicle.nextServiceKilometers - vehicle.serviceIntervalKm)) /
      vehicle.serviceIntervalKm) * 100
  );

  const isDue = vehicle.isDueForService;
  const isNotified = vehicle.notificationStatus === 'NOTIFIED';
  const isNearDue = !isDue && vehicle.kmUntilService <= 300;

  const progressColor = isDue
    ? '#F87171'
    : isNearDue
    ? '#FBBF24'
    : '#34D399';

  const handleDelete = async () => {
    if (!confirm(`Delete "${vehicle.vehicleName}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await vehicleApi.delete(vehicle.id);
      onDeleted(vehicle.id);
    } catch {
      alert('Failed to delete vehicle.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div
        className="glass-card p-5 flex flex-col gap-4 hover:border-white/[0.14] transition-all duration-300"
        style={{
          borderColor: isDue ? 'rgba(248,113,113,0.3)' : isNearDue ? 'rgba(251,191,36,0.25)' : undefined,
          boxShadow: isDue ? '0 0 0 1px rgba(248,113,113,0.15), 0 8px 32px rgba(248,113,113,0.08)' : undefined,
          animation: 'slideUp 0.4s ease forwards',
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: isDue ? 'rgba(248,113,113,0.15)' : 'rgba(245,166,35,0.12)' }}
            >
              <Gauge size={20} color={isDue ? '#F87171' : '#F5A623'} />
            </div>
            <div className="min-w-0">
              <h3
                className="font-display font-700 text-base truncate"
                style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}
              >
                {vehicle.vehicleName}
              </h3>
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                {vehicle.ownerName} · {vehicle.ownerEmail}
              </p>
            </div>
          </div>

          {/* Status badge */}
          <div className="flex-shrink-0">
            {isDue ? (
              <span className="badge badge-red">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse inline-block" />
                Service Due
              </span>
            ) : isNearDue ? (
              <span className="badge badge-yellow">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 inline-block" />
                Due Soon
              </span>
            ) : (
              <span className="badge badge-green">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                OK
              </span>
            )}
          </div>
        </div>

        {/* KM stats */}
        <div className="grid grid-cols-2 gap-3">
          <div
            className="rounded-xl p-3"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
              Current Odometer
            </p>
            <p className="font-mono text-lg font-semibold">
              {vehicle.currentKilometers.toLocaleString()}
              <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>km</span>
            </p>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: isDue ? 'rgba(248,113,113,0.08)' : 'rgba(255,255,255,0.04)' }}
          >
            <p className="text-xs mb-1" style={{ color: 'var(--text-secondary)' }}>
              Next Service At
            </p>
            <p
              className="font-mono text-lg font-semibold"
              style={{ color: isDue ? '#F87171' : 'var(--text-primary)' }}
            >
              {vehicle.nextServiceKilometers.toLocaleString()}
              <span className="text-xs font-normal ml-1" style={{ color: 'var(--text-secondary)' }}>km</span>
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Service Progress
            </span>
            <span className="text-xs font-mono" style={{ color: isDue ? '#F87171' : isNearDue ? '#FBBF24' : 'var(--text-secondary)' }}>
              {isDue
                ? `${Math.abs(vehicle.kmUntilService).toLocaleString()} km overdue`
                : `${vehicle.kmUntilService.toLocaleString()} km remaining`}
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.max(2, progressPct)}%`, background: progressColor }}
            />
          </div>
        </div>

        {/* Notification status */}
        {isNotified && (
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs"
            style={{ background: 'rgba(251,191,36,0.08)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.2)' }}
          >
            <Bell size={13} />
            Email reminder sent to {vehicle.ownerEmail}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-wrap gap-2 pt-1">
          {isDue || isNotified ? (
            <button
              className="btn-primary text-sm py-2 px-4 flex-1 justify-center"
              onClick={() => setShowAck(true)}
            >
              <CheckCircle size={15} />
              Mark Service Done
            </button>
          ) : (
            <button
              className="btn-primary text-sm py-2 px-4 flex-1 justify-center"
              onClick={() => setShowUpdateKm(true)}
            >
              <Gauge size={15} />
              Update Odometer
            </button>
          )}
          <button className="btn-ghost text-sm py-2 px-3" onClick={() => setShowEdit(true)}>
            <Pencil size={14} />
          </button>
          <button className="btn-danger text-sm py-2 px-3" onClick={handleDelete} disabled={deleting}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {showUpdateKm && (
        <UpdateKmModal
          vehicle={vehicle}
          onClose={() => setShowUpdateKm(false)}
          onUpdated={(v) => { onUpdated(v); setShowUpdateKm(false); }}
        />
      )}
      {showAck && (
        <AcknowledgeModal
          vehicle={vehicle}
          onClose={() => setShowAck(false)}
          onUpdated={(v) => { onUpdated(v); setShowAck(false); }}
        />
      )}
      {showEdit && (
        <EditVehicleModal
          vehicle={vehicle}
          onClose={() => setShowEdit(false)}
          onUpdated={(v) => { onUpdated(v); setShowEdit(false); }}
        />
      )}
    </>
  );
}
