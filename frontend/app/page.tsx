'use client';
import { useState, useEffect, useCallback } from 'react';
import { Plus, Gauge, Bell, CheckCircle, Search, RefreshCw, Wrench } from 'lucide-react';
import type { Vehicle } from '../types/vehicle';
import { vehicleApi } from '../lib/api';
import VehicleCard from './components/VehicleCard';
import AddVehicleModal from './components/AddVehicleModal';

export default function HomePage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchVehicles = useCallback(async (quiet = false) => {
    if (!quiet) setLoading(true);
    else setRefreshing(true);
    setError('');
    try {
      const data = await vehicleApi.getAll();
      setVehicles(data);
    } catch {
      setError('Could not connect to the server. Please ensure the backend is running.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchVehicles(); }, [fetchVehicles]);

  const filtered = vehicles.filter(v =>
    search === '' ||
    v.vehicleName.toLowerCase().includes(search.toLowerCase()) ||
    v.ownerName.toLowerCase().includes(search.toLowerCase()) ||
    v.ownerEmail.toLowerCase().includes(search.toLowerCase())
  );

  const dueCount = vehicles.filter(v => v.isDueForService).length;
  const notifiedCount = vehicles.filter(v => v.notificationStatus === 'NOTIFIED').length;
  const totalKm = vehicles.reduce((s, v) => s + v.currentKilometers, 0);

  const handleUpdated = (updated: Vehicle) => {
    setVehicles(vs => vs.map(v => v.id === updated.id ? updated : v));
  };

  const handleDeleted = (id: number) => {
    setVehicles(vs => vs.filter(v => v.id !== id));
  };

  const handleCreated = (v: Vehicle) => {
    setVehicles(vs => [v, ...vs]);
    setShowAdd(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--dark)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-4"
        style={{
          background: 'rgba(26,26,46,0.85)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(245,166,35,0.15)', border: '1px solid rgba(245,166,35,0.3)' }}
            >
              <Wrench size={18} style={{ color: 'var(--amber)' }} />
            </div>
            <div>
              <h1
                className="text-lg leading-none"
                style={{ fontFamily: 'var(--font-display)', fontWeight: 800, letterSpacing: '-0.3px' }}
              >
                Oil<span style={{ color: 'var(--amber)' }}>Track</span>
              </h1>
              <p className="text-xs leading-none mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                Service Interval Manager
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="btn-ghost p-2.5"
              onClick={() => fetchVehicles(true)}
              disabled={refreshing}
              title="Refresh"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
            </button>
            <button className="btn-primary py-2.5 px-4 text-sm" onClick={() => setShowAdd(true)}>
              <Plus size={16} />
              <span className="hidden sm:inline">Add Vehicle</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* Stats row */}
        {vehicles.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
            {[
              {
                label: 'Total Vehicles',
                value: vehicles.length,
                icon: <Gauge size={16} />,
                color: 'var(--amber)',
              },
              {
                label: 'Due for Service',
                value: dueCount,
                icon: <Bell size={16} />,
                color: dueCount > 0 ? '#F87171' : '#34D399',
              },
              {
                label: 'Reminders Sent',
                value: notifiedCount,
                icon: <CheckCircle size={16} />,
                color: '#FBBF24',
              },
              {
                label: 'Total Km Tracked',
                value: totalKm > 1000 ? `${(totalKm / 1000).toFixed(1)}k` : totalKm,
                icon: <Wrench size={16} />,
                color: '#818CF8',
              },
            ].map(stat => (
              <div key={stat.label} className="glass-card px-4 py-3 flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `${stat.color}18`, color: stat.color }}
                >
                  {stat.icon}
                </div>
                <div>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{stat.label}</p>
                  <p className="font-display font-bold text-lg leading-tight" style={{ fontFamily: 'var(--font-display)', color: stat.color }}>
                    {stat.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Search */}
        {vehicles.length > 0 && (
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
            <input
              type="text"
              className="input-field pl-10"
              placeholder="Search vehicles, owners, emails…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        )}

        {/* Alert banner for due vehicles */}
        {dueCount > 0 && (
          <div
            className="rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in"
            style={{
              background: 'rgba(248,113,113,0.1)',
              border: '1px solid rgba(248,113,113,0.25)',
              animation: 'pulse-ring 2s ease-in-out infinite',
            }}
          >
            <Bell size={18} style={{ color: '#F87171', flexShrink: 0 }} className="animate-pulse" />
            <p className="text-sm" style={{ color: '#FCA5A5' }}>
              <strong>{dueCount} vehicle{dueCount > 1 ? 's' : ''}</strong> {dueCount > 1 ? 'are' : 'is'} due for an oil change.
              Email reminders have been sent automatically.
            </p>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div
              className="w-12 h-12 rounded-full border-2 animate-spin"
              style={{ borderColor: 'var(--surface-2)', borderTopColor: 'var(--amber)' }}
            />
            <p style={{ color: 'var(--text-secondary)' }}>Loading vehicles…</p>
          </div>
        ) : error ? (
          <div
            className="rounded-xl p-6 text-center"
            style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)' }}
          >
            <p style={{ color: '#F87171' }}>{error}</p>
            <button className="btn-ghost mt-4 mx-auto" onClick={() => fetchVehicles()}>
              <RefreshCw size={14} /> Try Again
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}
            >
              <Gauge size={36} style={{ color: 'var(--amber)', opacity: 0.7 }} />
            </div>
            {search ? (
              <>
                <p className="text-lg font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
                  No results for "{search}"
                </p>
                <button className="btn-ghost" onClick={() => setSearch('')}>Clear search</button>
              </>
            ) : (
              <>
                <p className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
                  No vehicles yet
                </p>
                <p className="text-sm max-w-xs" style={{ color: 'var(--text-secondary)' }}>
                  Register your first vehicle to start tracking oil change intervals and receive email reminders.
                </p>
                <button className="btn-primary mt-2" onClick={() => setShowAdd(true)}>
                  <Plus size={16} /> Register Your First Vehicle
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((vehicle, i) => (
              <div
                key={vehicle.id}
                style={{ animationDelay: `${i * 60}ms`, opacity: 0, animation: `slideUp 0.4s ease ${i * 60}ms forwards` }}
              >
                <VehicleCard
                  vehicle={vehicle}
                  onUpdated={handleUpdated}
                  onDeleted={handleDeleted}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="text-center py-8 mt-8" style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
        OilTrack — Built with Spring Boot + Next.js
      </footer>

      {showAdd && (
        <AddVehicleModal
          onClose={() => setShowAdd(false)}
          onCreated={handleCreated}
        />
      )}
    </div>
  );
}
