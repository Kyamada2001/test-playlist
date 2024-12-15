<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlaylistController;

Route::prefix('api')->group(function () {
    Route::prefix('playlist')->group(function () {
        Route::get('/index', [PlaylistController::class, 'index'])->name('playlsit.index');
        Route::post('/store', [PlaylistController::class, 'store'])->name('playlsit.store');
    });
});

Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');
