import React, { useState } from "react"
import { LuUserRoundSearch } from "react-icons/lu"
import "./SearchBar.css"

const SearchBar = ({ placeholder, onSubmit }) => {
    const [input, setInput] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        const [gameName, tagLine] = input.split("#")
        if(!gameName || !tagLine) {
            /* TODO: display an error */
            return;
        }
        onSubmit(gameName.trim(), tagLine.trim())
    };

    return (
        <form className="input-wrapper" onSubmit={handleSubmit}>
            <LuUserRoundSearch id="search-icon" />
            <input
                className="search-box"
                placeholder={placeholder}
                value={input} 
                onChange={(e) => setInput(e.target.value)}
            />
        </form>
    );
}

export default SearchBar