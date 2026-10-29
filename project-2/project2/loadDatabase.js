/**
 * Reset the three Project 2 collections and load the P1 photo-sharing data.
 * Uses MongoDB-generated ObjectIds and remaps all cross-references.
 * Running this script again replaces the seeded data.
 */
import mongoose from 'mongoose';
import models from './modelData/photoApp.js';
import User from './schema/user.js';
import Photo from './schema/photo.js';
import SchemaInfo from './schema/schemaInfo.js';

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/project2';

async function loadDatabase() {
  try {
    await mongoose.connect(mongoUrl);
    console.log('Connected to MongoDB');

    await Promise.all([
      User.deleteMany({}),
      Photo.deleteMany({}),
      SchemaInfo.deleteMany({}),
    ]);

    // Keep the original P1 identifiers only as temporary lookup keys.
    const idMap = new Map();
    for (const user of models.userListModel()) {
      const savedUser = await User.create({
        first_name: user.first_name,
        last_name: user.last_name,
        location: user.location,
        description: user.description,
        occupation: user.occupation,
      });
      idMap.set(user._id, savedUser._id);
      console.log(`Added user: ${user.first_name} ${user.last_name}`);
    }

    let photoCount = 0;
    let commentCount = 0;
    for (const originalUser of models.userListModel()) {
      for (const photo of models.photoOfUserModel(originalUser._id)) {
        const savedComments = (photo.comments || []).map((comment) => ({
          comment: comment.comment,
          date_time: comment.date_time,
          user_id: idMap.get(comment.user._id),
        }));
        if (savedComments.some((comment) => !comment.user_id)) {
          throw new Error(`Unknown comment author on photo ${photo.file_name}`);
        }
        await Photo.create({
          file_name: photo.file_name,
          date_time: photo.date_time,
          user_id: idMap.get(photo.user_id),
          comments: savedComments,
        });
        photoCount += 1;
        commentCount += savedComments.length;
      }
    }

    await SchemaInfo.create({
      ...models.schemaInfo2(),
      loaded_from: 'loadDatabase.js',
    });
    console.log(`Loaded ${idMap.size} users, ${photoCount} photos, ${commentCount} comments.`);
  } catch (err) {
    console.error('Database load failed:', err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

loadDatabase();
