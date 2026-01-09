<?php

namespace App\Actions;

use App\Rules\Recaptcha;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class ValidateRecaptcha
{
    public function handle(Request $request, $next)
    {
        $request->validate([
            'recaptcha_token' => ['required', new Recaptcha],
        ]);

        return $next($request);
    }
}
