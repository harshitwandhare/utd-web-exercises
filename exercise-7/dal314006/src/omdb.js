const API_KEY = 'c0edbfe2';
const OMDB_URL = 'https://www.omdbapi.com/';

// Hands back {movies} or {error}. Nothing in here knows about React.
export async function searchMovies(title) {
  try {
    const response = await fetch(`${OMDB_URL}?apikey=${API_KEY}&s=${encodeURIComponent(title)}`);

    if (!response.ok) {
      return { error: `OMDb answered ${response.status}. Try again in a moment.` };
    }

    const data = await response.json();

    // A search that finds nothing still comes back as 200, with the reason in
    // the body rather than the status.
    if (data.Response === 'False') {
      return {
        error: data.Error === 'Movie not found!' ? `Nothing found for "${title}".` : data.Error
      };
    }

    return { movies: data.Search };
  } catch {
    return { error: 'Could not reach OMDb. Check your connection and try again.' };
  }
}
