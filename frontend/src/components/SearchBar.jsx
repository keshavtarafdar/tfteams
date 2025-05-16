import React, { useState } from "react"

import { LuUserRoundSearch } from "react-icons/lu"
import "./SearchBar.css"

const SearchBar = () => {
    const [input, setInput] = useState("")

    return (
        <div className="input-wrapper">
            <LuUserRoundSearch id="search-icon" />
            <input className="search-box" 
                value={input} 
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
}

export default SearchBar