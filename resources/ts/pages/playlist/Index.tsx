import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";

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
    album_music_tracks?: AlbumMusicTrack
}

type SearchParams = {
    artistName: string,
    albumName: string,
}


const PlayListIndex: React.FC = () => {
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [artists, setArtists] = useState<ArtistType[]>([]);
    const [music, setMusic] = useState<MusicType[]>([]);
    
    const fetchPlaylistData = async (searchParams : SearchParams | null) => {
        const fetchSuccess = (res: { data: { albums: AlbumType[], artists: ArtistType[],music: MusicType[]}}) => {
            setAlbums(res.data.albums);
            setArtists(res.data.artists);
            setMusic(res.data.music);
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
    const handleSearch = (searchParams: SearchParams) => {
        fetchPlaylistData(searchParams);
    }
    const handleSortTime = (status: "up" | "down") => {
        
        const sortMusic = [...music]; 
        if (status === "up") sortMusic.sort((a,b) => b.play_time_sec - a.play_time_sec) // 昇順
        if (status === "down") sortMusic.sort((a,b) =>  a.play_time_sec - b.play_time_sec) // 降順
        setMusic(sortMusic);
    }
    const handleSortTrack = (status: "up" | "down") => {
        console.log(status)
        const sortMusic = [...music]; 
        const order = status === "up" ? -1 : 1;
        sortMusic.sort((a,b) => {
            if (b.album_id !== a.album_id) {
                // Comment：申し訳ありません。downの時の挙動がおかしくなります。
                return (b.album_id - a.album_id) * order;
            } else {
                // 同じ album_id の場合、track_index を昇順でソート
                return (a.album_music_tracks!.track_index - b.album_music_tracks!.track_index) * order;
            }
        })
        setMusic(sortMusic);
    }

    useEffect(() => {
        fetchPlaylistData(null); 
    },[]) 
    return (
        <div className="space-y-5">
            <div className="flex flex-row justify-between">
                <h3 className="title">プレイリスト一覧</h3>
                <button type="button" className="btn primary-color">
                    <Link to="/create">新規登録</Link>
                </button>
            </div>
            <div className="space-y-5">
                <SearchForm
                    handleSearch={handleSearch}
                />
                <div>
                    <label className="text-2xl font-semibold">プレイリスト</label>
                    <div className="space-y-4">
                    <table className="table w-full overflow-x-scroll">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr >
                                <td className="px-3 py-3 w-10">
                                    <span>演奏順</span>
                                    <Sort keyPrefix={"track"} handleSort={handleSortTrack}/>
                                </td>
                                <td className="px-3 py-3">アルバム名</td>
                                <td className="px-3 py-3">アーティスト名</td>
                                <td className="px-3 py-3">ミュージック名</td>
                                <td className="px-3 py-3 w-26 flex items-center space-x-1">
                                    <span>演奏時間</span>
                                    <Sort keyPrefix={"time"} handleSort={handleSortTime}/>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            music.length > 0 ? music.map((musicVal: MusicType) => {
                                return (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                                        <td className="px-3 py-3">{musicVal.album_music_tracks!.album_id}-{musicVal.album_music_tracks!.track_index}</td>
                                        <td className="px-3 py-3">{returnAlbumName(albums, musicVal.album_music_tracks?.album_id!)}</td>
                                        <td className="px-3 py-3">{returnArtistName(artists, musicVal.artist_id)}</td>
                                        <td className="px-3 py-3">{musicVal.name}</td>
                                        <td className="px-3 py-3">{secToTime(musicVal.play_time_sec)}</td>
                                    </tr>
                                )
                            }): null
                        }
                        </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Sort: React.ElementType = ({handleSort, keyPrefix}) => {
    const sortSortStatus = (status: "up" | "down") => {
        handleSort(status);
    };

    return (                               
        <span>
            <button key={`${keyPrefix}-up`} onClick={() => sortSortStatus("up")}><FaChevronUp/></button>
            <button key={`${keyPrefix}-down`} onClick={() => sortSortStatus("down")}><FaChevronDown/></button>
        </span>
    )
}

const SearchForm: React.ElementType = ({handleSearch}) => {
    const [artistName, setArtistName] = useState<string>("");
    const [albumName, setAlbumName] = useState<string>("");

    const submitSearch = () => {
        const searchParams = {
            artistName,
            albumName
        };
        handleSearch(searchParams);
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

const returnAlbumName = (albums: AlbumType[], albumId: number | string) => {
    if (!albumId) return "";
    if (typeof albumId === "string") parseInt(albumId);
    const artistInfo = albums.find((album) => album.id === albumId);
    return artistInfo?.name;

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


export default PlayListIndex;