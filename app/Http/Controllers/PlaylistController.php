<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Album;
use App\Models\Artist;
use App\Models\Music;
use App\Models\AlbumMusicTrack;

class PlaylistController extends Controller
{

    protected function timeToNum ($strTime) 
    {
        // H:i→ssに変換
        $splitTime = explode(':', $strTime, 2);
        $minutes = intval($splitTime[0]);
        $second = intval($splitTime[1]);

        $numTime = $minutes * 60 + $second;
        return $numTime;
    }
    
    public function store (Request $request) 
    {
        $data = $request->data;

        $validated = $request->validate([
            'playlist' => 'required|array',
            'playlist.*.albumName' => 'required|string',
            'playlist.*.music' => 'required|array',
            'playlist.*.music.*.trackIndex' => 'required|integer',
            'playlist.*.music.*.musicName' => 'required|string',
            'playlist.*.music.*.artistName' => 'required|string',
            'playlist.*.music.*.musicTime' => 'required|regex:/^([0-9]{1,3}):([0-5][0-9])$/',
        ]);

        DB::beginTransaction();  
        try { 
            foreach ($validated["playlist"] as $albumData) {
                Log::info($albumData);
                $album = new Album();

                $album->name = $albumData["albumName"];
                $album->save();

                foreach($albumData["music"] as $musicData) {
                    $music = new Music();
                    $album_music_track = new AlbumMusicTrack();

                    $artistName = $musicData["artistName"];
                    $artist = Artist::firstOrCreate(['name' => $artistName]);

                    $music->name = $musicData["musicName"];
                    $music->artist_id = $artist->id;
                    $music->play_time_sec = $this->timeToNum($musicData["musicTime"]);
                    $music->save();

                    $album_music_track->album_id = $album->id;
                    $album_music_track->music_id = $music->id;
                    $album_music_track->track_index = $musicData["trackIndex"];
                    $album_music_track->save();

                }
            }
        } catch (Exception $e) {
            DB::rollback();
            Log::info('error', ['playlist_store_error', $validated]);
            return response()->json(500);
        }
        DB::commit();
        return response()->json(200);
    }

    public function index (Request $request) 
    {
        $albums = Album::with('album_music_tracks.music')->get();
        $artists = Artist::get();
        Log::info($albums);

        return response()->json([
            'albums' => $albums,
            'artists' => $artists,
        ], 200);
    }
}