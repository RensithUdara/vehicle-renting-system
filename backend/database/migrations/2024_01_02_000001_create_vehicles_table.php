<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('make');
            $table->string('model');
            $table->integer('year');
            $table->string('type');
            $table->decimal('rental_price', 8, 2);
            $table->enum('status', ['available', 'rented', 'maintenance'])->default('available');
            $table->string('license_plate')->unique();
            $table->string('color');
            $table->string('fuel_type');
            $table->string('transmission');
            $table->integer('seats');
            $table->string('image_url')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['status']);
            $table->index(['type']);
            $table->index(['make', 'model']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
