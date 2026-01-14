<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleController extends Controller
{
    public function index()
    {
        $roles = Role::with('permissions')->orderBy('id')->get();
        $permissions = Permission::all();

        return Inertia::render('admin/roles/index', [
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:roles,name',
            'permissions' => 'array',
        ]);

        $role = Role::create(['name' => $request->name]);

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->back();
    }

    public function update(Request $request, Role $role)
    {
        $request->validate([
            'name' => ['required', 'string', Rule::unique('roles', 'name')->ignore($role->id)],
            'permissions' => 'array',
        ]);

        if ($role->name !== 'super-admin') {
            $role->update(['name' => $request->name]);
        }

        if ($request->has('permissions')) {
            $role->syncPermissions($request->permissions);
        }

        return redirect()->back();
    }

    public function destroy(Role $role)
    {
        if ($role->name === 'super-admin') {
            return redirect()->back()->withErrors(['error' => 'Cannot delete Super Admin role.']);
        }

        $role->delete();
        return redirect()->back();
    }
}
