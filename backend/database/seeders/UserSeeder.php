<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'System Admin',
            'email' => 'admin@vehiclerental.com',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
            'phone' => '+1234567890',
            'address' => '123 Admin Street, City, State 12345',
        ]);

        // Create staff user
        User::create([
            'name' => 'John Staff',
            'email' => 'staff@vehiclerental.com',
            'password' => Hash::make('staff123'),
            'role' => 'staff',
            'phone' => '+1234567891',
            'address' => '456 Staff Avenue, City, State 12346',
        ]);

        // Create customer users
        User::create([
            'name' => 'Jane Customer',
            'email' => 'customer@example.com',
            'password' => Hash::make('customer123'),
            'role' => 'customer',
            'phone' => '+1234567892',
            'address' => '789 Customer Road, City, State 12347',
        ]);

        User::create([
            'name' => 'Mike Johnson',
            'email' => 'mike@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'phone' => '+1234567893',
            'address' => '321 Johnson Lane, City, State 12348',
        ]);

        User::create([
            'name' => 'Sarah Wilson',
            'email' => 'sarah@example.com',
            'password' => Hash::make('password123'),
            'role' => 'customer',
            'phone' => '+1234567894',
            'address' => '654 Wilson Street, City, State 12349',
        ]);
    }
}
