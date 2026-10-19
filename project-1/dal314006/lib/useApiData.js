import { useEffect, useState } from 'react';
import api from './api.js';

/**
 * Load one API path, and load it again whenever the path changes. Status is
 * one of idle (nothing asked for), loading, ready, missing (404) or failed.
 */
export default function useApiData(path) {
  const [state, setState] = useState({ status: path ? 'loading' : 'idle', data: null });

  useEffect(() => {
    if (!path) {
      setState({ status: 'idle', data: null });
      return undefined;
    }

    // Clicking a second user before the first request lands would otherwise
    // let the older reply overwrite the newer one.
    let current = true;
    setState({ status: 'loading', data: null });

    api
      .get(path)
      .then((response) => {
        if (current) {
          setState({ status: 'ready', data: response.data });
        }
      })
      .catch((error) => {
        if (!current) {
          return;
        }
        const notFound = error.response && error.response.status === 404;
        setState({ status: notFound ? 'missing' : 'failed', data: null });
      });

    return () => {
      current = false;
    };
  }, [path]);

  return state;
}
