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
        Schema::create('nav_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('route_name')->nullable();
            $table->string('url')->nullable();
            $table->string('icon')->nullable();
            $table->string('permission_name')->nullable();
            $table->unsignedBigInteger('parent_id')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->index(['parent_id', 'is_active', 'order']);
            $table->foreign('parent_id')->references('id')->on('nav_items')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('nav_items');
    }
};
