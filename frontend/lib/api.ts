import axios from 'axios';
import type {
  Vehicle,
  CreateVehicleRequest,
  UpdateKilometersRequest,
  UpdateVehicleRequest,
  AcknowledgeServiceRequest,
} from '../types/vehicle';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

export const vehicleApi = {
  getAll: () => api.get<Vehicle[]>('/api/vehicles').then(r => r.data),
  getById: (id: number) => api.get<Vehicle>(`/api/vehicles/${id}`).then(r => r.data),
  getByEmail: (email: string) => api.get<Vehicle[]>(`/api/vehicles/by-email?email=${encodeURIComponent(email)}`).then(r => r.data),
  create: (data: CreateVehicleRequest) => api.post<Vehicle>('/api/vehicles', data).then(r => r.data),
  updateKilometers: (id: number, data: UpdateKilometersRequest) => api.patch<Vehicle>(`/api/vehicles/${id}/kilometers`, data).then(r => r.data),
  update: (id: number, data: UpdateVehicleRequest) => api.put<Vehicle>(`/api/vehicles/${id}`, data).then(r => r.data),
  acknowledgeService: (id: number, data: AcknowledgeServiceRequest) => api.post<Vehicle>(`/api/vehicles/${id}/acknowledge-service`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/api/vehicles/${id}`).then(r => r.data),
};

export default api;
