import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

    type AlbumType = {
    id?: number,
        name: string,
        created_at?: TimeRanges,
        updated_at?: TimeRanges,
        deleted_at?: TimeRanges | null,
    album_music_tracks?: AlbumMusicTrack[],
}
type AlbumMusicTrack = {
    id?: number,
    album_id: number,
    music_id: number,
    track_index: number,
    created_at?: TimeRanges,
    updated_at?: TimeRanges,
    deleted_at?: TimeRanges | null,
    music: MusicType
    }
    type ArtistType =  {
    id?: number,
        name: string,
        created_at?: TimeRanges,
        updated_at?: TimeRanges,
        deleted_at?: TimeRanges | null,
    }
    type MusicType =  {
    id?: number,
        album_id: number,
        artist_id: number,
        name: string,
        play_time_sec: number,
        created_at?: TimeRanges,
        updated_at?: TimeRanges,
        deleted_at?: TimeRanges | null,
    }


const PlayListIndex = () => {
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [artists, setArtists] = useState<ArtistType[]>([]);
    
    const fetchPlaylistData = async ({searchParams = {}}) => {
        const fetchSuccess = (res: { data: { albums: AlbumType[], artists: ArtistType[]}}) => {
            setAlbums(res.data.albums);
            setArtists(res.data.albums);
        }

        const fetchError = (e: any) => {
            alert(e);
        }
        const res = await axios.get(
            '/api/playlist/index', 
            { headers: {'content-type': 'multipart/form-data'} }
        ).then((res) => fetchSuccess(res))
         .catch((e) => fetchError(e));
    }

    useEffect(() => {
        fetchPlaylistData();   
    })

    return (
        <div className="space-y-5">
            <div className="flex flex-row justify-between">
                <h3 className="title">プレイリスト</h3>
                <button type="button" className="btn primary-color">
                    <Link to="/create">新規登録</Link>
                </button>
            </div>
            <div className="space-y-5">
                <div>
                    <SortForm 
                        albums={{albums}}
                        artists={{artists}}
                        handleSearch={{handleSearch}}
                    />
                </div>
                <div>
                    <label className="text-2xl font-semibold">プレイリスト</label>
                    <div className="space-y-4">
                    {
                        albums.map((album: AlbumType) => {
                            return (
                        <div>
                                    <div className="text-xl font-medium">アルバム名：{album.name}</div>
                                    <ul className="space-y-2">
                                    {
                                        album.album_music_tracks?.length === 0 ? null :
                                        album.album_music_tracks!.map((track) => {
                                            return (
                                                <li className="flex jusitify-between w-full border-b border-gray-400">
                                                    <div className="flex flex-row w-full">
                                                        <div className="p-4 text-lg">{track.track_index}</div>
                                                        <div className="">
                                                            <div className="font-medium text-lg">{track.music.name}</div>
                                                            <div className="text-sm">{returnArtistName(artists, track.music.artist_id)}</div>
                                                        </div>
                        </div>
                                                    <div className="w-auto">{secToTime(track.music.play_time_sec)}</div>
                    </li>
                                            )
                                        })
                                    }
                </ul>
                                </div>
                            )
                        })
                    }
                    </div>
                </div>
            </div>
        </div>
    )
}

const returnArtistName = (artists: ArtistType[], artistId: number | string) => {
    if (!artistId) return "";
    if (typeof artistId === "string") parseInt(artistId);
    const artistInfo = artists.find((artist) => artist.id === artistId);
    return artistInfo?.name;

}
const secToTime = (sec: number) => {
    const minute: number = Math.floor(sec / 60);
    const seconds = sec % 60;
    return minute + ":" + seconds.toString().padStart(2, '0');
}
const SortForm: React.ElementType = ({albums, artists}) => {
    const [artistName, setArtistName] = useState<string>("");
    const [musicName, setMusicName] = useState<string>("");

    return (
        <div className="border border-gray-300 p-4">
            <h3 className="text-2xl font-semibold">検索</h3>
            <div className="space-y-3">
                <div className="space-x-4">
                    <label>アーティスト名</label>
                    <input
                        onChange={(result) => setArtistName(result.target.value)}
                        className="input-text"
                    />
                </div>
                <div className="space-x-4">
                    <label>ミュージック名</label>
                    <input
                        onChange={(result) => setMusicName(result.target.value)} 
                        className="input-text"
                    />
                </div>
            </div>
            <div className="flex justify-center ">
                <button className="btn primary-color">検索する</button>
            </div>
        </div>
    );
}


export default PlayListIndex;