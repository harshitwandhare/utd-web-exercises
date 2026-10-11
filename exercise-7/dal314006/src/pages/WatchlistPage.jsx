import { useEffect, useState } from 'react';
import MovieCard from '../components/MovieCard.jsx';
import { readWatchlist, writeWatchlist } from '../watchlistStorage.js';

function WatchlistPage() {
  // null until the effect has read storage. Starting at [] would flash "your
  // watchlist is empty" for a frame before the saved movies appear.
  const [movies, setMovies] = useState(null);

  useEffect(() => {
    setMovies(readWatchlist());
  }, []);

  function handleRemove(imdbID) {
    const kept = readWatchlist().filter((entry) => entry.imdbID !== imdbID);
    writeWatchlist(kept);
    setMovies(kept);
  }

  if (movies === null) {
    return null;
  }

  if (movies.length === 0) {
    return <p className="message">Your watchlist is empty. Search for a movie and add it.</p>;
  }

  return (
    <>
      <p className="message">
        {movies.length} saved movie{movies.length === 1 ? '' : 's'}.
      </p>

      <section className="movie-list">
        {movies.map((movie) => (
          <MovieCard key={movie.imdbID} movie={movie}>
            <button
              type="button"
              className="remove-btn"
              onClick={() => handleRemove(movie.imdbID)}
            >
              Remove
            </button>
          </MovieCard>
        ))}
      </section>
    </>
  );
}

export default WatchlistPage;
