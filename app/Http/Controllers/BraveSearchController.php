<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Requests\Brave\BraveSearchRequest;
use App\Services\BraveService;

class BraveSearchController extends Controller
{
    //
    public function search(BraveSearchRequest $request, BraveService $braveService)
    {
        $query = $request->all();
        $results = $braveService->sendRequest('GET', '/search', $query);
        return response()->json($results);
    }
}
