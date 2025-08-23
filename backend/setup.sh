#!/bin/bash

echo "==================================="
echo "Vehicle Renting System - Backend Setup"
echo "==================================="

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "Error: PHP is not installed. Please install PHP 8.1 or higher."
    exit 1
fi

# Check if Composer is installed
if ! command -v composer &> /dev/null; then
    echo "Error: Composer is not installed. Please install Composer first."
    echo "Visit: https://getcomposer.org/download/"
    exit 1
fi

echo "Installing PHP dependencies..."
composer install

echo "Setting up environment file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Environment file created. Please update database credentials in .env"
else
    echo "Environment file already exists."
fi

echo "Generating application key..."
php artisan key:generate

echo "Running database migrations..."
read -p "Do you want to run database migrations? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    php artisan migrate
    
    echo "Seeding database with sample data..."
    read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        php artisan db:seed
    fi
fi

echo "Setup completed!"
echo
echo "Default users created:"
echo "Admin: admin@vehiclerental.com / admin123"
echo "Staff: staff@vehiclerental.com / staff123"
echo "Customer: customer@example.com / customer123"
echo
echo "To start the development server, run:"
echo "php artisan serve"
echo
echo "API will be available at: http://localhost:8000"
