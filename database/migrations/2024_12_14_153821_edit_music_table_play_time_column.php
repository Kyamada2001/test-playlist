<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('music', function (Blueprint $table) {
            $table->renameColumn('play_time', 'play_time_sec');
            $table->integer('play_time_sec')->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('music', function (Blueprint $table) {
            $table->time('play_time_sec')->change();
            $table->renameColumn('play_time_sec', 'play_time');
        });
    }
};
