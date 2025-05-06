import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const prisma = new PrismaClient({ log: ['query', "info"] });

const bookingSchema = z.object({
  serviceId: z.string().uuid('Invalid service ID format'),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
});

export const createBooking = async (req: Request, res: Response) => {
  try {
    const validatedData = bookingSchema.parse(req.body);
    
    const service = await prisma.service.findUnique({
      where: { id: validatedData.serviceId },
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: req.user.id,
        serviceId: validatedData.serviceId,
        date: new Date(validatedData.date),
        status: 'pending',
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            duration: true,
            hospital: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error('Booking creation error:', error);
    res.status(500).json({ message: 'Server error during booking creation' });
  }
};

export const getUserBookings = async (req: Request, res: Response) => {
  try {
    const { ids } = req.query;
    
    const whereClause: any = { userId: req.user.id };
    
    if (ids) {
      const bookingIds = Array.isArray(ids) ? ids : [ids];
      whereClause.id = { in: bookingIds };
    }
    
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        service: {
          select: {
            name: true,
            price: true,
            duration: true,
            hospital: {
              select: {
                name: true,
                address: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
};

export const updateBookingStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id, userId: req.user.id },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const updatedBooking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: {
        service: {
          select: {
            name: true,
            hospital: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    res.json(updatedBooking);
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ message: 'Server error while updating booking status' });
  }
};

export const getBookingByHospital = async (req: Request, res: Response) => {
  try {
    const { hospitalId } = req.params;
    const bookings = await prisma.booking.findMany({
      where: {
        userId: req.user.id,
        service: {
          hospital: {
            id: hospitalId
          }
        }
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            duration: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    })

    res.json(bookings)
  }

  catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error while fetching bookings' });
  }
}