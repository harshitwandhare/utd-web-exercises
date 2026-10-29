# Project 2 — PhotoSharing backend (CS 6314, Fall 2026)

P2 continues **your completed P1 React application**. It adds an Express/Mongoose API and a MongoDB database. The backend is read-only and students implement only the three specified GET handlers.

## Requirements

- Node.js version compatible with P1 (`^20.19.0 || >=22.12.0`); use a currently supported LTS version.
- npm; local MongoDB Community Server running on `127.0.0.1:27017`.
- Your *completed* Project 1 folder (not the blank P1 starter).

## Assemble P2 (no nested `project2/project2`)

1. Copy your completed `project1/` directory and name the copy `project2/`.
2. Open `project2.zip`; it contains its own `project2/` folder. **Merge the contents of that inner folder into your `project2/` directory.** Allow the supplied `package.json`, `eslint.config.js`, and `modelData/photoApp.js` to replace their P1 counterparts. Keep all your completed React components, `index.html`, `vite.config.js`, `public/images/`, and other frontend files.
3. The P2 starter intentionally does **not** contain `index.html` or your React components.
4. In `project2/`, run `npm install`. This updates your inherited P1 `package-lock.json` to include backend dependencies. **Keep the updated lockfile.**

If you are copying from the blank P1 starter rather than your completed P1 solution, the sidebar and other frontend views will still be placeholders.

## Connect your P1 frontend to Express

Update **`lib/api.js`** from P1. Remove both the import of `installMock` and the `installMock(api)` call. Keep a shared Axios instance:

```js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
});

export default api;
```

Do not change P1 component behavior or the three API endpoint URLs. You may leave the now-unused `lib/mockSetup.js` file in place. You must not make requests through the mock API for P2.

The frontend (`localhost:3000`) and Express server (`localhost:3001`) are different origins. The backend provides CORS headers using the `cors` middleware. Photo images remain under `public/images/` and are served by Vite from `/images/<file_name>`.

## Database and servers

From the `project2/` directory, with MongoDB running:

```sh
node loadDatabase.js
npm run server
```

The loader deletes and reloads Project 2's `User`, `Photo`, and `SchemaInfo` collections. Run it again any time you want to reset the data. **Do not point `MONGO_URL` at a database containing other work.**

In another terminal in `project2/`:

```sh
npm run client
```

Alternatively, `npm run dev` launches the backend and frontend processes together. The API starts listening only after MongoDB connects.

Defaults: `MONGO_URL=mongodb://127.0.0.1:27017/project2`, `PORT=3001`, and optional `VITE_API_URL=http://localhost:3001`. The loader and server both use `MONGO_URL`.

## Required endpoints

- `GET /user/list`: only `_id`, `first_name`, `last_name`.
- `GET /user/:id`: only `_id`, `first_name`, `last_name`, `location`, `description`, `occupation`.
- `GET /photosOfUser/:id`: photos with comment arrays and nested comment user summaries.

Use Mongoose queries, build the required plain JSON objects, and handle bad IDs (400), valid but missing users (404), and an existing user with no photos (200 and `[]`). The provided `webServer.js` contains intentional TODO handlers; it is not a completed solution.

## Tests and checks

In one terminal keep the backend running. In another:

```sh
cd test
npm install
npm test
```

Tests use Node's built-in `fetch` and Mocha, and expect API port 3001 by default. They compare the HTTP responses against `../modelData/photoApp.js`. The tests are intended to fail until your handlers are implemented. To point at another server, set `API_BASE_URL` before running the tests.

Return to the `project2/` root for:

```sh
npm run lint
npm run build
npm audit
```

The `test/` folder has its own dependency manifest and lockfile. Do not submit either root or test `node_modules/` or the Vite `dist/` folder. Retain generated `package-lock.json` files for reproducible installation and grading.

## Notes

- Backend timestamps are serialized as JSON strings. MongoDB's `Date` values can appear in UTC ISO format, unlike the local date-time strings in the P1 mock data.
- A user with no photos is provided to test empty responses.
- You do not need to use the model data in your server handlers; it exists only to load MongoDB and to verify the expected dataset in tests.
