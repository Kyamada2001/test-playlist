import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const PlayListIndex = () => {
    type AlbumType = {
        name: string,
        created_at?: TimeRanges,
        updated_at?: TimeRanges,
        deleted_at?: TimeRanges | null,
        // album_tracks?: Array<AlbumTrackType>,
    }
    type ArtistType =  {
        name: string,
        created_at?: TimeRanges,
        updated_at?: TimeRanges,
        deleted_at?: TimeRanges | null,
    }
    type MusicType =  {
        album_id: number,
        artist_id: number,
        name: string,
        play_time_sec: number,
        created_at?: TimeRanges,
        updated_at?: TimeRanges,
        deleted_at?: TimeRanges | null,
    }

    const [albums, setAlbums] = useState();
    const [artists, setArtists] = useState();
    
    const fetchPlaylistData = async () => {
        const fetchSuccess = (res: any) => {
            console.log(res)
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
        <div>
            <div className="flex-row">
                <label>プレイリスト</label>
                <button type="button" className="btn primary-color">
                    <Link to="/create">新規登録</Link>
                </button>
            </div>
            {/* <div>
                <ul>
                    <li className="flex flex-row">
                        <div>

                        </div>
                    </li>
                </ul>
            </div> */}
        </div>
    )
}

export default PlayListIndex;