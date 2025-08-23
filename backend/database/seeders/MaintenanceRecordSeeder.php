<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MaintenanceRecord;
use App\Models\Vehicle;
use Carbon\Carbon;

class MaintenanceRecordSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $vehicles = Vehicle::all();

        $maintenanceRecords = [
            [
                'vehicle_id' => $vehicles->where('license_plate', 'ABC-1234')->first()->id, // Toyota Camry
                'date' => Carbon::now()->subDays(15),
                'type' => 'Oil Change',
                'description' => 'Regular maintenance oil change and filter replacement',
                'cost' => 45.00,
                'performed_by' => 'Mike Johnson'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'ABC-1234')->first()->id, // Toyota Camry
                'date' => Carbon::now()->subDays(45),
                'type' => 'Tire Rotation',
                'description' => 'Rotated all four tires and checked tire pressure',
                'cost' => 25.00,
                'performed_by' => 'Sarah Mechanic'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'DEF-5678')->first()->id, // Honda CR-V
                'date' => Carbon::now()->subDays(10),
                'type' => 'Brake Inspection',
                'description' => 'Comprehensive brake system inspection and brake fluid top-up',
                'cost' => 75.00,
                'performed_by' => 'John Tech'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'GHI-9012')->first()->id, // Ford Mustang
                'date' => Carbon::now()->subDays(30),
                'type' => 'Engine Tune-up',
                'description' => 'Complete engine tune-up including spark plugs and air filter',
                'cost' => 150.00,
                'performed_by' => 'Mike Johnson'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'JKL-3456')->first()->id, // Tesla Model 3
                'date' => Carbon::now()->subDays(20),
                'type' => 'Software Update',
                'description' => 'Tesla software update and system diagnostics',
                'cost' => 0.00,
                'performed_by' => 'Tesla Service Center'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'MNO-7890')->first()->id, // BMW X5
                'date' => Carbon::now()->subDays(25),
                'type' => 'Transmission Service',
                'description' => 'Transmission fluid change and system inspection',
                'cost' => 200.00,
                'performed_by' => 'BMW Specialist'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'PQR-1234')->first()->id, // Audi A4 (in maintenance)
                'date' => Carbon::now()->subDays(2),
                'type' => 'Engine Repair',
                'description' => 'Major engine repair - replacing faulty components',
                'cost' => 850.00,
                'performed_by' => 'Audi Service Center'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'STU-5678')->first()->id, // Chevrolet Tahoe
                'date' => Carbon::now()->subDays(35),
                'type' => 'Air Conditioning Service',
                'description' => 'AC system maintenance and refrigerant refill',
                'cost' => 120.00,
                'performed_by' => 'Climate Control Specialist'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'VWX-9012')->first()->id, // Nissan Altima
                'date' => Carbon::now()->subDays(18),
                'type' => 'Battery Replacement',
                'description' => 'Replaced old battery and tested charging system',
                'cost' => 85.00,
                'performed_by' => 'Auto Electric'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'YZA-3456')->first()->id, // Hyundai Elantra
                'date' => Carbon::now()->subDays(12),
                'type' => 'General Inspection',
                'description' => 'Annual safety and emissions inspection',
                'cost' => 35.00,
                'performed_by' => 'State Inspector'
            ],
            [
                'vehicle_id' => $vehicles->where('license_plate', 'BCD-7890')->first()->id, // Mercedes-Benz C-Class
                'date' => Carbon::now()->subDays(8),
                'type' => 'Detailing Service',
                'description' => 'Complete interior and exterior detailing service',
                'cost' => 180.00,
                'performed_by' => 'Premium Detailing'
            ],
        ];

        foreach ($maintenanceRecords as $record) {
            MaintenanceRecord::create($record);
        }
    }
}
