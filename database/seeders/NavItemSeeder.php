<?php

namespace Database\Seeders;

use App\Models\NavItem;
use Illuminate\Database\Seeder;

class NavItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        NavItem::truncate();

        NavItem::create([
            'title'           => 'Dashboard',
            'route_name'      => 'dashboard',
            'icon'            => 'LayoutGrid',
            'order'           => 1,
            'is_active'       => true,
            'permission_name' => 'view_dashboard',
        ]);

        $systemMenu = NavItem::create([
            'title'           => 'System',
            'icon'            => 'Settings',
            'order'           => 99,
            'is_active'       => true,
            'permission_name' => 'manage_system',
        ]);

        NavItem::create([
            'parent_id'       => $systemMenu->id,
            'title'           => 'Menu Management',
            'route_name'      => 'admin.nav-items.index',
            'icon'            => 'List',
            'order'           => 1,
            'is_active'       => true,
            'permission_name' => 'manage_menu',
        ]);

        NavItem::create([
            'parent_id'       => $systemMenu->id,
            'title'           => 'Users',
            'url'             => '/admin/users',
            'icon'            => 'Users',
            'order'           => 2,
            'is_active'       => true,
            'permission_name' => 'manage_users',
        ]);
    }
}
