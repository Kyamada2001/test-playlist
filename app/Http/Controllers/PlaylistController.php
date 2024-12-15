<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PlaylistController extends Controller
{
    public function store (Request $request) 
    {
        Log::info($request);
        $data = $request->data;

        $validated = $request->validate([
            'playlist' => 'required|array',
            'playlist.*.albumName' => 'required|string',
            'playlist.*.music' => 'required|array',
            'playlist.*.music.*.musicName' => 'required_|string',
            'playlist.*.music.*.artistName' => 'required|string',
            'playlist.*.music.*.musicTime' => 'required|regex:/^([0-9]{1,3}):([0-5][0-9])$/',
        ]);
        Log::info($validated);

        
        // $this->logger->info('debug', ['foo', $request->playlist]);

        return response()->json(200);
    }

}