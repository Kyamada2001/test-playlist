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
        $search_params = $request["searchParams"];
        $album_query = Album::query();
        $artist_query = Artist::query();
        $music_query = Music::query();

        // アーティスト検索、取得
        if (!empty($search_params) && isset($search_params['artistName'])) {
            $search_artist = $search_params['artistName'];
            $artist_query->where('name', 'like', "%{$search_artist}%");
        }
        $artists = $artist_query->get();
        $artistIds = $artists->pluck('id');
        $music_query->whereIn('artist_id', $artistIds);

        // 頭文字検索
        if (!empty($search_params) && isset($search_params['firstChar'])) {
            $music_query->whereRaw('SUBSTRING(name, 1, 1) = ?', $search_params['firstChar']);
        }

        // アルバム検索
        if (!empty($search_params) && isset($search_params['albumName'])) {
            $search_album = $search_params['albumName'];
            $music_query
            ->join('album_music_tracks', 'music.id', '=', 'album_music_tracks.music_id') // 中間テーブルとの結合
            ->join('albums', 'album_music_tracks.album_id', '=', 'albums.id')     // albums との結合
            ->where('albums.name', 'like',"%{$search_album}%");
        }

        $albums = $album_query->get();
        $music = $music_query->with('album_music_tracks')->get();
        
        
        return response()->json([
            'albums' => $albums,
            'artists' => $artists,
            'music' => $music,
        ], 200);
    }
}