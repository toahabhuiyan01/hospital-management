export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AuthState {
  userToken: string | null;
  isLoading: boolean;
  user?: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name?: string;
}

export interface AuthResponse {
  id: string;
  email: string;
  name?: string;
  token: string;
}

export interface Hospital {
  id: string;
  name: string;
  address: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  services?: Service[];
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number;
  hospitalId: string;
  createdAt?: Date;
  updatedAt?: Date;
  hospital?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface Booking {
  id: string;
  userId: string;
  serviceId: string;
  date: Date | string;
  status: BookingStatus;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
  service?: {
    name: string;
    price: number;
    duration: number;
    hospital?: {
      name: string;
      address: string;
    };
  };
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';

export interface BookingRequest {
  serviceId: string;
  date: string;
  notes?: string;
}

export interface BookingStatusUpdate {
  status: BookingStatus;
}

export interface ApiError {
  message: string;
}

export interface NavigationParams {
  hospitalId?: string;
  serviceId?: string;
  serviceName?: string;
  hospitalName?: string;
  bookingId?: string;
}