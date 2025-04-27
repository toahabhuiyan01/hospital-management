import { User, Hospital, Service, Booking } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
    name?: string;
  };
}

export type UserType = User;
export type HospitalType = Hospital;
export type ServiceType = Service;
export type BookingType = Booking;

export interface UserResponse {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse extends UserResponse {
  token: string;
}

export interface HospitalResponse extends HospitalType {
  services?: ServiceResponse[];
}

export interface ServiceResponse extends Omit<ServiceType, 'hospitalId'> {
  hospital?: {
    id: string;
    name: string;
    address: string;
  };
}

export interface BookingResponse extends Omit<BookingType, 'userId' | 'serviceId'> {
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

export interface RegisterRequestBody {
  email: string;
  password: string;
  name?: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface BookingRequestBody {
  serviceId: string;
  date: string;
  notes?: string;
}

export interface BookingStatusUpdateBody {
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface ServiceRequestBody {
  name: string;
  description?: string;
  price: number;
  duration: number;
  hospitalId: string;
}

export interface HospitalRequestBody {
  name: string;
  address: string;
  description?: string;
}