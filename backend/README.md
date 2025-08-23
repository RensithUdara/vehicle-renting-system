# Vehicle Renting System - Laravel Backend API

This is the backend API for the Vehicle Renting System built with Laravel 10, providing RESTful API endpoints for vehicle management, booking system, user authentication, and more.

## Features

- **User Authentication & Authorization**
  - JWT token-based authentication using Laravel Sanctum
  - Role-based access control (Admin, Staff, Customer)
  - User registration and profile management

- **Vehicle Management**
  - CRUD operations for vehicles
  - Vehicle availability tracking
  - Vehicle status management (available, rented, maintenance)
  - Vehicle search and filtering

- **Booking System**
  - Create, view, and manage bookings
  - Booking status tracking (pending, approved, active, completed, cancelled)
  - Date conflict validation
  - Automatic pricing calculation

- **Maintenance Records**
  - Track vehicle maintenance history
  - Cost tracking and service provider information
  - Maintenance scheduling

- **Activity Logging**
  - System-wide activity tracking
  - User action logging
  - Audit trail for all operations

- **Notifications**
  - Real-time notifications for users
  - Booking status updates
  - System notifications

- **Reports & Analytics**
  - Revenue reports
  - Vehicle utilization reports
  - Booking trends analysis
  - Dashboard statistics

## Technology Stack

- **Framework**: Laravel 10
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **API**: RESTful API with JSON responses
- **Authorization**: Role-based permissions

## Installation

### Prerequisites

- PHP 8.1 or higher
- Composer
- MySQL 5.7 or higher
- Node.js and NPM (for frontend integration)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vehicle-renting-system-backend
   ```

2. **Install PHP dependencies**
   ```bash
   composer install
   ```

3. **Environment configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your database credentials:
   ```env
   DB_DATABASE=vehicle_renting_system
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

4. **Generate application key**
   ```bash
   php artisan key:generate
   ```

5. **Run database migrations**
   ```bash
   php artisan migrate
   ```

6. **Seed the database with sample data**
   ```bash
   php artisan db:seed
   ```

7. **Start the development server**
   ```bash
   php artisan serve
   ```

The API will be available at `http://localhost:8000`

## API Endpoints

### Authentication
- `POST /api/register` - User registration
- `POST /api/login` - User login
- `POST /api/logout` - User logout
- `GET /api/me` - Get current user
- `PUT /api/profile` - Update user profile

### Dashboard
- `GET /api/dashboard` - Get dashboard data
- `GET /api/stats` - Get system statistics

### Vehicles
- `GET /api/vehicles` - Get all vehicles
- `POST /api/vehicles` - Create new vehicle
- `GET /api/vehicles/{id}` - Get specific vehicle
- `PUT /api/vehicles/{id}` - Update vehicle
- `DELETE /api/vehicles/{id}` - Delete vehicle
- `GET /api/vehicles-available` - Get available vehicles

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/{id}` - Get specific booking
- `PUT /api/bookings/{id}` - Update booking
- `DELETE /api/bookings/{id}` - Cancel booking

### Maintenance
- `GET /api/maintenance` - Get maintenance records
- `POST /api/maintenance` - Create maintenance record
- `GET /api/maintenance/{id}` - Get specific record
- `PUT /api/maintenance/{id}` - Update record
- `DELETE /api/maintenance/{id}` - Delete record
- `GET /api/maintenance/vehicle/{vehicleId}` - Get vehicle maintenance history

### Activities
- `GET /api/activities` - Get activity log
- `GET /api/activities/{id}` - Get specific activity
- `GET /api/activities/entity/{entity}/{entityId}` - Get entity activities
- `GET /api/activities/user/{userId}` - Get user activities

### Notifications
- `GET /api/notifications` - Get user notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications/{id}` - Get specific notification
- `PATCH /api/notifications/{id}/read` - Mark as read
- `POST /api/notifications/mark-all-read` - Mark all as read
- `GET /api/notifications/unread/count` - Get unread count
- `DELETE /api/notifications/{id}` - Delete notification

### Reports
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Generate new report
- `GET /api/reports/{id}` - Get specific report
- `DELETE /api/reports/{id}` - Delete report
- `POST /api/reports/revenue` - Generate revenue report
- `POST /api/reports/utilization` - Generate utilization report
- `POST /api/reports/booking-trends` - Generate booking trends report

## Database Schema

### Users Table
- id, name, email, password, role, phone, address, timestamps

### Vehicles Table
- id, make, model, year, type, rental_price, status, license_plate, color, fuel_type, transmission, seats, image_url, timestamps

### Bookings Table
- id, customer_id, vehicle_id, start_date, end_date, total_amount, status, notes, timestamps

### Maintenance Records Table
- id, vehicle_id, date, type, description, cost, performed_by, timestamps

### Activities Table
- id, user_id, action, entity, entity_id, details, timestamp, timestamps

### Notifications Table
- id, user_id, title, message, type, read, timestamps

## Default Users

The system comes with pre-seeded users for testing:

**Admin User:**
- Email: admin@vehiclerental.com
- Password: admin123

**Staff User:**
- Email: staff@vehiclerental.com
- Password: staff123

**Customer User:**
- Email: customer@example.com
- Password: customer123

## API Response Format

All API responses follow a consistent format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {...},
  "errors": {...}
}
```

## Authentication

The API uses Laravel Sanctum for authentication. Include the Bearer token in the Authorization header:

```
Authorization: Bearer your-token-here
```

## Error Handling

The API returns appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 500: Internal Server Error

## Development

### Running Tests
```bash
php artisan test
```

### Code Style
The project follows PSR-12 coding standards. Use PHP CS Fixer:
```bash
vendor/bin/php-cs-fixer fix
```

### Database Migrations
Create new migration:
```bash
php artisan make:migration create_table_name
```

### Seeding Data
Create new seeder:
```bash
php artisan make:seeder TableNameSeeder
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
