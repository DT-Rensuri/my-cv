<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;


class RepostedBug extends Model
{
    protected $table = 'reported_bugs';

    protected $fillable = [
        'source',
        'error',
        'stack_trace',
        'occurred_at',
        'platform',
        'metadata',
    ];

    protected $casts = [
        'occurred_at' => 'datetime',
    ];

    protected static function booted()
    {
        static::creating(function ($user) {
            $user->uuid = (string) Str::uuid();
        });
    }
}
