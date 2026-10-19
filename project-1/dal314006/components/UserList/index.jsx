import { List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { NavLink } from 'react-router';

import useApiData from '../../lib/useApiData.js';
import './styles.css';

function UserList() {
  const { status, data: users } = useApiData('/user/list');

  return (
    <nav aria-label="Users">
      <Typography variant="h6" gutterBottom>
        Users
      </Typography>

      {status === 'loading' && <Typography variant="body2">Loading users...</Typography>}

      {status !== 'loading' && status !== 'ready' && (
        <Typography variant="body2">The user list could not be loaded.</Typography>
      )}

      {status === 'ready' && (
        <List disablePadding>
          {users.map((user) => (
            <ListItemButton
              key={user._id}
              component={NavLink}
              to={`/users/${user._id}`}
              className="userlist-link"
            >
              <ListItemText primary={`${user.first_name} ${user.last_name}`} />
            </ListItemButton>
          ))}
        </List>
      )}
    </nav>
  );
}

export default UserList;
