<?php

namespace Database\Seeders;

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\PermissionRegistrar;

class RolesAndPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[PermissionRegistrar::class]->forgetCachedPermissions();
        Permission::create(['name' => 'view_dashboard']);

        Permission::create(['name' => 'manage_system']);
        Permission::create(['name' => 'manage_menu']);
        Permission::create(['name' => 'manage_users']);
        Permission::create(['name' => 'manage_roles']);

        $userRole = Role::create(['name' => 'user']);
        $userRole->givePermissionTo('view_dashboard');

        $adminRole = Role::create(['name' => 'super-admin']);
        $adminRole->givePermissionTo(Permission::all());
    }
}
