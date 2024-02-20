import { Route, Routes } from "react-router-dom";
import Navbar from './ui-components/navbar';
import PopularMovies from './pages/popularmovies';
import NewReleases from './pages/newreleases';
import SearchBar from './ui-components/searchbar'; 
import SearchResults from './pages/searchresults';
import AdvancedSearch from './pages/advancedsearch';
import Browse from './pages/Browse';
import MovieCardContainer from "./moviecardcontainer";

function App() {
    return (
        <>
            <Navbar />
            <div className="container">
                <SearchBar />
                <Routes>
                    <Route path="/Browse" element={<Browse />} />
                    <Route path="/PopularMovies" element={<PopularMovies />} />
                    <Route path="/AdvancedSearch" element={<AdvancedSearch />} />
                    <Route path="/NewReleases" element={<NewReleases />} />
                    <Route path="/SearchResults/:searchTerm" element={<SearchResults />} />   
                    <Route path="/movie/:movieId" element={<MovieCardContainer />} /> 
                </Routes>
            </div>
        </>
    );
}

export default App;

