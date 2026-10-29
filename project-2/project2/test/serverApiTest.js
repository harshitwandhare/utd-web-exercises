/**
 * Mocha integration tests for the P2 API.
 * Start MongoDB, loadDatabase.js, and webServer.js before running these tests.
 * These tests verify the HTTP API, not the route handler implementation.
 */
import assert from 'node:assert/strict';
import models from '../modelData/photoApp.js';

const baseUrl = process.env.API_BASE_URL || 'http://127.0.0.1:3001';
const modelUsers = models.userListModel();
const idPattern = /^[a-f\d]{24}$/i;
const userListKeys = ['_id', 'first_name', 'last_name'];
const userDetailKeys = [...userListKeys, 'location', 'description', 'occupation'];
const photoKeys = ['_id', 'user_id', 'file_name', 'date_time', 'comments'];
const commentKeys = ['_id', 'comment', 'date_time', 'user'];

async function request(path) {
  const response = await fetch(`${baseUrl}${path}`);
  const text = await response.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: response.status, data, text };
}

function exactFields(value, fields, context) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${context} must be an object`);
  assert.deepEqual(Object.keys(value).sort(), [...fields].sort(), `${context} has missing/extra fields`);
}

function validId(id, context) {
  assert.match(id, idPattern, `${context}: expected a MongoDB ObjectId string`);
}

function validDate(actual, expected, context) {
  assert.ok(Number.isFinite(new Date(actual).getTime()), `${context}: date must be valid`);
  assert.equal(new Date(actual).getTime(), new Date(expected).getTime(), `${context}: date differs`);
}

function matchUserByName(users, modelUser) {
  return users.find((user) => user.first_name === modelUser.first_name
    && user.last_name === modelUser.last_name);
}

function assertErrorMessage(result, context) {
  const message = typeof result.data === 'string'
    ? result.data
    : (result.data?.error || result.data?.message);
  assert.ok(typeof message === 'string' && message.trim().length > 0, `${context}: error message is missing`);
}

describe('PhotoSharing P2 API', function () {
  let apiUsers;

  before(async function () {
    const result = await request('/user/list');
    assert.equal(result.status, 200, 'GET /user/list must return 200');
    assert.ok(Array.isArray(result.data), '/user/list must return an array');
    apiUsers = result.data;
  });

  describe('GET /user/list', function () {
    it('returns exactly the required fields and all seeded users', function () {
      assert.equal(apiUsers.length, modelUsers.length);
      const ids = new Set();
      for (const user of apiUsers) {
        exactFields(user, userListKeys, 'user list entry');
        validId(user._id, 'user list entry');
        assert.ok(!ids.has(user._id), 'user ids must be unique');
        ids.add(user._id);
      }
      for (const modelUser of modelUsers) {
        assert.ok(matchUserByName(apiUsers, modelUser), `Missing ${modelUser.first_name} ${modelUser.last_name}`);
      }
    });
  });

  describe('GET /user/:id', function () {
    it('returns correct details for every seeded user', async function () {
      for (const modelUser of modelUsers) {
        const user = matchUserByName(apiUsers, modelUser);
        const result = await request(`/user/${user._id}`);
        assert.equal(result.status, 200, `User ${user.first_name} must return 200`);
        exactFields(result.data, userDetailKeys, 'user detail');
        assert.equal(result.data._id, user._id);
        for (const field of ['first_name', 'last_name', 'location', 'description', 'occupation']) {
          assert.equal(result.data[field], modelUser[field], `Incorrect ${field} for ${user.first_name}`);
        }
      }
    });

    it('returns 400 with a message for malformed IDs', async function () {
      const result = await request('/user/not-an-objectid');
      assert.equal(result.status, 400);
      assertErrorMessage(result, 'malformed user id');
    });

    it('returns 404 with a message for a missing user', async function () {
      const missingId = '000000000000000000000000';
      assert.ok(!apiUsers.some((user) => user._id === missingId));
      const result = await request(`/user/${missingId}`);
      assert.equal(result.status, 404);
      assertErrorMessage(result, 'missing user');
    });
  });

  describe('GET /photosOfUser/:id', function () {
    it('returns all photos, all comments, and exactly the required fields', async function () {
      for (const modelUser of modelUsers) {
        const user = matchUserByName(apiUsers, modelUser);
        const result = await request(`/photosOfUser/${user._id}`);
        assert.equal(result.status, 200, `Photos for ${user.first_name} must return 200`);
        assert.ok(Array.isArray(result.data), 'Photo response must be an array');
        const expectedPhotos = models.photoOfUserModel(modelUser._id);
        assert.equal(result.data.length, expectedPhotos.length, `Wrong photo count for ${user.first_name}`);
        for (const expected of expectedPhotos) {
          const matches = result.data.filter((photo) => photo.file_name === expected.file_name);
          assert.equal(matches.length, 1, `Expected one photo called ${expected.file_name}`);
          const actual = matches[0];
          exactFields(actual, photoKeys, 'photo');
          validId(actual._id, 'photo');
          assert.equal(actual.user_id, user._id);
          assert.equal(actual.file_name, expected.file_name);
          validDate(actual.date_time, expected.date_time, 'photo timestamp');
          assert.ok(Array.isArray(actual.comments), 'comments must always be an array');
          assert.equal(actual.comments.length, expected.comments.length, 'Wrong comment count');
          for (const expectedComment of expected.comments) {
            const matchesComment = actual.comments.filter((c) => c.comment === expectedComment.comment);
            assert.equal(matchesComment.length, 1, 'Missing or duplicate comment');
            const comment = matchesComment[0];
            exactFields(comment, commentKeys, 'comment');
            validId(comment._id, 'comment');
            assert.equal(comment.comment, expectedComment.comment);
            validDate(comment.date_time, expectedComment.date_time, 'comment timestamp');
            exactFields(comment.user, userListKeys, 'nested comment user');
            validId(comment.user._id, 'comment user');
            const expectedAuthor = matchUserByName(apiUsers, expectedComment.user);
            assert.ok(expectedAuthor, 'Missing comment author from user list');
            assert.deepEqual(comment.user, expectedAuthor, 'Wrong comment author');
          }
        }
      }
    });

    it('returns [] for the seeded user with no photos', async function () {
      const emptyUser = modelUsers.find((user) => models.photoOfUserModel(user._id).length === 0);
      assert.ok(emptyUser, 'Expected the P1 fixture to include a user without photos');
      const user = matchUserByName(apiUsers, emptyUser);
      const result = await request(`/photosOfUser/${user._id}`);
      assert.equal(result.status, 200);
      assert.deepEqual(result.data, []);
    });

    it('returns 400 with a message for malformed IDs', async function () {
      const result = await request('/photosOfUser/not-an-objectid');
      assert.equal(result.status, 400);
      assertErrorMessage(result, 'malformed photo user id');
    });

    it('returns 404 with a message for a missing user', async function () {
      const result = await request('/photosOfUser/000000000000000000000000');
      assert.equal(result.status, 404);
      assertErrorMessage(result, 'missing photo user');
    });
  });
});
