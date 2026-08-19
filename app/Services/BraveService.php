<?php 
namespace App\Services;

use Illuminate\Support\Facades\Http;

class BraveService
{
    protected string $apiKey;
    protected string $baseUrl;

    public function __construct(string $apiKey)
    {
        $this->apiKey = $apiKey;
        $this->baseUrl = 'https://api.search.brave.com/res/v1/web';
    }

public function sendRequest(string $method, string $endpoint, array $queryParams = [], array $bodyParams = []): array
    {
        $url = $this->baseUrl . '/' . ltrim($endpoint, '/');

        $request = Http::withHeaders([
            'Accept' => 'application/json',
            'Accept-Encoding' => 'gzip',
            'X-Subscription-Token' => $this->apiKey,
        ]);

        if (!empty($queryParams)) {
            $request = $request->withQueryParameters($queryParams);
        }

        $method = strtoupper($method);
        try {
            $response = match ($method) {
                'GET' => $request->get($url),
                'POST' => $request->post($url, $bodyParams),
                'PUT' => $request->put($url, $bodyParams),
                'DELETE' => $request->delete($url),
                default => throw new \InvalidArgumentException("Unsupported HTTP method: {$method}"),
            };

            if ($response->failed()) {
                throw new \Exception("Brave API error [Status {$response->status()}]: {$response->body()}");
            }

            return $response->json() ?? [];
        } catch (\Exception $e) {
            throw new \Exception("Error sending request to Brave API: " . $e->getMessage());
        }
    }
}