import React, { useState } from "react";

const SearchBar = ({ onSearch }) => {
    const [input, setInput] = useState(""); // Holds entire user input
    const [error, setError] = useState(""); // Stores validation error messages

    const handleSubmit = (e) => {
        e.preventDefault();

        // Split input into gamename and tagline
        const [gameName, tagLine] = input.split("#");
        if (!gameName || !tagLine) {
            setError("Please format as 'GameName#Tag'.");
            return;
        }

        // Validate gamename (3-16 alphanumeric chars)
        if (!/^[a-zA-Z0-9]{3,16}$/.test(gameName)) {
            setError("Game Name must be 3-16 alphanumeric characters.");
            return;
        }

        // Validate tagline (3-5 alphanumeric chars)
        if (!/^[a-zA-Z0-9]{3,5}$/.test(tagLine)) {
            setError("Tag must be 3-5 alphanumeric characters.");
            return;
        }

        setError("");
        onSearch(gameName, tagLine);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="GameName#TagLine"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default SearchBar;
