import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TMDB_API, OMDB_API } from '../api';
 
interface MovieData {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    mpaaRating: string;
    runtime: string;
}

function NewReleases() {
    const [movies, setMovies] = useState<MovieData[]>([]);

    const fetchLatestMovies = async () => {
        try {
            const response = await TMDB_API.get('/movie/now_playing', {
                params: {
                    page: 1,
                },
            });

            const moviesWithRatings = await Promise.all(response.data.results.map(async (movie: MovieData) => {
                const omdbResponse = await OMDB_API.get('/', {
                    params: {
                        t: movie.title,
                        plot: 'short',
                        r: 'json'
                    }
                });
                return {
                    ...movie,
                    release_date: movie.release_date,
                    mpaaRating: omdbResponse.data.Rated,
                    runtime: omdbResponse.data.Runtime
                };
            }));

            setMovies(moviesWithRatings);
        } catch (error) {
            console.error('Error fetching latest movies:', error);
        }
    };

    useEffect(() => {
        fetchLatestMovies();
    }, []);

    return (
        <div className="latest-movies">
            <h2>New Releases</h2>
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

export default NewReleases;