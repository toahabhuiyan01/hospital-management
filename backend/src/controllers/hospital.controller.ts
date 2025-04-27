import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllHospitals = async (req: Request, res: Response) => {
  try {
    const hospitals = await prisma.hospital.findMany({
      include: {
        services: {
          select: {
            id: true,
            name: true,
            price: true,
            duration: true,
          },
        },
      },
    });

    res.json(hospitals);
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({ message: 'Server error while fetching hospitals' });
  }
};

export const getHospitalById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: {
        services: true,
      },
    });

    if (hospital) {
      res.json(hospital);
    } else {
      res.status(404).json({ message: 'Hospital not found' });
    }
  } catch (error) {
    console.error('Error fetching hospital:', error);
    res.status(500).json({ message: 'Server error while fetching hospital' });
  }
};

export const createHospital = async (req: Request, res: Response) => {
  try {
    const { name, address, phone } = req.body;

    if (!name || !address || !phone) {
      return res.status(400).json({ message: 'Name, address, and phone are required' });
    }

    const hospital = await prisma.hospital.create({
      data: {
        name,
        address
      },
    });

    res.status(201).json(hospital);
  } catch (error) {
    console.error('Error creating hospital:', error);
    res.status(500).json({ message: 'Server error while creating hospital' });
  }
};

export const deleteHospital = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const hospital = await prisma.hospital.findUnique({
      where: { id },
      include: { services: true },
    });

    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    await prisma.hospital.delete({
      where: { id },
    });

    res.json({ message: 'Hospital deleted successfully' });
  } catch (error) {
    console.error('Error deleting hospital:', error);
    res.status(500).json({ message: 'Server error while deleting hospital' });
  }
};