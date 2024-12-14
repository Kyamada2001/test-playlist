import React, { useRef, useEffect, useState } from "react";

// TODO: validate
// TODO: アップしたフォルダ、ファイルを表示する機能
// エラーハンドリング

const PlayListCreate = () => {
    const directoryRef = useRef<HTMLInputElement>(null);
    const [albumName, setAlbumName] = useState<string>("")
    const [musicNames, setMusicNames] = useState<string[]>([])

    useEffect(() => {
        if (directoryRef.current !== null) {
            directoryRef.current.setAttribute("directory", "");
            directoryRef.current.setAttribute("webkitdirectory", "");
        }
    }, [directoryRef]);

    const handleFileChange = (files: FileList | null) => {
        // TODO: 環境によって、入力値に違いが出ないか確認
        if ( files == null ) return;
        let tmpMusicNames = [];
        const folderNameIndex = 0; // 以下で使用する変数のsplitPathのフォルダー名の位置
        const fileNameIndex = 1; // 以下で使用する変数のsplitPathのファイル名の位置

        for (let i = 0; i < files.length; i++) {
            const file: File = files[i]
            const path: string = file.webkitRelativePath;
            const splitPath: Array<string> | null = path.split('/'); /* 例: folderName/file.tsv */

            if (splitPath == null || splitPath.length == 0) return;

            // フォルダー名を取得
            if (i === 0) setAlbumName(splitPath[folderNameIndex])

            // ファイル名を格納
            const fileName: string = splitPath[fileNameIndex]
            const musicName = fileName.replace(".tsv", "")
            tmpMusicNames[i] = musicName
        }

        setMusicNames(tmpMusicNames)
    }

    useEffect(() => {
        if (!albumName || !musicNames) return;
        console.log(albumName)
        console.log(musicNames)
    },[musicNames, albumName])

    return (
        <input
            accept=""
            multiple
            type="file"

            ref={directoryRef}
            onChange={(e) => { handleFileChange(e.currentTarget.files); }}
        />
    )
}

export default PlayListCreate;