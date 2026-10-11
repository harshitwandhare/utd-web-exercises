import { useState } from 'react';

// The button differs between the two pages, so each page passes its own.
function MovieCard({ movie, children }) {
  const [posterFailed, setPosterFailed] = useState(false);

  // OMDb says "N/A" when it has no artwork, and also hands back links that 404,
  // such as the Ultimate Edition of Batman v Superman. Both get the stand-in.
  const hasPoster = Boolean(movie.Poster) && movie.Poster !== 'N/A' && !posterFailed;

  return (
    <article className="movie-card">
      {hasPoster ? (
        <img
          src={movie.Poster}
          alt={`Poster for ${movie.Title}`}
          onError={() => setPosterFailed(true)}
        />
      ) : (
        <div className="poster-missing">No poster</div>
      )}

      <div className="movie-info">
        <h5>{movie.Title}</h5>
        <p>Year: {movie.Year}</p>
        <p>Type: {movie.Type}</p>
        {children}
      </div>
    </article>
  );
}

export default MovieCard;
