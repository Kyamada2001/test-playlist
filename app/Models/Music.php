<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Album;
use App\Models\Artist;
use App\Models\AlbumTrack;

class Music extends Model
{
    protected $fillable = [
        "album_id",
        "artist_id",
        "name",
        "play_time_sec"
    ];

    public function albums()
    {
        return $this->hasMany(Album::class);
    }

    public function artists()
    {
        return $this->hasMany(Artist::class);
    }

    public function album_tracks()
    {
        return $this->belongsTo(AlbumTrack::class);
    }
}
