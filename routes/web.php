<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PlaylistController;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::get('/{any}', function () {
    return view('index');
})->where('any', '.*');

Route::prefix('api')->group(function () {
    Route::prefix('playlist')->group(function () {
        Route::post('/store', [PlaylistController::class, 'store']);
    });
});