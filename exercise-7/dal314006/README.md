# Exercise 7: Movie Search App in React

The Exercise 6 app rebuilt with React, Vite and React Router in data mode.

```
npm install
npm run dev
```

Search is at `/`, the watchlist at `/watchlist`. The OMDb key is in
`src/omdb.js`, which the exercise allows for a client-side app.

| | |
| --- | --- |
| `src/main.jsx` | router: App as the layout route, SearchPage as index, WatchlistPage at /watchlist |
| `src/App.jsx` | Header plus the Outlet the pages render into |
| `src/components/Header.jsx` | the two Link navigation items |
| `src/components/MovieCard.jsx` | one card, with the page's own button passed as children |
| `src/pages/SearchPage.jsx` | controlled input, search, Add to Watchlist |
| `src/pages/WatchlistPage.jsx` | saved movies, Remove |
| `src/omdb.js` | the OMDb call, returning movies or a message |
| `src/watchlistStorage.js` | reads and writes the localStorage array |
