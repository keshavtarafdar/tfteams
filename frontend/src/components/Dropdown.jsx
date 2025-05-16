import React, { useState } from "react"

import { IoMdArrowDropdown } from "react-icons/io"
import "./Dropdown.css"

const Dropdown = () => {
    return (
        <div className="drop-wrapper">
            <IoMdArrowDropdown id="dropdown-icon" />
            <select name="dropdown">
                <option value="">Americas</option>
                <option value="value1">Europe</option>
                <option value="value2">Asia</option>
            </select>
        </div>
    );
}

export default Dropdown