import { AppBar, Toolbar, Typography } from '@mui/material';
import { useMatch } from 'react-router';

import useApiData from '../../lib/useApiData.js';
import './styles.css';

function contextLabel(status, user, showingPhotos) {
  if (status === 'idle') {
    return 'User directory';
  }
  if (status === 'loading') {
    return 'Loading...';
  }
  if (status === 'missing') {
    return 'Unknown user';
  }
  if (status !== 'ready') {
    return 'User unavailable';
  }

  const name = `${user.first_name} ${user.last_name}`;
  return showingPhotos ? `Photos of ${name}` : name;
}

function TopBar() {
  // The bar sits above the Outlet, so it reads the route itself.
  const photosMatch = useMatch('/users/:userId/photos');
  const profileMatch = useMatch('/users/:userId');
  const match = photosMatch || profileMatch;

  const { status, data: user } = useApiData(match ? `/user/${match.params.userId}` : null);

  return (
    <AppBar className="topbar-appBar" position="absolute">
      <Toolbar className="topbar-toolbar">
        <Typography variant="h6" component="h1">
          Harshit Wandhare
        </Typography>
        <Typography variant="h6" component="p">
          {contextLabel(status, user, Boolean(photosMatch))}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
