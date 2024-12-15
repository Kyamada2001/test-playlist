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

type SearchParams = {
    artistName: string,
    albumName: string,
}


const PlayListIndex: React.FC = () => {
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [artists, setArtists] = useState<ArtistType[]>([]);
    
    const fetchPlaylistData = async (searchParams : SearchParams | null) => {
        const fetchSuccess = (res: { data: { albums: AlbumType[], artists: ArtistType[]}}) => {
            setAlbums(res.data.albums);
            setArtists(res.data.artists);
            console.log(res.data);
        }

        const fetchError = (e: any) => {
            alert(e);
        }
        const res = await axios.get(
            '/api/playlist/index', 
            { params: { searchParams: searchParams ?? searchParams }},
        ).then((res) => fetchSuccess(res))
         .catch((e) => fetchError(e));
    }
    const handleSearch = async (searchParams: SearchParams) => {
        console.log("検索")
        fetchPlaylistData(searchParams);
    }

    useEffect(() => {
        fetchPlaylistData(null); 
    },[]) 
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
                        // albums={{albums}}
                        // artists={{artists}}
                        handleSearch={handleSearch}
                    />
                </div>
                <div>
                    <label className="text-2xl font-semibold">プレイリスト</label>
                    <div className="space-y-4">
                    <table className="table">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr >
                                <td className="px-6 py-3 w-10">演奏順</td>
                                <td className="px-6 py-3">アルバム名</td>
                                <td className="px-6 py-3">アーティスト名</td>
                                <td className="px-6 py-3">ミュージック名</td>
                                <td className="px-6 py-3">演奏時間</td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            albums.length > 0 ? albums.map((album: AlbumType) => {
                                return (
                                    !album.album_music_tracks || album.album_music_tracks?.length === 0 ? null :
                                    album.album_music_tracks!.map((track) => {
                                        if(track.music === null) return;
                                        return (
                                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                                <td className="px-6 py-3">{album.id}-{track.track_index}</td>
                                                <td className="px-6 py-3">{album.name}</td>
                                                <td className="px-6 py-3">{returnArtistName(artists, track.music.artist_id)}</td>
                                                <td className="px-6 py-3">{track.music.name}</td>
                                                <td className="px-6 py-3">{secToTime(track.music.play_time_sec)}</td>
                                            </tr>
                                        )
                                    })
                                )
                            }) : null
                        }
                        </tbody>
                        </table>
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
const SortForm: React.ElementType = ({handleSearch}) => {
    const [artistName, setArtistName] = useState<string>("");
    const [albumName, setAlbumName] = useState<string>("");

    const submitSearch = () => {
        const searchParams = {
            artistName,
            albumName
        }
        handleSearch(searchParams)
    }

    return (
        <div className="border border-gray-300 p-4">
            <h3 className="text-2xl font-semibold">検索</h3>
            <div className="space-y-3">
                <div className="space-x-4">
                    <label>アルバム名</label>
                    <input
                        onChange={(result) => setAlbumName(result.target.value)} 
                        className="input-text"
                    />
                </div>
                <div className="space-x-4">
                    <label>アーティスト名</label>
                    <input
                        onChange={(result) => setArtistName(result.target.value)}
                        className="input-text"
                    />
                </div>
            </div>
            <div className="flex justify-center ">
                <button onClick={submitSearch} className="btn primary-color">検索する</button>
            </div>
        </div>
    );
}


export default PlayListIndex;