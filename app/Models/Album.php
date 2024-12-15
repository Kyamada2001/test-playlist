<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Music;
use App\Models\AlbumMusicTrack;

class Album extends Model
{
    protected $fillable = [
        "name"
    ];

    public function album_music_tracks()
    {
        return $this->belongsTo(ArbumMusicTrack::class);
    }
}
