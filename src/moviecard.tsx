import { TMDB_API, OMDB_API } from './api';

export interface MovieData {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    mpaaRating?: string;
    runtime?: string;
    director?: string;
    writer?: string;
    actors?: string;
    genre?: string;
}

async function MovieCard(movieId: string): Promise<MovieData> {
    try {
        const [tmdbResponse, omdbResponse] = await Promise.all([
            TMDB_API.get(`/movie/${movieId}`),
            OMDB_API.get(`/?t=${movieId}`)
        ]);

        const tmdbData = tmdbResponse.data;
        const omdbData = omdbResponse.data;

        console.log('TMDB Response:', tmdbData);
        console.log('OMDB Response:', omdbData);

        const movieData: MovieData = {
            id: tmdbData.id,
            title: tmdbData.title,
            poster_path: tmdbData.poster_path,
            overview: tmdbData.overview,
            release_date: tmdbData.release_date,
            mpaaRating: omdbData.Rated,
            runtime: omdbData.Runtime,
            director: omdbData.Director,
            writer: omdbData.Writer,
            actors: omdbData.Actors,
            genre: omdbData.Genre
        };

        return movieData;
    } catch (error: any) {
        throw new Error(`Error fetching movie details: ${error.message}`);
    }
}

export default MovieCard;