<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class NavItem extends Model
{
    protected $fillable = [
        'title',
        'route_name',
        'url',
        'icon',
        'permission_name',
        'parent_id',
        'order',
        'is_active'
    ];

    public function children()
    {
        return $this->hasMany(NavItem::class, 'parent_id')->orderBy('order');
    }

    protected static function booted()
    {
        static::saved(fn () => Cache::forget('sidebar_tree'));
        static::deleted(fn () => Cache::forget('sidebar_tree'));
    }
}
