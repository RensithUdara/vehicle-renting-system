@echo off
echo ===================================
echo Vehicle Renting System - Backend Setup
echo ===================================

REM Check if PHP is installed
php --version >nul 2>&1
if errorlevel 1 (
    echo Error: PHP is not installed. Please install PHP 8.1 or higher.
    pause
    exit /b 1
)

REM Check if Composer is installed
composer --version >nul 2>&1
if errorlevel 1 (
    echo Error: Composer is not installed. Please install Composer first.
    echo Visit: https://getcomposer.org/download/
    pause
    exit /b 1
)

echo Installing PHP dependencies...
composer install

echo Setting up environment file...
if not exist ".env" (
    copy ".env.example" ".env"
    echo Environment file created. Please update database credentials in .env
) else (
    echo Environment file already exists.
)

echo Generating application key...
php artisan key:generate

echo Running database migrations...
set /p migrate="Do you want to run database migrations? (y/n): "
if /i "%migrate%"=="y" (
    php artisan migrate
    
    set /p seed="Do you want to seed the database with sample data? (y/n): "
    if /i "%seed%"=="y" (
        php artisan db:seed
    )
)

echo Setup completed!
echo.
echo Default users created:
echo Admin: admin@vehiclerental.com / admin123
echo Staff: staff@vehiclerental.com / staff123
echo Customer: customer@example.com / customer123
echo.
echo To start the development server, run:
echo php artisan serve
echo.
echo API will be available at: http://localhost:8000
pause
