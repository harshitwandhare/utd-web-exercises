import { useRef, useState } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { searchMovies } from '../omdb.js';
import { readWatchlist, writeWatchlist } from '../watchlistStorage.js';

function SearchPage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [message, setMessage] = useState('');
  const [savedIds, setSavedIds] = useState(
    () => new Set(readWatchlist().map((movie) => movie.imdbID))
  );

  // Search twice quickly and the first reply can land last, putting older
  // results over newer ones.
  const latestSearch = useRef(0);

  async function handleSubmit(event) {
    event.preventDefault();

    const title = query.trim();
    if (title === '') {
      setMovies([]);
      setMessage('Type a movie title to search for.');
      return;
    }

    const searchId = latestSearch.current + 1;
    latestSearch.current = searchId;
    setMovies([]);
    setMessage(`Searching for "${title}"...`);

    const outcome = await searchMovies(title);
    if (searchId !== latestSearch.current) {
      return;
    }

    if (outcome.error) {
      setMessage(outcome.error);
      return;
    }

    const found = outcome.movies;
    setMovies(found);
    setMessage(`${found.length} result${found.length === 1 ? '' : 's'} for "${title}".`);
  }

  function handleAdd(movie) {
    const saved = readWatchlist();
    if (saved.some((entry) => entry.imdbID === movie.imdbID)) {
      return;
    }

    // Only the fields a card is built from, so the stored copy stays small.
    writeWatchlist([
      ...saved,
      {
        imdbID: movie.imdbID,
        Title: movie.Title,
        Year: movie.Year,
        Type: movie.Type,
        Poster: movie.Poster
      }
    ]);

    setSavedIds((previous) => new Set(previous).add(movie.imdbID));
  }

  return (
    <>
      <form className="search" onSubmit={handleSubmit}>
        <input
          id="searchInput"
          type="text"
          placeholder="Enter movie title..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button id="searchBtn" type="submit">
          Search
        </button>
      </form>

      <p className="message">{message}</p>

      <section className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie}>
            <button
              type="button"
              className="add-btn"
              disabled={savedIds.has(movie.imdbID)}
              onClick={() => handleAdd(movie)}
            >
              {savedIds.has(movie.imdbID) ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </MovieCard>
        ))}
      </section>
    </>
  );
}

export default SearchPage;
