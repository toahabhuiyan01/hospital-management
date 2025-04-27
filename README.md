# Hospital Booking System

A full-stack application for booking hospital appointments with a React Native frontend and Express.js backend.

## Project Structure

- `/backend`: Express.js API with TypeScript and Prisma ORM
- `/frontend`: React Native (Expo) web application

## Backend

### Technologies Used

- **Express.js**: Web framework for Node.js
- **TypeScript**: For type safety and better developer experience
- **Prisma**: ORM for database operations
- **PostgreSQL**: Database for storing application data
- **JWT**: For authentication
- **Zod**: For request validation

### API Endpoints

#### Authentication
- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login a user

#### Hospitals
- `GET /api/hospitals`: Get all hospitals
- `GET /api/hospitals/:id`: Get hospital by ID

#### Services
- `GET /api/services`: Get all services
- `GET /api/services/:id`: Get service by ID
- `GET /api/services/hospital/:hospitalId`: Get services by hospital ID

#### Bookings
- `POST /api/bookings`: Create a new booking (protected)
- `GET /api/bookings`: Get user's bookings (protected)
- `GET /api/bookings/:id`: Get booking by ID (protected)
- `PUT /api/bookings/:id`: Update booking status, or maybe rescheduling and other for later (protected)

### Setup Instructions

1. Install dependencies:
   ```
   cd backend
   npm install
   npm run seed // Seed the database
   npm run dev
   ```

2. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=6969
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hospital_booking"
   JWT_SECRET=your_jwt_secret_key
   ```

3. Set up the database:
   ```
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Frontend (To be implemented)

The frontend will be a React Native (Expo) application with the following features:
- User authentication
- Hospital listing
- Service selection
- Appointment booking

## Design Decisions

### Backend
- **Express.js with TypeScript**: Provides a robust framework with type safety
- **Prisma ORM**: Simplifies database operations with type-safe queries
- **JWT Authentication**: Secure, stateless authentication for API endpoints
- **Zod Validation**: Runtime validation for request data

### Database Schema
- **User**: Stores user information and authentication details
- **Hospital**: Contains hospital information
- **Service**: Represents services offered by hospitals
- **Booking**: Manages appointment bookings between users and services

