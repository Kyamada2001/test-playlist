import React from "react";
import { Link } from "react-router-dom";

const PlayListIndex = () => {
    return (
        // TODO: Laravelのconfigから取得する
        <div className="w-screen h-10">{process.env.VITE_APP_NAME}</div>
    )
}

export default PlayListIndex;