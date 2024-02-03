import React from 'react';
 
function SearchBar() { 
    return (
        <div className="search-wrapper">
            <label htmlFor="search"> Search Movies</label>
            <input type="search" id="search" />
        </div>
    );
}

export default SearchBar;