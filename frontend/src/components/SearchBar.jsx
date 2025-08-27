import React, { useState } from "react"
import { LuUserRoundSearch } from "react-icons/lu"
import "./SearchBar.css"

const SearchBar = ({ placeholder, onSubmit }) => {
    const [input, setInput] = useState("")

    const handleSubmit = (e) => {
        e.preventDefault()
        const [region, rest] = input.split('/')
        const [gameName, tagLine] = rest.split("#")
        if(!region || !gameName || !tagLine) {
            /* TODO: display an error */
            return;
        }
        onSubmit(region.trim(), gameName.trim(), tagLine.trim())
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