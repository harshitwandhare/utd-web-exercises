// dal314006

'use strict';

// The card builder and the storage helpers also live in index.js. The exercise
// asks for exactly five files, so there is nowhere shared to put them.

const STORAGE_KEY = 'watchlist';

const message = document.getElementById('message');
const movieList = document.getElementById('movieList');

render();

function render() {
  const saved = readWatchlist();
  movieList.replaceChildren();

  if (saved.length === 0) {
    message.textContent = 'Your watchlist is empty. Search for a movie and add it.';
    return;
  }

  message.textContent = `${saved.length} saved movie${saved.length === 1 ? '' : 's'}.`;

  for (const movie of saved) {
    movieList.append(createMovieCard(movie));
  }
}

function createMovieCard(movie) {
  const card = document.createElement('article');
  card.className = 'movie-card';

  const info = document.createElement('div');
  info.className = 'movie-info';

  const title = document.createElement('h5');
  title.textContent = movie.Title;

  const year = document.createElement('p');
  year.textContent = `Year: ${movie.Year}`;

  const type = document.createElement('p');
  type.textContent = `Type: ${movie.Type}`;

  info.append(title, year, type, createRemoveButton(movie));
  card.append(createPoster(movie), info);
  return card;
}

function createRemoveButton(movie) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'remove-btn';
  button.textContent = 'Remove';

  button.addEventListener('click', () => {
    removeFromWatchlist(movie.imdbID);
    // Redraw rather than pull the one card out, so the count at the top stays
    // in step with what is stored.
    render();
  });

  return button;
}

// OMDb says "N/A" when it has no artwork, and also hands back links that 404,
// such as the Ultimate Edition of Batman v Superman. Both get the stand-in.
function createPoster(movie) {
  if (!movie.Poster || movie.Poster === 'N/A') {
    return createPosterPlaceholder();
  }

  const image = document.createElement('img');
  image.src = movie.Poster;
  image.alt = `Poster for ${movie.Title}`;
  image.addEventListener('error', () => image.replaceWith(createPosterPlaceholder()));
  return image;
}

function createPosterPlaceholder() {
  const placeholder = document.createElement('div');
  placeholder.className = 'poster-missing';
  placeholder.textContent = 'No poster';
  return placeholder;
}

function removeFromWatchlist(imdbID) {
  const kept = readWatchlist().filter((entry) => entry.imdbID !== imdbID);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(kept));
}

// Whatever is sitting under this key, only an array counts.
function readWatchlist() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}
