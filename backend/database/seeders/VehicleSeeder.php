<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Vehicle;

class VehicleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vehicles = [
            [
                'make' => 'Toyota',
                'model' => 'Camry',
                'year' => 2023,
                'type' => 'Sedan',
                'rental_price' => 45.00,
                'status' => 'available',
                'license_plate' => 'ABC-1234',
                'color' => 'White',
                'fuel_type' => 'Hybrid',
                'transmission' => 'Automatic',
                'seats' => 5,
                'image_url' => 'https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg',
            ],
            [
                'make' => 'Honda',
                'model' => 'CR-V',
                'year' => 2023,
                'type' => 'SUV',
                'rental_price' => 65.00,
                'status' => 'available',
                'license_plate' => 'DEF-5678',
                'color' => 'Black',
                'fuel_type' => 'Gasoline',
                'transmission' => 'Automatic',
                'seats' => 7,
                'image_url' => 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg',
            ],
            [
                'make' => 'Ford',
                'model' => 'Mustang',
                'year' => 2022,
                'type' => 'Sports',
                'rental_price' => 85.00,
                'status' => 'available',
                'license_plate' => 'GHI-9012',
                'color' => 'Red',
                'fuel_type' => 'Gasoline',
                'transmission' => 'Manual',
                'seats' => 4,
                'image_url' => 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg',
            ],
            [
                'make' => 'Tesla',
                'model' => 'Model 3',
                'year' => 2023,
                'type' => 'Electric',
                'rental_price' => 75.00,
                'status' => 'rented',
                'license_plate' => 'JKL-3456',
                'color' => 'Blue',
                'fuel_type' => 'Electric',
                'transmission' => 'Automatic',
                'seats' => 5,
                'image_url' => 'https://images.pexels.com/photos/919073/pexels-photo-919073.jpeg',
            ],
            [
                'make' => 'BMW',
                'model' => 'X5',
                'year' => 2022,
                'type' => 'Luxury SUV',
                'rental_price' => 95.00,
                'status' => 'available',
                'license_plate' => 'MNO-7890',
                'color' => 'Silver',
                'fuel_type' => 'Gasoline',
                'transmission' => 'Automatic',
                'seats' => 5,
                'image_url' => 'https://images.pexels.com/photos/244206/pexels-photo-244206.jpeg',
            ],
            [
                'make' => 'Audi',
                'model' => 'A4',
                'year' => 2023,
                'type' => 'Luxury Sedan',
                'rental_price' => 70.00,
                'status' => 'maintenance',
                'license_plate' => 'PQR-1234',
                'color' => 'Black',
                'fuel_type' => 'Gasoline',
                'transmission' => 'Automatic',
                'seats' => 5,
                'image_url' => 'https://images.pexels.com/photos/136872/pexels-photo-136872.jpeg',
            ],
            [
                'make' => 'Chevrolet',
                'model' => 'Tahoe',
                'year' => 2023,
                'type' => 'Large SUV',
                'rental_price' => 80.00,
                'status' => 'available',
                'license_plate' => 'STU-5678',
                'color' => 'White',
                'fuel_type' => 'Gasoline',
                'transmission' => 'Automatic',
                'seats' => 8,
                'image_url' => 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg',
            ],
            [
                'make' => 'Nissan',
                'model' => 'Altima',
                'year' => 2022,
                'type' => 'Sedan',
                'rental_price' => 40.00,
                'status' => 'available',
                'license_plate' => 'VWX-9012',
                'color' => 'Gray',
                'fuel_type' => 'Gasoline',
                'transmission' => 'Automatic',
                'seats' => 5,
                'image_url' => 'https://images.pexels.com/photos/120049/pexels-photo-120049.jpeg',
            ],
            [
                'make' => 'Hyundai',
                'model' => 'Elantra',
                'year' => 2023,
                'type' => 'Compact',
                'rental_price' => 35.00,
                'status' => 'available',
                'license_plate' => 'YZA-3456',
                'color' => 'Blue',
                'fuel_type' => 'Gasoline',
                'transmission' => 'Automatic',
                'seats' => 5,
                'image_url' => 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg',
            ],
            [
                'make' => 'Mercedes-Benz',
                'model' => 'C-Class',
                'year' => 2023,
                'type' => 'Luxury Sedan',
                'rental_price' => 90.00,
                'status' => 'available',
                'license_plate' => 'BCD-7890',
                'color' => 'Black',
                'fuel_type' => 'Gasoline',
                'transmission' => 'Automatic',
                'seats' => 5,
                'image_url' => 'https://images.pexels.com/photos/164634/pexels-photo-164634.jpeg',
            ],
        ];

        foreach ($vehicles as $vehicle) {
            Vehicle::create($vehicle);
        }
    }
}
