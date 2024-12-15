import React, { useRef, useEffect, useState } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { API_STATUS_CODE, MESSAGES } from "../../const";

// TODO: validate
// TODO: アップしたフォルダ、ファイルを表示する機能
// エラーハンドリング

const PlayListCreate = () => {
    // 型定義
    type playlistType = AlbumType[]

    type AlbumType = {
        albumName: string,
        music: MusicType[]
    }

    type MusicType = {
        trackIndex: number,
        musicName: string,
        artistName: string,
        musicTime: string,
    }

    // 変数定義
    const navigate = useNavigate();
    const directoryRef = useRef<HTMLInputElement | null>(null);
    const [playlist, setPlaylist] = useState<playlistType | null>(null);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // 関数定義
    useEffect(() => {
        if (directoryRef.current !== null) {
            directoryRef.current.setAttribute("directory", "");
            directoryRef.current.setAttribute("webkitdirectory", "");
        }
    }, [directoryRef]);

    const fetchAsText = (file: File) => {
        return new Promise((resolve) => {
          var fr = new FileReader();
          fr.onload = (e: any) => {
            // 読み込んだ結果を resolve する
            resolve(e.currentTarget.result);
          };
          // 読み込む
          fr.readAsText(file);
        }).then((result) => {
            return result as string;
        });
    };

    // tsvファイルからミュージック情報を取得
    const fetchMusics = async (tsvFile: File) => {
        const fileInfo: string = await fetchAsText(tsvFile);
        const splitMusicInfo: string[] = fileInfo.split("\n");
        const lastIndex = splitMusicInfo.length - 1;

        const tmpMusics: MusicType[] = splitMusicInfo.flatMap((splitAlbum: string, index: number) => {
            // tsvファイルの最終行が空になる場合は、空を返す
            if (lastIndex === index && splitAlbum.length === 0 ) return [];

            // ミュージック情報を取得
            const splitMusicInfo: string[] = splitAlbum.split("\t");
            const tmpMusicInfo: MusicType = {
                trackIndex: index + 1,
                musicName: splitMusicInfo[0] as string,
                artistName: splitMusicInfo[1] as string,
                musicTime: splitMusicInfo[2] as string
            };
            return tmpMusicInfo;
        })
        return tmpMusics;
    } 

    const handleFileChange = async (files: FileList | null) => {
        try { 
            // TODO: 環境によって、入力値に違いが出ないか確認
            if ( files == null ) return;

            let tmpPlaylist: playlistType | [] = [];
            const fileNameIndex = 1; // 以下で使用する変数のsplitPathのファイル名の位置　例: folderName/file.tsv

            for (let i = 0; i < files.length; i++) {
                const file: File = files[i];
                const path: string = file.webkitRelativePath;
                const splitPath: Array<string> | null = path.split('/'); /* 例: folderName/file.tsv */

                // 取得できない場合はエラー
                if (splitPath == null || splitPath.length == 0) throw new Error("アルバムを取得できませんでした");

                // アルバム名を取得
                const fileName: string = splitPath[fileNameIndex];
                const tmpAlbumName: string = fileName.replace(".tsv", "");

                // 曲情報を取得
                const tmpMusics: MusicType[] = await fetchMusics(file);

                tmpPlaylist[i] = {
                    albumName: tmpAlbumName,
                    music: tmpMusics,
                };
            }
            setPlaylist(tmpPlaylist);
        } catch (e) {
            // TODO: エラーハンドリング
        }
    }

    const submit = async (data: playlistType) => {
        // TODO: エラーメッセージを、統合的に管理できるように集約する必要あり
        // Laravelからのエラーをメッセージ化
        const validateMessage = (e: { errors: Object, message: string }) => {
            function isNumeric(value: string) {
                return /^[0-9]+$/.test(value);
            }
            
            const errorKeys: string[] = Object.keys(e.errors);
            const errorMessages: string[] = errorKeys.map((errorKey) => {
                if (!errorKey) return ""
                const splitError = errorKey.split(".");
                const lastIndex = splitError.length - 1;

                const errorMessage = splitError.reduce((acc, curr, index, array) => {
                    if (isNumeric(curr)) {
                        if (splitError[index-1] == "playlist") acc += `${playlist![parseInt(curr)].albumName}`;
                        if (splitError[index-1] == "music") acc += `${curr}行目の`;
                    } else {
                        if (curr == "trackIndex") acc += `演奏順番が`;
                        if (curr == "musicName") acc += `音楽名が`;
                        if (curr == "artistName") acc += `アーティスト名が`;
                        if (curr == "musicTime") acc += `演奏時間が`;
                    }
                    if (lastIndex === index) acc += "エラーです。";
                    return acc
                }, "")
                return errorMessage;
            })
            return errorMessages;
        }
        const storeSuccess = () => {
            setErrorMessages([]);
            alert(MESSAGES.SUCCESS);
            navigate("/");
        }
        const storeError = (e: any) => {
            if (e.status === API_STATUS_CODE.UNPROCESSABLE) {
                const errorMessages = validateMessage(e.response.data);
                setErrorMessages(errorMessages);
            } else {
                setErrorMessages([MESSAGES.SERVER_ERROR])
            }
        }

        if (!data) return;
        setLoading(true);
        const res = await axios.post(
            '/api/playlist/store', 
            { playlist: data },
            { headers: {'content-type': 'multipart/form-data'} }
        ).then((res) => storeSuccess())
         .catch((e) => storeError(e));
         setLoading(false);
    }

    // 実行処理
    return (
        <div className="space-y-5">
            <h3 className="title">プレイリスト登録</h3>
            <div className="flex flex-col">
                <label>プレイリストをアップロード</label>
                <input
                    accept=""
                    multiple
                    type="file"
                    ref={directoryRef}
                    onChange={(e) => { handleFileChange(e.currentTarget.files); }}
                />
            </div>
            <button 
                type="button" 
                onClick={() => submit(playlist!)}
                className={`btn ${loading ? "bg-gray-500" : "primary-color"}`}
            >
                登録
            </button>
            <div>
                <label>読み取り結果</label>
                {
                    errorMessages.length === 0 ? null
                        : errorMessages.map((errorMessage) => {
                            return (
                                <div className="text-red-500">{errorMessage}</div>
                            )
                        })
                }
                {
                    !playlist ? null 
                        : playlist.map((album: AlbumType) => {
                            return (
                                <div>
                                    <label>アルバム名：{album.albumName}</label>
                                    <ul>
                                        {
                                            album.music.map((music: MusicType) => {
                                                return (
                                                    <div className="ml-5 mb-5">
                                                        <li>曲名：{music.musicName}</li>
                                                        <li>アーティスト名：{music.artistName}</li>
                                                        <li>演奏時間：{music.musicTime}</li>
                                                    </div>
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
    )
}

export default PlayListCreate;