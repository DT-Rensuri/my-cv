<?php

namespace App\Http\Controllers\Reports;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\Http\Requests\Reports\ReportApplicationBugRquest;
use App\Models\RepostedBug;

class ReportApplicationBugController extends Controller
{
    public function store(ReportApplicationBugRquest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $bugReport = RepostedBug::create([
                'source' => $data['source'],
                'error' => $data['error'],
                'stack_trace' => $data['stackTrace'],
                'occurred_at' => $data['timestamp'],
                'platform' => $data['platform'],
            ]);
        } catch (ValidationException $exception) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid bug report payload.',
                'errors' => $exception->errors(),
            ], 400);
        }

        Log::warning('Application bug report received', [
            'source' => $data['source'],
            'error' => $data['error'],
            'stack_trace' => $data['stackTrace'],
            'occurred_at' => $data['timestamp'],
            'platform' => $data['platform'],
            'client_ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'bug_id' => $bugReport->bug_id,
        ]);

        return response()->json(['success' => true, 'bug_id' => $bugReport->bug_id], 200);
    }
}
