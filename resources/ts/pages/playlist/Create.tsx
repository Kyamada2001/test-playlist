import React, { useRef, useEffect, useState } from "react";
import axios from 'axios';

// TODO: validate
// TODO: アップしたフォルダ、ファイルを表示する機能
// エラーハンドリング

const PlayListCreate = () => {
    // 型定義
    type playlistType = AlbumType[]

    type AlbumType = {
        albumName: string,
        musics: MusicType[]
    }

    type MusicType = {
        musicName: string,
        artistName: string,
        musicTime: string,
    }

    // 変数定義
    const directoryRef = useRef<HTMLInputElement | null>(null);
    const [playlist, setPlaylist] = useState<playlistType | null>(null)

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
        const fileInfo: string = await fetchAsText(tsvFile)
        const splitMusicInfo: string[] = fileInfo.split("\n")
        
        const tmpMusics: MusicType[] = splitMusicInfo.map((splitAlbum: string) => {
            // ミュージック情報を取得
            const splitMusicInfo: string[] = splitAlbum.split("\t")
            const tmpMusicInfo: MusicType = {
                musicName: splitMusicInfo[0] as string,
                artistName: splitMusicInfo[1] as string,
                musicTime: splitMusicInfo[2] as string
            }
            return tmpMusicInfo
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
                const file: File = files[i]
                const path: string = file.webkitRelativePath;
                const splitPath: Array<string> | null = path.split('/'); /* 例: folderName/file.tsv */

                // 取得できない場合はエラー
                if (splitPath == null || splitPath.length == 0) throw new Error("アルバムを取得できませんでした");

                // アルバム名を取得
                const fileName: string = splitPath[fileNameIndex]
                const tmpAlbumName: string = fileName.replace(".tsv", "")

                // 曲情報を取得
                const tmpMusics: MusicType[] = await fetchMusics(file)

                tmpPlaylist[i] = {
                    albumName: tmpAlbumName,
                    musics: tmpMusics,
                }
            }
            setPlaylist(tmpPlaylist)
        } catch (e) {
            // TODO: エラーハンドリング
        }
    }

    const submit = async (data: playlistType) => {
        if (!data) return;
        
        const res = await axios.post('/api/playlist/store', data).then((res) => {
            return res.data
        }).catch((e: any) => {
        });
        console.log(res)
    }

    // 実行処理
    return (
        <div className="space-y-5">
            <h1 className="font-bold">プレイリスト登録</h1>
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
                className="btn-primary"
            >
                登録
            </button>
            <div>
                <label>読み取り結果</label>
                {
                    !playlist ? null 
                        : playlist.map((album: AlbumType) => {
                            return (
                                <div>
                                    <label>アルバム名：{album.albumName}</label>
                                    <ul>
                                        {
                                            album.musics.map((music: MusicType) => {
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