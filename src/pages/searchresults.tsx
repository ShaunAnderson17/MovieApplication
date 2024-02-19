import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TMDB_API, OMDB_API } from '../api';

interface MovieData {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    mpaaRating: string;
    runtime: string;
}

interface ApiResponse {
    results: MovieData[];
}

interface RouteParams {
    searchTerm: string;
}

function SearchResults() {
    const [movies, setMovies] = useState<MovieData[]>([]);
    const { searchTerm } = useParams() as unknown as RouteParams;

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const response = await TMDB_API.get('/search/movie', {
                    params: {
                        page: 1,
                        query: searchTerm
                    }
                });
                const data = response.data as ApiResponse;

                const moviesWithRatings = await Promise.all(data.results.map(async (movie) => {
                    const omdbResponse = await OMDB_API.get('/', {
                        params: {
                            t: movie.title,
                            plot: 'short',
                            r: 'json'
                        }
                    });
                    return {
                        ...movie,
                        mpaaRating: omdbResponse.data.Rated,
                        runtime: omdbResponse.data.Runtime
                    };
                }));

                setMovies(moviesWithRatings);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchSearchResults();
    }, [searchTerm]);

    return (
        <div className="search-results">
            <h2>Search Results for "{searchTerm}"</h2>
            <ul>
                {movies.map((movie) => (
                    <li key={movie.id}>
                        <h3>{movie.title}</h3>
                        <p>Release Date: {movie.release_date}</p>
                        <p>MPAA Rating: {movie.mpaaRating}</p>
                        <p>Runtime: {movie.runtime}</p>
                        <Link to={`/movie/${movie.id}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                            />
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchResults;