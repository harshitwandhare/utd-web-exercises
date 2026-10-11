import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router';
import App from './App.jsx';
import SearchPage from './pages/SearchPage.jsx';
import WatchlistPage from './pages/WatchlistPage.jsx';
import './index.css';

// App is the layout route. Its Outlet is where the two pages below render.
const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <SearchPage /> },
      { path: 'watchlist', element: <WatchlistPage /> }
    ]
  }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
