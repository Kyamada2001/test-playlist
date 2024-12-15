<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Music;
use App\Models\AlbumTrack;

class Album extends Model
{
    protected $fillable = [
        "name"
    ];

    public function music()
    {
        return $this->belongsTo(Music::class);
    }

    public function album_tracks()
    {
        return $this->belongsTo(ArbumTrack::class);
    }
}
