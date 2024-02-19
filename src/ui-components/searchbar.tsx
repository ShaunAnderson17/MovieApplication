import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';    

function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();   

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const handleSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(`/SearchResults/${searchTerm}`);   
    };

    return (
        <div className="search-wrapper">
            <form onSubmit={handleSearchSubmit}>
                <label htmlFor="search">Search Movies</label>
                <input type="search" id="search" value={searchTerm} onChange={handleSearchChange} />
                <button type="submit">Search</button>
            </form>
        </div>
    );
}

export default SearchBar;