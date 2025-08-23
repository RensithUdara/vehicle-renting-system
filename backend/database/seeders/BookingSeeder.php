<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Booking;
use App\Models\User;
use App\Models\Vehicle;
use Carbon\Carbon;

class BookingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();
        $vehicles = Vehicle::all();

        $bookings = [
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'JKL-3456')->first()->id, // Tesla Model 3 (rented)
                'start_date' => Carbon::now()->subDays(2),
                'end_date' => Carbon::now()->addDays(3),
                'total_amount' => 375.00, // 5 days * 75
                'status' => 'active',
                'notes' => 'Business trip rental'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'ABC-1234')->first()->id, // Toyota Camry
                'start_date' => Carbon::now()->addDays(5),
                'end_date' => Carbon::now()->addDays(10),
                'total_amount' => 270.00, // 6 days * 45
                'status' => 'approved',
                'notes' => 'Family vacation'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'DEF-5678')->first()->id, // Honda CR-V
                'start_date' => Carbon::now()->addDays(1),
                'end_date' => Carbon::now()->addDays(4),
                'total_amount' => 260.00, // 4 days * 65
                'status' => 'pending',
                'notes' => 'Weekend trip'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'GHI-9012')->first()->id, // Ford Mustang
                'start_date' => Carbon::now()->subDays(10),
                'end_date' => Carbon::now()->subDays(8),
                'total_amount' => 255.00, // 3 days * 85
                'status' => 'completed',
                'notes' => 'Special occasion'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'MNO-7890')->first()->id, // BMW X5
                'start_date' => Carbon::now()->addDays(7),
                'end_date' => Carbon::now()->addDays(12),
                'total_amount' => 570.00, // 6 days * 95
                'status' => 'pending',
                'notes' => 'Corporate event'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'STU-5678')->first()->id, // Chevrolet Tahoe
                'start_date' => Carbon::now()->subDays(20),
                'end_date' => Carbon::now()->subDays(15),
                'total_amount' => 480.00, // 6 days * 80
                'status' => 'completed',
                'notes' => 'Large group transportation'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'VWX-9012')->first()->id, // Nissan Altima
                'start_date' => Carbon::now()->addDays(15),
                'end_date' => Carbon::now()->addDays(18),
                'total_amount' => 160.00, // 4 days * 40
                'status' => 'pending',
                'notes' => 'Economy rental'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'YZA-3456')->first()->id, // Hyundai Elantra
                'start_date' => Carbon::now()->subDays(5),
                'end_date' => Carbon::now()->subDays(3),
                'total_amount' => 105.00, // 3 days * 35
                'status' => 'completed',
                'notes' => 'Short term rental'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'PQR-1234')->first()->id, // Audi A4 (maintenance)
                'start_date' => Carbon::now()->subDays(1),
                'end_date' => Carbon::now()->addDays(2),
                'total_amount' => 210.00, // 3 days * 70
                'status' => 'cancelled',
                'notes' => 'Vehicle went into maintenance'
            ],
            [
                'customer_id' => $customers->random()->id,
                'vehicle_id' => $vehicles->where('license_plate', 'BCD-7890')->first()->id, // Mercedes-Benz C-Class
                'start_date' => Carbon::now()->addDays(20),
                'end_date' => Carbon::now()->addDays(25),
                'total_amount' => 540.00, // 6 days * 90
                'status' => 'approved',
                'notes' => 'Luxury experience'
            ],
        ];

        foreach ($bookings as $booking) {
            Booking::create($booking);
        }
    }
}
