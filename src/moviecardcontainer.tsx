import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard, { MovieData } from './moviecard';

interface MovieCardContainerProps {
    movies: MovieData[];
}

interface RouteParams {
    movieId: string;
}

function MovieCardContainer() {
    const [movie, setMovie] = useState<MovieData | null>(null);
    const { movieId } = useParams<{ movieId: string }>();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                if (movieId) {
                    const movieData = await MovieCard(movieId);
                    setMovie(movieData);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    return movie ? (
        <div>
            <h1>{movie.title}</h1>
            <p>Summary: {movie.overview}</p>
            <p> Release Date: {movie.release_date}</p>
            <p>MPAA Rating: {movie.mpaaRating}</p>
            <p>Runtime: {movie.runtime}</p>
            <p>Genre: {movie.genre}</p>
            <p>Director(s): {movie.director}</p>
            <p>Writer(s): {movie.writer}</p>
            <p>Actors: {movie.actors}</p>
            <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
            />
        </div>
    ) : null;
}

export default MovieCardContainer;