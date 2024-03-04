import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard, { MovieData } from './moviecard';


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
            <h2 className="movie-votes"> Vote Average: {movie.vote_average}</h2>
            <h1 className="movie-title">{movie.title}</h1>
            <h3 className="movie-info">{movie.release_date} * {movie.mpaaRating} * {movie.runtime} min</h3>
            <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
                className="movie-poster"
            />
            <h2 className="movie-genre">{movie.genres ? movie.genres.join(', ') : 'N/A'}</h2>
            <p className="movie-summary">Summary: {movie.overview}</p>
            <p className="movie-directors">Director(s): {movie.director}</p>
            <p className="movie-writers">Writer(s): {movie.writer}</p>
            <p className="movie-actors">Actors: {movie.actors}</p>
        </div>
    ) : null;
}

export default MovieCardContainer;