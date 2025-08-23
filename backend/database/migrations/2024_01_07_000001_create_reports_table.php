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
        Schema::create('reports', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->enum('type', ['revenue', 'utilization', 'booking-trends']);
            $table->json('date_range');
            $table->json('data');
            $table->foreignId('generated_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();

            $table->index(['type']);
            $table->index(['generated_by']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reports');
    }
};
