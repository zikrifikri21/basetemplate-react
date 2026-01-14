<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreNavItemRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title'           => 'required|string|max:255',
            'route_name'      => 'nullable|string|max:255',
            'url'             => 'nullable|string|max:255',
            'icon'            => 'nullable|string|max:50',
            'permission_name' => 'nullable|exists:permissions,name',
            'parent_id'       => 'nullable|exists:nav_items,id',
            'order'           => 'integer|min:0',
            'is_active'       => 'boolean',
        ];
    }
}
