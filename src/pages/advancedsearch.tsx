import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TMDB_API } from '../api'
import { MovieData } from '../moviecard'

interface CheckboxState {
    [key: string]: boolean;
}

const genres = [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
    { id: 16, name: 'Animation' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 99, name: 'Documentary' },
    { id: 18, name: 'Drama' },
    { id: 10751, name: 'Family' },
    { id: 14, name: 'Fantasy' },
    { id: 36, name: 'History' },
    { id: 27, name: 'Horror' },
    { id: 10402, name: 'Music' },
    { id: 9648, name: 'Mystery' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
    { id: 10770, name: 'TV Movie' },
    { id: 53, name: 'Thriller' },
    { id: 10752, name: 'War' },
    { id: 37, name: 'Western' },
];

const vote_average = ['1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', '9-10'];

function CheckboxGroup({ label, checkboxes, checkboxState, handleChange }: { label: string, checkboxes: string[], checkboxState: CheckboxState, handleChange: (checkboxName: string, group: number) => void }) {
    return (
        <div className="checkbox-container">
            <div className="genre-label">{label}</div>
            {checkboxes && checkboxes.map((checkboxName) => (
                <div key={checkboxName} className="checkbox-item">
                    <input
                        type="checkbox"
                        checked={checkboxState[checkboxName]}
                        onChange={() => handleChange(checkboxName, 1)}
                    />
                    <label>{checkboxName}</label>
                </div>
            ))}
        </div>
    );
}

function AdvancedSearch() {
    const [checkboxStateGenre, setCheckboxStateGenre] = useState<CheckboxState>(
        genres.reduce((acc, genre) => ({ ...acc, [genre.name]: false }), {})
    );

    const [checkboxStateVoteAverage, setCheckboxStateVoteAverage] = useState<CheckboxState>(
        vote_average.reduce((acc, vote_average) => ({ ...acc, [vote_average]: false }), {})
    );

    const [runtime, setRuntime] = useState<{ min: string; max: string }>({ min: "", max: "" });

    const [releaseYear, setReleaseYear] = useState<string>("");

    const [filteredMovies, setFilteredMovies] = useState<MovieData[] | null>(null);

    const [isFilterApplied, setIsFilterApplied] = useState(false);

    const updateIsFilterApplied = () => { 
        const genreFilterApplied = Object.values(checkboxStateGenre).some((value) => value);
        const voteAverageFilterApplied = Object.values(checkboxStateVoteAverage).some((value) => value);
        const runtimeFilterApplied = runtime.min !== '' || runtime.max !== '';
        const releaseYearFilterApplied = releaseYear !== '';
         
        setIsFilterApplied(genreFilterApplied || voteAverageFilterApplied || runtimeFilterApplied || releaseYearFilterApplied);
    }; 

    const fetchFilteredMovies = async () => {
        try {
            const selectedGenres = Object.keys(checkboxStateGenre).filter(
                (genre) => checkboxStateGenre[genre]
            );

            const selectedVoteAverages = Object.keys(checkboxStateVoteAverage).filter(
                (voteAvg) => checkboxStateVoteAverage[voteAvg]
            );

            const genreIds = await Promise.all(
                selectedGenres.map(async (genre) => {
                    const genreObject = genres.find((g) => g.name === genre);
                    return genreObject ? genreObject.id : null;
                })
            );

            const validGenreIds = genreIds.filter((id) => id !== null);

            const voteAverageRanges = selectedVoteAverages.map((range) => {
                const [min, max] = range.split('-');
                return { min, max };
            });

            const minRuntimeInMinutes = runtime.min ? convertRuntimeToMinutes(runtime.min) : null;
            const maxRuntimeInMinutes = runtime.max ? convertRuntimeToMinutes(runtime.max) : null;
             
            const response = await TMDB_API.get('/discover/movie', {
                params: {
                    with_genres: validGenreIds.join(','),
                    'vote_average.gte': Math.min(...voteAverageRanges.map(range => parseFloat(range.min))),
                    'vote_average.lte': Math.max(...voteAverageRanges.map(range => parseFloat(range.max))),
                    'with_runtime.gte': minRuntimeInMinutes,
                    'with_runtime.lte': maxRuntimeInMinutes,
                    primary_release_year: releaseYear,
                },
            });

            setFilteredMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching filtered movies:', error);
        }
    };

    const convertRuntimeToMinutes = (runtimeString: string) => {
        const runtimeArray = runtimeString.split(" ");
        let totalMinutes = 0;

        runtimeArray.forEach((segment) => {
            const value = parseInt(segment);

            if (!isNaN(value)) {
                if (segment.includes("hr")) {
                    totalMinutes += value * 60;
                } else if (segment.includes("min")) {
                    totalMinutes += value;
                }
            }
        });

        return totalMinutes;
    };

    const fetchMoviesByRuntime = async () => {
        if (!runtime.min || !runtime.max) {
            setFilteredMovies([]);
            return;
        }

        try {
            const minRuntimeInMinutes = convertRuntimeToMinutes(runtime.min);
            const maxRuntimeInMinutes = convertRuntimeToMinutes(runtime.max);

            const response = await TMDB_API.get('/discover/movie', {
                params: {
                    'with_runtime.gte': minRuntimeInMinutes,
                    'with_runtime.lte': maxRuntimeInMinutes,
                },
            });

            setFilteredMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching movies by runtime:', error);
        }
    };


    const fetchMoviesByReleaseYear = async () => {
        try {
            const response = await TMDB_API.get('/discover/movie', {
                params: {
                    primary_release_year: releaseYear,
                },
            });
            setFilteredMovies(response.data.results);
        } catch (error) {
            console.error('Error fetching movies by release year:', error);
        }
    }
    useEffect(() => {
        fetchFilteredMovies();
        updateIsFilterApplied();
    }, [checkboxStateGenre, checkboxStateVoteAverage, runtime, releaseYear]);

    const handleChange = (name: string, group: number) => {
        const setStateFunction = (prevState: CheckboxState) => ({
            ...prevState,
            [name]: !prevState[name],
        });

        switch (group) {
            case 1:
                setCheckboxStateGenre((prevState) => setStateFunction(prevState));
                break;
            case 2:
                setCheckboxStateVoteAverage((prevState) => setStateFunction(prevState));
                break;
            case 3:
                setRuntime((prevRuntime) => ({ ...prevRuntime, min: name }));
                fetchMoviesByRuntime();
                break;
            case 4:
                setRuntime((prevRuntime) => ({ ...prevRuntime, max: name }));
                fetchMoviesByRuntime();
                break;
            case 5:
                setReleaseYear(name);
                fetchMoviesByReleaseYear();
                break;
            default:
                break;
        }
        updateIsFilterApplied();
    };

    return (
        <div className="advanced-search-container">
            <div className="scrollable-container">
                <div className="genre">
                    <CheckboxGroup label="Genre" checkboxes={genres.map(genre => genre.name)} checkboxState={checkboxStateGenre} handleChange={(name) => handleChange(name, 1)} />
                </div>
            </div>

            <div className="scrollable-container">
                <div className="average-vote">
                    <CheckboxGroup label="Average Vote" checkboxes={vote_average} checkboxState={checkboxStateVoteAverage} handleChange={(name) => handleChange(name, 2)} />
                </div>
            </div>

            <div className="drop-down-container"> 
                <div className="runtime-min">
                    <label htmlFor="RuntimeMin">Min Runtime:</label>
                    <select
                        id="RuntimeMin" value={runtime.min} onChange={(e) => handleChange(e.target.value, 3)}>
                        <option value="">Select Minimum Runtime</option>
                        <option value="45">45</option>
                        <option value="1hr">1hr</option>
                        <option value="1hr 30min">1hr 30min</option>
                        <option value="2hr">2hr</option>
                        <option value="2hr 30min">2hr 30min</option>
                        <option value="3hr+">3hr+</option>
                    </select>
                </div>
                <div className="runtime-max">
                    <label htmlFor="RuntimeMax">Max Runtime:</label>
                    <select
                        id="RuntimeMax" value={runtime.max} onChange={(e) => handleChange(e.target.value, 4)}>
                        <option value="">Select Maximum Runtime</option>
                        <option value="45">45</option>
                        <option value="1hr">1hr</option>
                        <option value="1hr 30min">1hr 30min</option>
                        <option value="2hr">2hr</option>
                        <option value="2hr 30min">2hr 30min</option>
                        <option value="3hr+">3hr+</option>
                    </select>
                    </div> 
             


            <div>
                <div> 
                    <div className="release-year">
                    <label htmlFor="ReleaseYear">Select Year:</label>
                     
                        <select id="ReleaseYear" value={releaseYear} onChange={(e) => handleChange(e.target.value, 5)}>
                        <option value=""> Select Release Year</option>
                        <option value="2024">2024</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                        <option value="2017">2017</option>
                        <option value="2016">2016</option>
                        <option value="2015">2015</option>
                        <option value="2014">2014</option>
                        <option value="2013">2013</option>
                        <option value="2012">2012</option>
                        <option value="2011">2011</option>
                        <option value="2010">2010</option>
                        <option value="2009">2009</option>
                        <option value="2008">2008</option>
                        <option value="2007">2007</option>
                        <option value="2006">2006</option>
                        <option value="2005">2005</option>
                        <option value="2004">2004</option>
                        <option value="2003">2003</option>
                        <option value="2002">2002</option>
                        <option value="2001">2001</option>
                        <option value="2000">2000</option>
                        <option value="1999">1999</option>
                        <option value="1998">1998</option>
                        <option value="1997">1997</option>
                        <option value="1996">1996</option>
                        <option value="1995">1995</option>
                        <option value="1994">1994</option>
                        <option value="1993">1993</option>
                        <option value="1992">1992</option>
                        <option value="1991">1991</option>
                        <option value="1990">1990</option>
                        <option value="1989">1989</option>
                        <option value="1988">1988</option>
                        <option value="1987">1987</option>
                        <option value="1986">1986</option>
                        <option value="1985">1985</option>
                        <option value="1984">1984</option>
                        <option value="1983">1983</option>
                        <option value="1982">1982</option>
                        <option value="1981">1981</option>
                        <option value="1980">1980</option>
                        <option value="1979">1979</option>
                        <option value="1978">1978</option>
                        <option value="1977">1977</option>
                        <option value="1976">1976</option>
                        <option value="1975">1975</option>
                        <option value="1974">1974</option>
                        <option value="1973">1973</option>
                        <option value="1972">1972</option>
                        <option value="1971">1971</option>
                        <option value="1970">1970</option>
                        <option value="1969">1969</option>
                        <option value="1968">1968</option>
                        <option value="1967">1967</option>
                        <option value="1966">1966</option>
                        <option value="1965">1965</option>
                        <option value="1964">1964</option>
                        <option value="1963">1963</option>
                        <option value="1962">1962</option>
                        <option value="1961">1961</option>
                        <option value="1960">1960</option>
                        <option value="1959">1959</option>
                        <option value="1958">1958</option>
                        <option value="1957">1957</option>
                        <option value="1956">1956</option>
                        <option value="1955">1955</option>
                        <option value="1954">1954</option>
                        <option value="1953">1953</option>
                        <option value="1952">1952</option>
                        <option value="1951">1951</option>
                        <option value="1950">1950</option>
                        <option value="1949">1949</option>
                        <option value="1948">1948</option>
                        <option value="1947">1947</option>
                        <option value="1946">1946</option>
                        <option value="1945">1945</option>
                        <option value="1944">1944</option>
                        <option value="1943">1943</option>
                        <option value="1942">1942</option>
                        <option value="1941">1941</option>
                        <option value="1940">1940</option>
                        <option value="1939">1939</option>
                        <option value="1938">1938</option>
                        <option value="1937">1937</option>
                        <option value="1936">1936</option>
                        <option value="1935">1935</option>
                        <option value="1934">1934</option>
                        <option value="1933">1933</option>
                        <option value="1932">1932</option>
                        <option value="1931">1931</option>
                        <option value="1930">1930</option>
                        <option value="1929">1929</option>
                        <option value="1928">1928</option>
                        <option value="1927">1927</option>
                        <option value="1926">1926</option>
                        <option value="1925">1925</option>
                        <option value="1924">1924</option>
                        <option value="1923">1923</option>
                        <option value="1922">1922</option>
                        <option value="1921">1921</option>
                        <option value="1920">1920</option>
                        <option value="1919">1919</option>
                        <option value="1918">1918</option>
                        <option value="1917">1917</option>
                        <option value="1916">1916</option>
                        <option value="1915">1915</option>
                        <option value="1914">1914</option>
                        <option value="1913">1913</option>
                        <option value="1912">1912</option>
                        <option value="1911">1911</option>
                        <option value="1910">1910</option>
                        <option value="1909">1909</option>
                        <option value="1908">1908</option>
                        <option value="1907">1907</option>
                        <option value="1906">1906</option>
                        <option value="1905">1905</option>
                        <option value="1904">1904</option>
                        <option value="1903">1903</option>
                        <option value="1902">1902</option>
                        <option value="1901">1901</option>
                        <option value="1900">1900</option>
                    </select>
                        </div> 
                    </div>
                    <div className="advanced-search-display">
                        {isFilterApplied && (
                            <>
                                <h2>Filtered Movies</h2>
                                <div className="movie-list">
                                    {filteredMovies !== null && filteredMovies.length > 0 ? (
                                        filteredMovies.map((movie) => (
                                            <div key={`${movie.id}-${movie.title}`} className="movie-item">
                                                <Link to={`/movie/${movie.id}`}>
                                                    <img
                                                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                        alt={movie.title}
                                                    />
                                                </Link>
                                                <p>{movie.title}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p>No movies found.</p>
                                    )}
                                </div>
                            </>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
}

export default AdvancedSearch;