import { Fragment } from 'react';
import { Divider, Typography } from '@mui/material';
import { Link, useParams } from 'react-router';

import formatDateTime from '../../lib/formatDateTime.js';
import useApiData from '../../lib/useApiData.js';
import './styles.css';

function Comment({ comment }) {
  return (
    <li className="userphotos-comment">
      <Typography variant="body2" color="text.secondary">
        <Link to={`/users/${comment.user._id}`}>
          {comment.user.first_name} {comment.user.last_name}
        </Link>
        {' on '}
        {formatDateTime(comment.date_time)}
      </Typography>
      <Typography variant="body1">{comment.comment}</Typography>
    </li>
  );
}

function Photo({ photo }) {
  const comments = photo.comments || [];

  return (
    <article className="userphotos-photo">
      <img
        className="userphotos-image"
        src={`/images/${photo.file_name}`}
        alt={`Photo taken ${formatDateTime(photo.date_time)}`}
      />

      <Typography variant="body2" color="text.secondary" gutterBottom>
        {formatDateTime(photo.date_time)}
      </Typography>

      {comments.length === 0 ? (
        <Typography variant="body2">No comments on this photo.</Typography>
      ) : (
        <ul className="userphotos-comments">
          {comments.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </ul>
      )}
    </article>
  );
}

function UserPhotos() {
  const { userId } = useParams();
  const { status, data: photos } = useApiData(`/photosOfUser/${userId}`);

  if (status === 'loading') {
    return <Typography variant="body1">Loading photos...</Typography>;
  }

  if (status === 'missing') {
    return <Typography variant="body1">There is no user with the id {userId}.</Typography>;
  }

  if (status !== 'ready') {
    return <Typography variant="body1">These photos could not be loaded.</Typography>;
  }

  // A user who exists but has posted nothing answers 200 with an empty array.
  if (photos.length === 0) {
    return <Typography variant="body1">This user has not posted any photos.</Typography>;
  }

  return (
    <section>
      {photos.map((photo, index) => (
        <Fragment key={photo._id}>
          {index > 0 && <Divider className="userphotos-divider" />}
          <Photo photo={photo} />
        </Fragment>
      ))}
    </section>
  );
}

export default UserPhotos;
