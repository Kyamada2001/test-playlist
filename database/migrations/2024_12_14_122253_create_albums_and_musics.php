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
        Schema::create('albums', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes()->nullable();
        });

        Schema::create('artists', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->timestamps();
            $table->softDeletes()->nullable();
        });

        Schema::create('music', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->constrained();
            $table->foreignId('artist_id')->constrained();
            $table->string('name');
            $table->time('play_time');
            $table->timestamps();
            $table->softDeletes()->nullable();
        });

        Schema::create('album_tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('album_id')->constrained();
            $table->foreignId('music_id')->constrained();
            $table->integer('track_index');
            $table->timestamps();
            $table->softDeletes()->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('album_tracks');
        Schema::dropIfExists('music');
        Schema::dropIfExists('artists');
        Schema::dropIfExists('albums');
    }
};
