import React, { useRef, useEffect } from "react";

// TODO: validate
// TODO: アップしたフォルダ、ファイルを表示する機能
const PlayListCreate = () => {
    const directoryRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (directoryRef.current !== null) {
            directoryRef.current.setAttribute("directory", "");
            directoryRef.current.setAttribute("webkitdirectory", "");
        }
    }, [directoryRef]);

    const handleFileChange = (files: FileList | null) => {
        console.log(files);
    }

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