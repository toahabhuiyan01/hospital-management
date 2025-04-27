import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient();

const serviceSchema = z.object({
  name: z.string().min(2, 'Service name must be at least 2 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be a positive number'),
  duration: z.number().int().positive('Duration must be a positive integer'),
  hospitalId: z.string().uuid('Invalid hospital ID format'),
});

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const services = await prisma.service.findMany({
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ message: 'Server error while fetching services' });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    });

    if (service) {
      res.json(service);
    } else {
      res.status(404).json({ message: 'Service not found' });
    }
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ message: 'Server error while fetching service' });
  }
};

export const getServicesByHospital = async (req: Request, res: Response) => {
  try {
    const { hospitalId } = req.params;

    const services = await prisma.service.findMany({
      where: { hospitalId },
    });

    res.json(services);
  } catch (error) {
    console.error('Error fetching hospital services:', error);
    res.status(500).json({ message: 'Server error while fetching hospital services' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const validatedData = serviceSchema.parse(req.body);

    const hospital = await prisma.hospital.findUnique({
      where: { id: validatedData.hospitalId },
    });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    const service = await prisma.service.create({
      data: validatedData,
      include: {
        hospital: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    res.status(201).json(service);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Service creation error:', error);
    res.status(500).json({ message: 'Server error during service creation' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Check if service exists and has any active bookings
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        bookings: {
          where: {
            status: {
              in: ['pending', 'confirmed']
            }
          }
        }
      }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service.bookings.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete service with active bookings',
        activeBookings: service.bookings.length
      });
    }

    await prisma.service.delete({
      where: { id }
    });

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Server error while deleting service' });
  }
};