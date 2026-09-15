<?php

namespace App\Http\Controllers;

use App\Http\Requests\Brave\BraveSearchRequest;
use App\Services\BraveService;
use App\Support\ApiResponseBuilder;

class BraveSearchController extends Controller
{
    //
    public function search(BraveSearchRequest $request, BraveService $braveService)
    {
        $query = $request->all();
        $results = $braveService->sendRequest('GET', '/search', $query);
        return ApiResponseBuilder::success($results);
    }
}
