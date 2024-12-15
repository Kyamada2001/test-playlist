<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Album;
use App\Models\Artist;
use App\Models\AlbumMusicTrack;

class Music extends Model
{
    protected $fillable = [
        "artist_id",
        "name",
        "play_time_sec"
    ];

    public function artists()
    {
        return $this->belongsTo(Artist::class);
    }

    public function album_music_tracks()
    {
        return $this->hasOne(AlbumMusicTrack::class);
    }
}
