import { useState } from "react";
import { TMDB_API, OMDB_API } from '../api';
import { Link } from 'react-router-dom';

interface MovieData {
    id: number;
    title: string;
    poster_path: string;
    release_date: string;
    mpaaRating: string;
    runtime: string;
}

export default function Browse() {
    const [movies, setMovies] = useState<MovieData[]>([]);

    const handleButtonClick = async (genre: string) => {
        try {
            const response = await TMDB_API.get('discover/movie', {
                params: {
                    with_genres: genre,
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
                    mpaaRating: omdbResponse.data.Rated,
                    runtime: omdbResponse.data.Runtime
                };
            }));

            setMovies(moviesWithRatings);
        } catch (error) {
            console.error(`Error fetching ${genre} movies:`, error);
        }
    };

    return (
        <div className="browse">
            <div className="button-container">
                <button onClick={() => handleButtonClick("28")}>Action</button>
                <button onClick={() => handleButtonClick("12")}>Adventure</button>
                <button onClick={() => handleButtonClick("16")}>Animation</button>
                <button onClick={() => handleButtonClick("35")}>Comedy</button>
                <button onClick={() => handleButtonClick("80")}>Crime</button>
                <button onClick={() => handleButtonClick("99")}>Documentary</button>
                <button onClick={() => handleButtonClick("18")}>Drama</button>
                <button onClick={() => handleButtonClick("10751")}>Family</button>
                <button onClick={() => handleButtonClick("14")}>Fantasy</button>
                <button onClick={() => handleButtonClick("36")}>History</button>
                <button onClick={() => handleButtonClick("27")}>Horror</button>
                <button onClick={() => handleButtonClick("10402")}>Music</button>
                <button onClick={() => handleButtonClick("9648")}>Mystery</button>
                <button onClick={() => handleButtonClick("10749")}>Romance</button>
                <button onClick={() => handleButtonClick("878")}>Sci-Fi</button>
                <button onClick={() => handleButtonClick("10770")}>TV Movie</button>
                <button onClick={() => handleButtonClick("53")}>Thriller</button>
                <button onClick={() => handleButtonClick("10752")}>War</button>
                <button onClick={() => handleButtonClick("37")}>Western</button>
            </div>
            {movies.length > 0 && (
                <ul>
                    {movies.map((movieItem: MovieData) => (
                        <li key={movieItem.id} className="movie-box">
                            <Link to={`/movie/${movieItem.id}`}>
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movieItem.poster_path}`}
                                    alt={movieItem.title}
                                />
                            </Link>
                            <h3>{movieItem.title}</h3>
                            <p>Release Date: {movieItem.release_date}</p>
                            <p>MPAA Rating: {movieItem.mpaaRating}</p>
                            <p>Runtime: {movieItem.runtime}</p> 
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}