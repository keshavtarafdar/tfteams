import React from "react"

import { LuUserRoundSearch } from "react-icons/lu"
import "./SearchBar.css"

const SearchBar = () => {
    return (
        <div className="input-wrapper">
            <LuUserRoundSearch id="search-icon" />
            <input className="search-box" placeholder="Summoner Name" />
        </div>
    );
}

export default SearchBar