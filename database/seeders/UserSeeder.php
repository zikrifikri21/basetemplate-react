<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@app.com',
            'password' => Hash::make('password'),
        ]);
        $admin->assignRole('super-admin');

        $user = User::create([
            'name' => 'User Demo',
            'email' => 'user@app.com',
            'password' => Hash::make('password'),
        ]);
        $user->assignRole('user');
    }
}
