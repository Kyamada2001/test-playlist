<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PlaylistController extends Controller
{
    public function store (Request $request) 
    {
        $request->playlist;
        logger($request->playlist);

        return response()->json(200);
    }

}