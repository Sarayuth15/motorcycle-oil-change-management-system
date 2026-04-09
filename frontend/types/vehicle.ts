export type NotificationStatus = 'PENDING' | 'NOTIFIED' | 'ACKNOWLEDGED';

export interface Vehicle {
  id: number;
  ownerName: string;
  ownerEmail: string;
  vehicleName: string;
  currentKilometers: number;
  nextServiceKilometers: number;
  serviceIntervalKm: number;
  kmUntilService: number;
  isDueForService: boolean;
  notificationStatus: NotificationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleRequest {
  ownerName: string;
  ownerEmail: string;
  vehicleName: string;
  currentKilometers: number;
}

export interface UpdateKilometersRequest {
  currentKilometers: number;
}

export interface UpdateVehicleRequest {
  vehicleName?: string;
  currentKilometers?: number;
}

export interface AcknowledgeServiceRequest {
  newCurrentKilometers: number;
}
