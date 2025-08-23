# Vehicle Renting System - Integration Guide

This guide explains how to connect the React frontend with the Laravel backend API.

## 🏗️ Architecture Overview

- **Frontend**: React + TypeScript + Vite (Port 5173)
- **Backend**: Laravel 10 + MySQL (Port 8000)
- **Authentication**: Laravel Sanctum with Bearer tokens
- **API Communication**: Axios HTTP client

## 📋 Prerequisites

### Backend Requirements
- PHP 8.1 or higher
- Composer
- MySQL 5.7 or higher

### Frontend Requirements
- Node.js 16 or higher
- npm or yarn

## 🚀 Setup Instructions

### 1. Backend Setup (Laravel)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Setup environment:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Configure database in `.env`:
   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=vehicle_renting_system
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   ```

5. Run migrations and seed data:
   ```bash
   php artisan migrate --seed
   ```

6. Start the Laravel server:
   ```bash
   php artisan serve
   ```
   Backend will run on: http://localhost:8000

### 2. Frontend Setup (React)

1. Navigate to the frontend root directory:
   ```bash
   cd vehicle-renting-system-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup environment (already configured):
   ```env
   REACT_APP_API_URL=http://localhost:8000/api
   REACT_APP_NAME="Vehicle Renting System"
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```
   Frontend will run on: http://localhost:5173

## 🔗 API Integration Details

### Authentication Flow

1. **Login**: User credentials → Laravel API → JWT token stored in localStorage
2. **API Requests**: Bearer token included in Authorization header
3. **Token Refresh**: Automatic token validation and redirect on expiry
4. **Logout**: Token cleared from localStorage

### API Endpoints Integration

The frontend API modules are already configured to work with Laravel:

#### Authentication (`src/api/auth.js`)
```javascript
// Already integrated endpoints:
POST /api/login
POST /api/register  
POST /api/logout
GET /api/me
PUT /api/profile
```

#### Vehicles (`src/api/vehicles.js`)
```javascript
// Already integrated endpoints:
GET /api/vehicles
POST /api/vehicles
GET /api/vehicles/{id}
PUT /api/vehicles/{id}
DELETE /api/vehicles/{id}
GET /api/vehicles-available
```

#### Bookings (`src/api/bookings.js`)
```javascript
// Already integrated endpoints:
GET /api/bookings
POST /api/bookings
GET /api/bookings/{id}
PUT /api/bookings/{id}
DELETE /api/bookings/{id}
```

### Error Handling

The frontend includes comprehensive error handling:
- Network errors
- Authentication errors (401 redirects to login)
- Validation errors (422 displays field errors)
- Server errors (500 shows generic message)

### CORS Configuration

Backend is already configured to accept requests from frontend:
```php
// config/cors.php
'allowed_origins' => ['http://localhost:5173'],
```

## 🎯 Testing the Integration

### Default Test Users (Already Seeded)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@vehiclerental.com | admin123 |
| Staff | staff@vehiclerental.com | staff123 |
| Customer | customer@example.com | customer123 |

### Test Scenarios

1. **Authentication Test**:
   - Visit http://localhost:5173
   - Login with any test user
   - Check if token is stored in localStorage
   - Navigate to dashboard

2. **API Communication Test**:
   - Login as admin
   - Go to vehicles page → Should load vehicles from API
   - Create a new vehicle → Should send POST to API
   - Check browser network tab for API calls

3. **Role-Based Access Test**:
   - Login as customer → Limited access to customer features
   - Login as admin → Full access to all features

## 🔧 Configuration Files

### Frontend Configuration

**Environment Variables (`.env`)**:
```env
REACT_APP_API_URL=http://localhost:8000/api
```

**Axios Configuration (`src/api/axios.js`)**:
- Base URL: http://localhost:8000/api
- Automatic token attachment
- Response/Request interceptors
- Error handling

### Backend Configuration

**CORS (`config/cors.php`)**:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['http://localhost:5173'],
'allowed_methods' => ['*'],
'allowed_headers' => ['*'],
```

**Sanctum (`config/sanctum.php`)**:
```php
'stateful' => ['localhost', 'localhost:5173'],
```

## 🐛 Common Issues & Solutions

### 1. CORS Errors
**Problem**: Browser blocks API requests
**Solution**: Ensure backend CORS is configured correctly

### 2. 401 Unauthorized
**Problem**: Token expired or invalid
**Solution**: Frontend automatically redirects to login

### 3. Network Error
**Problem**: Backend not running
**Solution**: Start Laravel server with `php artisan serve`

### 4. Database Connection
**Problem**: Laravel can't connect to database
**Solution**: Check `.env` database credentials

## 📱 Frontend Components Integration

### AuthContext (`src/context/AuthContext.tsx`)
- Updated to use real API instead of mock data
- Handles token storage and validation
- Automatic logout on token expiry

### Login Component (`src/components/Auth/Login.tsx`)
- Updated with correct demo credentials
- Integrated with AuthContext API calls

### Register Component (`src/components/Auth/Register.tsx`)
- Updated to send password_confirmation for Laravel validation
- Integrated with AuthContext API calls

## 🔄 Data Flow

1. **User Login**:
   Frontend → POST `/api/login` → Laravel → JWT Token → localStorage

2. **API Request**:
   Frontend → Axios Interceptor adds Bearer token → Laravel API → JSON Response

3. **Data Display**:
   API Response → React Component → UI Update

4. **Error Handling**:
   API Error → Axios Interceptor → Error Display/Redirect

## 🚀 Production Deployment

### Frontend (React)
1. Build production version: `npm run build`
2. Serve static files from `dist/` folder
3. Update `REACT_APP_API_URL` to production API URL

### Backend (Laravel)
1. Set `APP_ENV=production` in `.env`
2. Configure production database
3. Run `php artisan config:cache`
4. Set up proper web server (Apache/Nginx)

## 📊 Monitoring & Debugging

### Development Tools
- Browser DevTools → Network tab for API requests
- Laravel logs: `storage/logs/laravel.log`
- Frontend console for JavaScript errors

### API Testing
- Use Postman with provided API documentation
- Test endpoints independently
- Check Laravel routes: `php artisan route:list`

## ✅ Integration Checklist

- [ ] Backend server running on port 8000
- [ ] Frontend server running on port 5173
- [ ] Database connection established
- [ ] CORS configured correctly
- [ ] Authentication working (login/logout)
- [ ] API endpoints responding correctly
- [ ] Frontend components loading data from API
- [ ] Error handling working properly
- [ ] Role-based access control functioning

---

The integration is complete! Both frontend and backend are now connected and ready for development. The existing API files were already perfectly structured for the Laravel backend, making the integration seamless.
