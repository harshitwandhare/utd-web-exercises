// dal314006

'use strict';

const API_KEY = 'c0edbfe2';
const OMDB_URL = 'https://www.omdbapi.com/';
const STORAGE_KEY = 'watchlist';

const form = document.getElementById('searchForm');
const input = document.getElementById('searchInput');
const message = document.getElementById('message');
const movieList = document.getElementById('movieList');

let latestSearch = 0;

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = input.value.trim();
  if (title === '') {
    movieList.replaceChildren();
    message.textContent = 'Type a movie title to search for.';
    return;
  }

  search(title);
});

async function search(title) {
  const searchId = ++latestSearch;
  movieList.replaceChildren();
  message.textContent = `Searching for "${title}"...`;

  const outcome = await askOmdb(title);

  // Search twice quickly and the first answer can land last, piling its cards
  // under the ones already showing.
  if (searchId !== latestSearch) {
    return;
  }

  if (outcome.error) {
    message.textContent = outcome.error;
    return;
  }

  const movies = outcome.movies;
  message.textContent = `${movies.length} result${movies.length === 1 ? '' : 's'} for "${title}".`;

  for (const movie of movies) {
    movieList.append(createMovieCard(movie));
  }
}

// Hands back {movies} or {error}. Nothing in here touches the page.
async function askOmdb(title) {
  try {
    const url = `${OMDB_URL}?apikey=${API_KEY}&s=${encodeURIComponent(title)}`;
    const response = await fetch(url);

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

  info.append(title, year, type, createAddButton(movie));
  card.append(createPoster(movie), info);
  return card;
}

function createAddButton(movie) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'add-btn';

  if (isSaved(movie.imdbID)) {
    markAsSaved(button);
    return button;
  }

  button.textContent = 'Add to Watchlist';
  button.addEventListener('click', () => {
    addToWatchlist(movie);
    markAsSaved(button);
  });
  return button;
}

function markAsSaved(button) {
  button.textContent = 'In Watchlist';
  button.disabled = true;
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

function addToWatchlist(movie) {
  const saved = readWatchlist();
  if (saved.some((entry) => entry.imdbID === movie.imdbID)) {
    return;
  }

  // Only the fields a card is built from, so the stored copy stays small.
  saved.push({
    imdbID: movie.imdbID,
    Title: movie.Title,
    Year: movie.Year,
    Type: movie.Type,
    Poster: movie.Poster
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function isSaved(imdbID) {
  return readWatchlist().some((entry) => entry.imdbID === imdbID);
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
