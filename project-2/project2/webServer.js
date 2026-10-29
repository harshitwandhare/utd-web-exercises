import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import User from './schema/user.js';
import Photo from './schema/photo.js';

const app = express();
const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/project2';

// The Vite frontend runs on localhost:3000; the API runs on localhost:3001.
app.use(cors());

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

function sendServerError(err, res) {
  console.error('Database/API error:', err);
  return res.status(500).json({ error: 'Internal server error' });
}

// Declared once so the query and the response cannot drift apart.
const USER_SUMMARY_FIELDS = '_id first_name last_name';
const USER_DETAIL_FIELDS = `${USER_SUMMARY_FIELDS} location description occupation`;
const PHOTO_FIELDS = '_id user_id file_name date_time comments';

// A Mongoose document carries __v, and an _id that is an ObjectId rather than a
// string. The frontend compares ids and builds URLs out of them, so responses
// are put together field by field.

function toUserSummary(user) {
  return {
    _id: String(user._id),
    first_name: user.first_name,
    last_name: user.last_name,
  };
}

function toUserDetail(user) {
  return {
    ...toUserSummary(user),
    location: user.location,
    description: user.description,
    occupation: user.occupation,
  };
}

function toComment(comment, author) {
  return {
    _id: String(comment._id),
    comment: comment.comment,
    date_time: comment.date_time,
    user: author,
  };
}

function toPhoto(photo, authorsById) {
  const comments = (photo.comments || [])
    // A comment whose author is missing cannot carry the user object the
    // contract requires, so it is left out rather than sent incomplete.
    .filter((comment) => authorsById.has(String(comment.user_id)))
    .map((comment) => toComment(comment, authorsById.get(String(comment.user_id))));

  return {
    _id: String(photo._id),
    user_id: String(photo.user_id),
    file_name: photo.file_name,
    date_time: photo.date_time,
    comments,
  };
}

// Comments hold a user_id, not an author. Collecting the ids first costs one
// query for the whole page instead of a round trip per comment.
async function loadCommentAuthors(photos) {
  const authorIds = new Set();
  for (const photo of photos) {
    for (const comment of photo.comments || []) {
      if (comment.user_id) {
        authorIds.add(String(comment.user_id));
      }
    }
  }

  if (authorIds.size === 0) {
    return new Map();
  }

  const authors = await User.find({ _id: { $in: [...authorIds] } }, USER_SUMMARY_FIELDS).lean();
  return new Map(authors.map((author) => [String(author._id), toUserSummary(author)]));
}

/** GET /user/list — return only _id, first_name, and last_name. */
app.get('/user/list', async (_req, res) => {
  try {
    const users = await User.find({}, USER_SUMMARY_FIELDS).lean();
    return res.json(users.map(toUserSummary));
  } catch (err) {
    return sendServerError(err, res);
  }
});

/** GET /user/:id — return user details or a 404 if the user does not exist. */
app.get('/user/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const user = await User.findById(userId, USER_DETAIL_FIELDS).lean();
    if (!user) {
      return res.status(404).json({ error: `No user with id ${userId}` });
    }

    return res.json(toUserDetail(user));
  } catch (err) {
    return sendServerError(err, res);
  }
});

/** GET /photosOfUser/:id — return photos with comments and nested user data. */
app.get('/photosOfUser/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    // An unknown user and a user who has posted nothing are different answers,
    // 404 against an empty array, so the owner is checked before the photos.
    const owner = await User.exists({ _id: userId });
    if (!owner) {
      return res.status(404).json({ error: `No user with id ${userId}` });
    }

    const photos = await Photo.find({ user_id: userId }, PHOTO_FIELDS).lean();
    const authorsById = await loadCommentAuthors(photos);

    return res.json(photos.map((photo) => toPhoto(photo, authorsById)));
  } catch (err) {
    return sendServerError(err, res);
  }
});

// Only begin accepting HTTP requests after MongoDB is connected.
async function startServer() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error('Could not connect to MongoDB:', err);
    process.exitCode = 1;
  }
}

startServer();
