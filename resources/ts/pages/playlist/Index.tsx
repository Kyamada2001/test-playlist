import React from "react";
import { Link } from "react-router-dom";

const PlayListIndex = () => {
    return (
        <div>
            <button type="button" className="btn primary-color">
                <Link to="/create">新規登録</Link>
            </button>
        </div>
    )
}

export default PlayListIndex;