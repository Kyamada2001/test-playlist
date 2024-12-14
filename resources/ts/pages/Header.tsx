import React from "react";
import { Link } from "react-router-dom";
import env from "vite-plugin-env-compatible";

const Header = () => {
    return (
        // TODO: Laravelのconfigから取得する
        <div className="w-screen h-10 primary-color text-white font-bold flex items-center pl-5">{process.env.VITE_APP_NAME}</div>
    )
}

export default Header;