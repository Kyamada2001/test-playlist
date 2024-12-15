<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Album;
use App\Models\Artist;
use App\Models\AlbumMusicTrack;

class Music extends Model
{
    protected $fillable = [
        "album_id",
        "artist_id",
        "name",
        "play_time_sec"
    ];

    public function artists()
    {
        return $this->hasMany(Artist::class);
    }

    public function album_music_tracks()
    {
        return $this->belongsTo(AlbumMusicrack::class);
    }
}
