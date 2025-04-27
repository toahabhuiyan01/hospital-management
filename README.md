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
- `PUT /api/bookings/:id`: Update booking status, or maybe rescheduling and other for later (protected)

### Setup Instructions

1. Initiate database on docker:
   ```
   docker run -d \
      --name my-postgres-db \
      -e POSTGRES_USER=postgres \
      -e POSTGRES_PASSWORD=postgres \
      -e POSTGRES_DB=hospital_management \
      -p 5432:5432 \
      -v pgdata:/var/lib/postgresql/data \
      postgres:14.1-alpine
   ```   

2. Install dependencies:
   ```
   cd backend
   npm install
   npm run seed // Seed the database
   npm run dev
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   NODE_ENV=development
   PORT=6969
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/hospital_management"
   JWT_SECRET=your_jwt_secret_key
   ```

4. Set up the database:
   ```
   npx prisma migrate dev --name init
   npx prisma generate
   ```

5. Start the development server:
   ```
   npm run dev
   ```

## Frontend
### Technologies Used
- React Native (Expo) : Cross-platform mobile framework
- React Navigation : For screen navigation
- React Native Paper : UI component library
- Axios : For API requests
- AsyncStorage : For local data persistence
- DateTimePicker : For appointment scheduling

### Features User Authentication
- Login and registration functionality
- JWT token-based authentication
- Secure storage of authentication state
- Form validation for user inputs

### Hospital Listing
- View a comprehensive list of available hospitals
- Search functionality to find specific hospitals
- Hospital details including address and contact information
- Clean and intuitive UI for browsing hospitals Service Selection
- Browse services offered by each hospital
- View service details including price and duration
- Filter services by category or type
- Select services for appointment booking

### Service Selection
- Browse services offered by each hospital
- View service details including price and duration
- Filter services by category or type
- Select services for appointment booking Appointment Booking
- Interactive calendar for date selection
- Time slot selection for appointments
- Booking confirmation process
- View booking history and current status
- Cancel or reschedule existing bookings

### Setup Instructions
1. Install dependencies:

```
cd frontend
npm install
```
2. Start the development server:
```
npm run web
```

## Design Decisions

### Backend
- **Express.js with TypeScript**: Provides a robust framework with type safety
- **Prisma ORM**: Simplifies database operations with type-safe queries
- **JWT Authentication**: Secure, stateless authentication for API endpoints
- **Zod Validation**: Runtime validation for request data

### Frontend
- React Native : Enables cross-platform development with a single codebase
- Context API : For global state management
- Component-based architecture : For reusable UI elements
- Responsive design : Adapts to different screen sizes

### Database Schema
- **User**: Stores user information and authentication details
- **Hospital**: Contains hospital information
- **Service**: Represents services offered by hospitals
- **Booking**: Manages appointment bookings between users and services

## Data Seeding
The application includes a seed script to populate the database with initial data:

- Multiple hospitals with realistic names and addresses
- Various medical services with appropriate pricing
- Run using npm run seed from the backend directory