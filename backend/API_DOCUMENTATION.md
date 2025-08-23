# Vehicle Renting System API Documentation

Base URL: `http://localhost:8000/api`

## Authentication

The API uses Laravel Sanctum for authentication. After login, include the Bearer token in all requests:

```
Authorization: Bearer your-access-token
```

## Response Format

All responses follow this format:

```json
{
  "success": true|false,
  "message": "Response message",
  "data": {...},
  "errors": {...}
}
```

## Authentication Endpoints

### Register User
**POST** `/register`

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "phone": "+1234567890",
  "address": "123 Main St, City, State",
  "role": "customer"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "user": {...},
    "access_token": "token_string",
    "token_type": "Bearer"
  }
}
```

### Login
**POST** `/login`

```json
{
  "email": "admin@vehiclerental.com",
  "password": "admin123"
}
```

### Logout
**POST** `/logout`
*Requires authentication*

### Get Current User
**GET** `/me`
*Requires authentication*

### Update Profile
**PUT** `/profile`
*Requires authentication*

```json
{
  "name": "Updated Name",
  "email": "updated@example.com",
  "phone": "+1234567890",
  "address": "New Address",
  "current_password": "current_password",
  "password": "new_password",
  "password_confirmation": "new_password"
}
```

## Dashboard Endpoints

### Get Dashboard Data
**GET** `/dashboard`
*Requires authentication*

Returns different data based on user role (admin/staff vs customer).

### Get System Stats
**GET** `/stats`
*Requires admin/staff role*

## Vehicle Endpoints

### Get All Vehicles
**GET** `/vehicles`

Query parameters:
- `status`: available, rented, maintenance
- `type`: Sedan, SUV, Sports, etc.
- `search`: Search by make or model
- `min_price`: Minimum rental price
- `max_price`: Maximum rental price

### Create Vehicle
**POST** `/vehicles`
*Requires admin/staff role*

```json
{
  "make": "Toyota",
  "model": "Camry",
  "year": 2023,
  "type": "Sedan",
  "rental_price": 45.00,
  "license_plate": "ABC-1234",
  "color": "White",
  "fuel_type": "Hybrid",
  "transmission": "Automatic",
  "seats": 5,
  "image_url": "https://example.com/image.jpg"
}
```

### Get Vehicle
**GET** `/vehicles/{id}`

### Update Vehicle
**PUT** `/vehicles/{id}`
*Requires admin/staff role*

### Delete Vehicle
**DELETE** `/vehicles/{id}`
*Requires admin/staff role*

### Get Available Vehicles
**GET** `/vehicles-available`

Query parameters:
- `start_date`: Check availability from date
- `end_date`: Check availability until date

## Booking Endpoints

### Get All Bookings
**GET** `/bookings`
*Requires authentication*

Query parameters:
- `status`: pending, approved, rejected, active, completed, cancelled
- `customer_id`: Filter by customer (admin/staff only)
- `vehicle_id`: Filter by vehicle
- `start_date`: Filter by date range
- `end_date`: Filter by date range

### Create Booking
**POST** `/bookings`
*Requires authentication*

```json
{
  "vehicle_id": 1,
  "start_date": "2024-02-01",
  "end_date": "2024-02-05",
  "notes": "Business trip rental"
}
```

### Get Booking
**GET** `/bookings/{id}`
*Requires authentication*

### Update Booking Status
**PUT** `/bookings/{id}`
*Requires admin/staff role*

```json
{
  "status": "approved",
  "notes": "Approved for rental"
}
```

### Cancel Booking
**DELETE** `/bookings/{id}`
*Requires authentication (own booking or admin/staff)*

## Maintenance Endpoints

### Get Maintenance Records
**GET** `/maintenance`
*Requires authentication*

Query parameters:
- `vehicle_id`: Filter by vehicle
- `type`: Filter by maintenance type
- `start_date`: Filter by date range
- `end_date`: Filter by date range

### Create Maintenance Record
**POST** `/maintenance`
*Requires admin/staff role*

```json
{
  "vehicle_id": 1,
  "date": "2024-01-15",
  "type": "Oil Change",
  "description": "Regular maintenance oil change",
  "cost": 45.00,
  "performed_by": "Mike Johnson"
}
```

### Get Maintenance Record
**GET** `/maintenance/{id}`

### Update Maintenance Record
**PUT** `/maintenance/{id}`
*Requires admin/staff role*

### Delete Maintenance Record
**DELETE** `/maintenance/{id}`
*Requires admin/staff role*

### Get Vehicle Maintenance History
**GET** `/maintenance/vehicle/{vehicleId}`

## Activity Endpoints

### Get Activities
**GET** `/activities`
*Requires authentication*

Query parameters:
- `user_id`: Filter by user (admin/staff only)
- `entity`: Filter by entity type
- `action`: Filter by action type
- `start_date`: Filter by date range
- `end_date`: Filter by date range

### Get Activity
**GET** `/activities/{id}`
*Requires authentication*

### Get Entity Activities
**GET** `/activities/entity/{entity}/{entityId}`

### Get User Activities
**GET** `/activities/user/{userId}`
*Requires authentication (own activities or admin/staff)*

## Notification Endpoints

### Get Notifications
**GET** `/notifications`
*Requires authentication*

Query parameters:
- `read`: true/false
- `type`: info, success, warning, error

### Create Notification
**POST** `/notifications`
*Requires admin/staff role*

```json
{
  "user_id": 1,
  "title": "Booking Approved",
  "message": "Your booking has been approved",
  "type": "success"
}
```

### Get Notification
**GET** `/notifications/{id}`
*Requires authentication*

### Mark Notification as Read
**PATCH** `/notifications/{id}/read`
*Requires authentication*

### Mark All Notifications as Read
**POST** `/notifications/mark-all-read`
*Requires authentication*

### Get Unread Count
**GET** `/notifications/unread/count`
*Requires authentication*

### Delete Notification
**DELETE** `/notifications/{id}`
*Requires authentication*

## Report Endpoints

### Get Reports
**GET** `/reports`
*Requires admin/staff role*

Query parameters:
- `type`: revenue, utilization, booking-trends
- `generated_by`: Filter by user

### Generate Report
**POST** `/reports`
*Requires admin/staff role*

```json
{
  "title": "Monthly Revenue Report",
  "type": "revenue",
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### Get Report
**GET** `/reports/{id}`
*Requires admin/staff role*

### Delete Report
**DELETE** `/reports/{id}`
*Requires admin/staff role*

### Generate Revenue Report
**POST** `/reports/revenue`
*Requires admin/staff role*

```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### Generate Utilization Report
**POST** `/reports/utilization`
*Requires admin/staff role*

```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

### Generate Booking Trends Report
**POST** `/reports/booking-trends`
*Requires admin/staff role*

```json
{
  "start_date": "2024-01-01",
  "end_date": "2024-01-31"
}
```

## Error Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Internal Server Error

## User Roles

- **admin**: Full access to all features
- **staff**: Access to vehicle and booking management
- **customer**: Access to view vehicles and manage own bookings

## Sample Data

The system comes with pre-seeded data:

### Default Users:
- **Admin**: admin@vehiclerental.com / admin123
- **Staff**: staff@vehiclerental.com / staff123
- **Customer**: customer@example.com / customer123

### Sample Vehicles:
- Toyota Camry, Honda CR-V, Ford Mustang, Tesla Model 3, BMW X5, etc.

### Sample Bookings:
- Various bookings with different statuses for testing

## Testing with Postman

1. Import the API collection
2. Set up environment variables:
   - `base_url`: http://localhost:8000/api
   - `token`: Your authentication token
3. Start with login to get a token
4. Use the token for subsequent requests

## Rate Limiting

The API implements rate limiting:
- 60 requests per minute for authenticated users
- 20 requests per minute for unauthenticated users
