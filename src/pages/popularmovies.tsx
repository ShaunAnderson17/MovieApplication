import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TMDB_API } from '../api';  

interface MovieData {
    id: number;
    title: string;
    poster_path: string;
    vote_average: number;
}

function PopularMovies() { 
    const [movies, setMovies] = useState<MovieData[]>([]);

    const fetchPopularMovies = async () => {
        try { 
            const response = await TMDB_API.get('/movie/popular', {
                params: {
                    page: 1,  
                },
            });
            setMovies(response.data.results); 
        } catch (error) {
            console.error('Error fetching popular movies:', error); 
        }
    };

    useEffect(() => {
        fetchPopularMovies();
    }, []);

    return (
        <div className="popular-movies">
        <div className="popular-movies-text">
                <h2>Popular Movies</h2> 
            </div> 
                <ul>
                    {movies.map((movie) => (
                        <li key={movie.id} className="movie-box">
                            <Link to={`/movie/${movie.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                />
                            </Link>
                            <h3>{movie.title}</h3> 
                            <p>Rating: {movie.vote_average}</p> 
                        </li>
                    ))}
                </ul> 
                </div> 
    );
}

export default PopularMovies;