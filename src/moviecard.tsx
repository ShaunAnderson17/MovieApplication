import { TMDB_API, OMDB_API } from './api';

export interface MovieData {
    id: number;
    title: string;
    poster_path: string;
    overview: string;
    release_date: string;
    vote_average: string;
    runtime: string;
    genres: string[];  
    mpaaRating?: string;
    director?: string;
    writer?: string;
    actors?: string;
}

async function MovieCard(movieId: string): Promise<MovieData> {
    try {
        const tmdbResponse = await TMDB_API.get(`/movie/${movieId}`);
        const tmdbData = tmdbResponse.data;

        const omdbResponse = await OMDB_API.get('/', {
            params: {
                t: tmdbData.title,
                plot: 'short',
                r: 'json',
            },
        });
        const omdbData = omdbResponse.data;

        console.log('TMDB Response:', tmdbData);
        console.log('OMDB Response:', omdbData);

        const movieData: MovieData = {
            id: tmdbData.id,
            title: tmdbData.title,
            poster_path: tmdbData.poster_path,
            overview: tmdbData.overview,
            release_date: tmdbData.release_date,
            vote_average: tmdbData.vote_average,
            runtime: tmdbData.runtime,
            genres: tmdbData.genres.map((genre: { name: string }) => genre.name),  
            mpaaRating: omdbData.Rated,
            director: omdbData.Director,
            writer: omdbData.Writer,
            actors: omdbData.Actors,
        };

        return movieData;
    } catch (error: any) {
        throw new Error(`Error fetching movie details: ${error.message}`);
    }
}

export default MovieCard;