<?php

namespace App\Services;

use App\Models\NavItem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Route;

class NavService
{
    public static function getSidebar()
    {
        $allItems = Cache::rememberForever('sidebar_tree', function () {
            return NavItem::where('is_active', true)
                ->orderBy('order')
                ->get();
        });

        return self::buildTree($allItems);
    }

    private static function buildTree($items, $parentId = null)
    {
        $branch = [];
        $user = Auth::user();

        foreach ($items as $item) {
            if ($item->parent_id == $parentId) {

                if ($item->permission_name && !$user->can($item->permission_name)) {
                    continue;
                }

                $href = '#';
                if ($item->route_name && Route::has($item->route_name)) {
                    $href = route($item->route_name);
                } elseif ($item->url) {
                    $href = $item->url;
                }

                $branch[] = [
                    'title' => $item->title,
                    'href'  => $href,
                    'icon'  => $item->icon,
                    'items' => self::buildTree($items, $item->id)
                ];
            }
        }
        return $branch;
    }
}
