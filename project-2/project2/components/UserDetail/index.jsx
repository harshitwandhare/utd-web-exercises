import { Button, Typography } from '@mui/material';
import { Link, useParams } from 'react-router';

import useApiData from '../../lib/useApiData.js';
import './styles.css';

function Field({ label, value }) {
  // Without Typography the dl falls back to the browser's default serif.
  return (
    <>
      <Typography component="dt" variant="subtitle2">
        {label}
      </Typography>
      <Typography component="dd" variant="body1">
        {value}
      </Typography>
    </>
  );
}

function UserDetail() {
  const { userId } = useParams();
  const { status, data: user } = useApiData(`/user/${userId}`);

  if (status === 'loading') {
    return <Typography variant="body1">Loading this user...</Typography>;
  }

  if (status === 'missing') {
    return <Typography variant="body1">There is no user with the id {userId}.</Typography>;
  }

  if (status !== 'ready') {
    return <Typography variant="body1">This user could not be loaded.</Typography>;
  }

  return (
    <article>
      <Typography variant="h5" gutterBottom>
        {user.first_name} {user.last_name}
      </Typography>

      <dl className="userdetail-fields">
        <Field label="Occupation" value={user.occupation} />
        <Field label="Location" value={user.location} />
        <Field label="About" value={user.description} />
      </dl>

      <Button component={Link} to={`/users/${user._id}/photos`} variant="contained">
        See photos
      </Button>
    </article>
  );
}

export default UserDetail;
