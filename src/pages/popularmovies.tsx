import { useEffect, useState } from 'react';
import API from '../api';  

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
            const response = await API.get('/movie/popular', {
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
            <h2>Popular Movies</h2> 
                <ul>
                    {movies.map((movie) => (
                        <li key={movie.id}>
                            <h3>{movie.title}</h3> 
                            <p>Rating: {movie.vote_average}</p>
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                            />
                        </li>
                    ))}
                </ul> 
        </div>
    );
}

export default PopularMovies;