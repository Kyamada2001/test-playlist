import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { FaChevronUp } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { hiragana, alphabet } from "../../const";

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

type SearchParamsType = {
    artistName: string,
    albumName: string,
    firstChar: string | null,
}

type SortStatusType = "up" | "down"
type IsNameSortType = boolean


const PlayListIndex: React.FC = () => {
    const [albums, setAlbums] = useState<AlbumType[]>([]);
    const [artists, setArtists] = useState<ArtistType[]>([]);
    const [music, setMusic] = useState<MusicType[]>([]);
    
    const fetchPlaylistData = async (searchParams : SearchParamsType | null) => {
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
    const sortMusic = (status: SortStatusType, sortAlbum: AlbumType[]) => {
        const sortMusic = [...music]; 
        const order = status === "up" ? -1 : 1;
        sortMusic.sort((a,b) => {
            // アルバムを元にソート
            const albumIdA = a.album_music_tracks!.album_id;
            const albumIdB = b.album_music_tracks!.album_id;
            const albumIndexA = sortAlbum.findIndex((album) => album.id === albumIdA);
            const albumIndexB = sortAlbum.findIndex((album) => album.id === albumIdB);
            // 違うアルバムの場合、albumのindexをソート
            if (albumIdB !== albumIdA) {
                // アルバムは、すでにソートされてるためorderは乗算しない
                return albumIndexA - albumIndexB;
            } else {
                // 同じアルバムの場合、track_indexをソート
                return (a.album_music_tracks!.track_index - b.album_music_tracks!.track_index) * order;
            }
        });
        return sortMusic;
    }
    const sortAlbum = (status: SortStatusType, isNameSort: IsNameSortType) => {
        let sortAlbums = [...albums];
        const order = status === "up" ? -1 : 1;

        if(isNameSort) {
            sortAlbums.sort((a,b) => {
                // 日本語と英語を判別
                const isEnglishA = /^[a-zA-Z0-9]/.test(a.name);
                const isEnglishB = /^[a-zA-Z0-9]/.test(b.name);
                const isSymbolA = /^[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/.test(a.name);
                const isSymbolB = /^[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/.test(b.name);

                // 記号が比較対象の場合
                if (isSymbolA || isSymbolB) return a.name.localeCompare(b.name) * -1 * order;
                // 両方日本語または両方英語の場合
                if (isEnglishA === isEnglishB) return a.name.localeCompare(b.name) * order;
                // aが日本語、bが英語の場合
                if (!isEnglishA && isEnglishB) return order;
                // aが英語、bが日本語の場合
                return order * -1;
            })
        } else {
            // アルバムをidでソート
            sortAlbums.sort((a,b) => (a.id! - b.id!) * order);
        }
        return sortAlbums;
    }
    const handleSearch = (searchParams: SearchParamsType) => {
        fetchPlaylistData(searchParams);
    }
    const handleSortTime = (status: SortStatusType) => {      
        const sortMusic = [...music]; 
        if (status === "up") sortMusic.sort((a,b) => b.play_time_sec - a.play_time_sec); // 昇順
        if (status === "down") sortMusic.sort((a,b) =>  a.play_time_sec - b.play_time_sec); // 降順
        setMusic(sortMusic);
    }
    const handleIndexOrAlbum = (status: "up" | "down", isNameSort: IsNameSortType = false) => {
        const sortedAlbum = sortAlbum(status, isNameSort);
        const sortedMusic = sortMusic(status, sortedAlbum);
        setMusic(sortedMusic);
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
                            <tr>
                                <td className="px-3 py-3 w-26">
                                    <Sort  title={"演奏順"} keyPrefix={"track"} handleSort={handleIndexOrAlbum}/>
                                </td>
                                <td className="px-3 py-3 w-48">
                                    <Sort title={"アルバム名"} keyPrefix={"album"} handleSort={(props: "up" | "down") => handleIndexOrAlbum(props, true)}/>
                                </td>
                                <td className="px-3 py-3">アーティスト名</td>
                                <td className="px-3 py-3">ミュージック名</td>
                                <td className="px-3 py-3 w-26 space-x-1">
                                    <Sort  title={"演奏時間"} keyPrefix={"time"} handleSort={handleSortTime}/>
                                </td>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            music.length > 0 ? music.map((musicVal: MusicType) => {
                                return (
                                    <tr className="dark:text-white bg-white border-b dark:bg-gray-800 dark:border-gray-700">
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

const Sort: React.ElementType = ({title, handleSort, keyPrefix}) => {
    const sortSortStatus = (status: "up" | "down") => {
        handleSort(status);
    };

    return (    
        <div className="flex items-center space-x-2">
            <span>{title}</span>
            <span className="flex flex-col">
                <button key={`${keyPrefix}-up`} onClick={() => sortSortStatus("up")}><FaChevronUp/></button>
                <button key={`${keyPrefix}-down`} onClick={() => sortSortStatus("down")}><FaChevronDown/></button>
            </span>
        </div> 
    )
}

const SearchForm: React.ElementType = ({handleSearch}) => {
    const [artistName, setArtistName] = useState<string>("");
    const [albumName, setAlbumName] = useState<string>("");
    const [firstChar, setFirstChar] = useState<string | null>(null);
    const characters = [...hiragana, ...alphabet];

    const handleClickChar = (char: string) => {
        setFirstChar(char);
    }

    const clearSearch = () => {
        setArtistName("");
        setAlbumName("");
        setFirstChar("");
    }
    const submitSearch = () => {
        const searchParams: SearchParamsType = {
            artistName,
            albumName,
            firstChar,
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
                        value={albumName}
                        onChange={(result) => setAlbumName(result.target.value)} 
                        className="input-text"
                    />
                </div>
                <div className="space-x-4">
                    <label>アーティスト名</label>
                    <input
                        value={artistName}
                        onChange={(result) => setArtistName(result.target.value)}
                        className="input-text"
                    />
                </div>
                <div>
                    <label>ミュージック名の頭文字</label>
                    <ul className="p-2 text-black flex flex-wrap space-x-3 cursor-pointer">
                        {
                            characters.map((char) => {
                                return (
                                    <button className={firstChar === char ? "text-orange-600" : ""} onClick={() => handleClickChar(char)}>{char}</button>
                                )
                            })
                        }
                    </ul>
                </div>
            </div>
            <div className="flex justify-center space-x-3">
                <button onClick={clearSearch} className="btn primary-color">クリアする</button>
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