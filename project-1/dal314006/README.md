# P1 — PhotoSharing React frontend (Fall 2026)

## Setup

Requires Node.js 20.19+ or 22.12+ (Node 22 LTS or newer recommended) and npm. Extract `project1.zip`; it already contains the `project1/` folder. From that folder:

```sh
npm install
npm run dev
```

Open http://localhost:3000/. Other commands:

```sh
npm run lint     # Check JS/JSX with the supplied ESLint configuration
npm run build    # Create a Vite production build in dist/
npm run preview  # Preview the production build locally
```

**For the instructor:** This modernization package deliberately omits `package-lock.json` because the npm registry was unreachable in the preparation environment. Before posting the starter, run `npm install`, then `npm ci`, `npm run lint`, `npm run build`, and `npm audit`; include the generated lockfile in the posted ZIP. The students should then use `npm ci` rather than `npm install` for initial setup.

**If using this provisional starter without an instructor-generated lockfile:** run `npm install` once, then keep the generated `package-lock.json`. `npm ci` will work on subsequent installs. Do not edit or submit `node_modules/`, and do submit `package-lock.json` so grading installs exactly the resolved versions.

## React Router 7

P1 uses **React Router 7** (package `react-router`, not `react-router-dom`) in Data Router mode. The starter already configures `createBrowserRouter`, `RouterProvider`, and `Outlet`; the routing requirements are unchanged. When implementing navigation in your components, import `Link`, `NavLink`, `useParams`, and `useLocation` from `react-router` as needed:

```jsx
import { Link, useParams } from 'react-router';
```

The starter imports `RouterProvider` from `react-router/dom` for the browser environment. You do not need to implement loaders, actions, server-side rendering, or framework mode.

## Browser routes versus API endpoints

React Router controls pages displayed by the SPA:

- `/` and `/users` — the user directory (names displayed in the shared sidebar; main pane prompts selection)
- `/users/:userId` — user details
- `/users/:userId/photos` — a user's photos and comments

**These browser routes are not API endpoints.** Use `api` imported from `lib/api.js` to issue API calls:

| Request | Response |
| --- | --- |
| `GET /user/list` | Array of user objects |
| `GET /user/:userId` | One user object, or 404 for an unknown user |
| `GET /photosOfUser/:userId` | Array of photos (possibly empty), or 404 for unknown user |
| `GET /test/info` | Diagnostic schema information |

Example:

```js
import api from './lib/api.js'; // change relative path from a nested component
const response = await api.get('/user/list');
const users = response.data;
```

You may use Promise chaining (`.then()`/`.catch()`) or `async`/`await`. Remember to handle loading, errors, and valid empty responses separately. React Router's `useParams()` returns the `userId` parameter inside the view components.

## Mock API in P1 and backend transition in P2

P1 does not need a running backend. `lib/api.js` creates **one Axios instance** and passes that same instance to `installMock()` in `lib/mockSetup.js`. The adapter returns data from `modelData/photoApp.js`. Calls made through a different Axios instance or global `axios` bypass this adapter.

In P2, remove the `installMock()` call and its import from `lib/api.js`; configure the Axios instance to call your real backend. Keep API requests centralized through `lib/api.js` to make this transition straightforward. The P2 dataset may differ from P1's mock dataset.

## Images and data

Images are served by Vite from `public/images/` and can be accessed by `/images/<file_name>` in both development and production builds. A photo's `file_name` is only the base filename; use the HTTP path when rendering it. The data includes a user with no photos and photos with no comments to test empty-state handling. Timestamps are ISO 8601 local date-time strings without an explicit time zone; format them for display without assuming they are UTC.

## Scope

The implementation of `UserList`, `UserDetail`, `UserPhotos`, and the contextual `TopBar` is **student work**. Starter files intentionally contain placeholders. Use the complete assignment specification for requirements and submission instructions.
