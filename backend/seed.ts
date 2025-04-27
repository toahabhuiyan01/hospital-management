import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Hospital {
  name: string;
  address: string;
  description: string;
}

interface Service {
  name: string;
  description: string;
  price: number;
  duration: number;
  hospitalId: string;
}

async function main() {
  const hospitals: Hospital[] = [
    { name: 'City General Hospital', address: '123 Main St', description: 'A great hospital' },
    { name: 'Downtown Medical Center', address: '456 Elm St', description: 'Another great hospital' },
    { name: 'Suburban Health Clinic', address: '789 Oak St', description: 'A suburban health clinic' },
    { name: 'Riverside Hospital', address: '101 River Rd', description: 'Hospital by the river' },
    { name: 'Mountain View Hospital', address: '202 Mountain Rd', description: 'Hospital with a view of the mountains' }
  ];

  for (const hospital of hospitals) {
    const createdHospital = await prisma.hospital.create({
      data: hospital,
    });

    const services: Service[] = [
      { name: 'General Checkup', description: 'Routine health checkup', price: 100, duration: 60, hospitalId: createdHospital.id },
      { name: 'Cardiology Consultation', description: 'Heart specialist consultation', price: 200, duration: 120, hospitalId: createdHospital.id },
      { name: 'Dermatology Consultation', description: 'Skin specialist consultation', price: 150, duration: 90, hospitalId: createdHospital.id },
      { name: 'Pediatrics Consultation', description: 'Child specialist consultation', price: 180, duration: 110, hospitalId: createdHospital.id },
      { name: 'Orthopedic Consultation', description: 'Bone specialist consultation', price: 220, duration: 130, hospitalId: createdHospital.id }
    ];

    for (const service of services) {
      await prisma.service.create({
        data: service,
      });
    }
  }

  console.log('Hospitals and services seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });