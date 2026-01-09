<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Http;
use Illuminate\Http\Client\Response;

class Recaptcha implements ValidationRule
{
    /**
     * Run the validation rule.
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        /** @var Response $response */
        $response = Http::asForm()->post('https://www.google.com/recaptcha/api/siteverify', [
            'secret' => config('services.recaptcha.secret_key'),
            'response' => $value,
            'remoteip' => request()->ip(),
        ]);

        $body = $response->json();

        if (!($body['success'] ?? false) || ($body['score'] ?? 0) < 0.5) {
            $errorCode = implode(', ', $body['error-codes'] ?? []);
            $fail("Verifikasi gagal. Error Google: {$errorCode}");
        }
    }
}
