import React from 'react';
import AdvancedSearch from './pages/advancedsearch';
import Browse from './pages/Browse';
import NewReleases from './pages/newreleases';
import { Route, Routes } from "react-router-dom"
import SearchBar from './ui-components/searchbar';
import Navbar from './ui-components/navbar';

function App() {
    return (
        <>
            < Navbar />
            <div className="container">
                <SearchBar />
                <Routes>
                    <Route path="/Browse" element={<Browse />} />
                    <Route path="/NewReleases" element={<NewReleases />} />
                    <Route path="/AdvancedSearch" element={<AdvancedSearch />} />
                </Routes>
            </div>
        </>
    )

}

export default App;
