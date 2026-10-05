<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('reported_bugs', function (Blueprint $table) {
            $table->id();
            $table->uuid('bug_id')->unique();
            $table->string('source');
            $table->text('error');
            $table->text('stack_trace');
            $table->timestamp('occurred_at');
            $table->enum('platform', ['android', 'ios', 'fuchsia', 'linux', 'macos', 'windows', 'web']);
            $table->text('metadata')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reported_bugs');
    }
};
