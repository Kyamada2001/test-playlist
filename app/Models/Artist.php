<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\Music;
use App\Models\AlbumMusicTrack;

class Artist extends Model
{
    protected $fillable = [
        "name"
    ];

    public function music()
    {
        return $this->hasMany(Music::class);
    }
}
