<?php

namespace App\Support;

class ApiResponseBuilder
{
    /**
     * Create a new class instance.
     */
    const SUCCESS = 200;
    const CREATED = 201;
    const ACCEPTED = 202;
    const NO_CONTENT = 204;
    const BAD_REQUEST = 400;
    const UNAUTHORIZED = 401;
    const FORBIDDEN = 403;
    const NOT_FOUND = 404;
    const METHOD_NOT_ALLOWED = 405;
    const CONFLICT = 409;
    const UNPROCESSABLE_ENTITY = 422;
    const INTERNAL_SERVER_ERROR = 500;

    public static function success(mixed $data = null, string $message = 'Success', int $statusCode = self::SUCCESS)
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $statusCode);
    }

    public static function error(string $message = 'Error', int $statusCode = self::INTERNAL_SERVER_ERROR, mixed $error = null)
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'data' => $error,
        ], $statusCode);
    }
}
