<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Music;
use App\Models\Album;

class AlbumMusicTrack extends Model
{
    protected $fillable = [
        "album_id",
        "music_id",
        "track_index",
    ];

    public function albums()
    {
        return $this->belongsTo(Album::class);
    }

    public function music()
    {
        return $this->belongsTo(Music::class);
    }
}
