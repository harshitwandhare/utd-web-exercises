import { Link } from 'react-router';

function Header() {
  return (
    <header>
      <h1>Movie Search</h1>
      <nav>
        <Link to="/">Search</Link>
        <Link to="/watchlist">Watchlist</Link>
      </nav>
    </header>
  );
}

export default Header;
