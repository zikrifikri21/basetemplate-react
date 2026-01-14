<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreNavItemRequest;
use App\Models\NavItem;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class NavItemController extends Controller
{
    public function index()
    {
        $navItems = NavItem::with('children')
            ->whereNull('parent_id')
            ->orderBy('order')
            ->get()
            ->flatten();

        $adminViewItems = NavItem::orderBy('parent_id')->orderBy('order')->get();

        return Inertia::render('admin/nav-items/index', [
            'navItems'    => $adminViewItems ?? [],
            'parents'     => NavItem::whereNull('parent_id')->get(),
            'permissions' => Permission::all()->pluck('name'),
        ]);
    }

    public function store(StoreNavItemRequest $request)
    {
        NavItem::create($request->validated());
        return redirect()->route('admin.nav-items.index')->with('success', 'Menu created successfully.');
    }

    public function edit(NavItem $navItem)
    {
        return Inertia::render('admin/nav-items/form', [
            'navItem'     => $navItem,
            'parents'     => NavItem::where('id', '!=', $navItem->id)->get(),
            'permissions' => Permission::pluck('name'),
        ]);
    }

    public function update(StoreNavItemRequest $request, NavItem $navItem)
    {
        $navItem->update($request->validated());
        return redirect()->route('admin.nav-items.index')->with('success', 'Menu updated successfully.');
    }

    public function destroy(NavItem $navItem)
    {
        $navItem->delete();
        return redirect()->back()->with('success', 'Menu deleted successfully.');
    }
}
