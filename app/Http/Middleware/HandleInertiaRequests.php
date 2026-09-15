<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Illuminate\Support\Facades\Http;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {

        [
            'country' => $country,
            'locale' => $locale,
        ] = $this->detectLocale($request);

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'geo' => [
                'country' => $country,
                'locale' => $locale,
            ]
        ];
    }

    private function detectLocale(Request $request): array
    {
        $ip = $request->ip();

        // Local development
        if (
            app()->environment('local') &&
            in_array($ip, ['127.0.0.1', '::1'], true)
        ) {
            return [
                'country' => 'VN',
                'locale' => 'vi',
            ];
        }

        try {
            $response = Http::timeout(2)
                ->get("http://ip-api.com/json/{$ip}", [
                    'fields' => 'status,countryCode',
                ]);

            if (!$response->successful()) {
                return [
                    'country' => 'VN',
                    'locale' => 'vi',
                ];
            }

            $country = $response->json('countryCode');
            $locale = match ($country) {
                'VN' => 'vi',
                'JP' => 'ja',
                default => 'en',
            };

            return [
                'country' => $country,
                'locale' => $locale,
            ];
        } catch (\Throwable) {
            return [
                'country' => 'VN',
                'locale' => 'vi',
            ];
        }
    }
}
