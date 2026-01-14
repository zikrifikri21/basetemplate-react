<?php

use App\Http\Controllers\NavItemController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    Route::prefix('admin')->name('admin.')->group(function () {
        Route::resource('nav-items', NavItemController::class);
        Route::resource('users', UsersController::class);
        Route::resource('roles', RoleController::class);
    });
});

require __DIR__ . '/settings.php';
