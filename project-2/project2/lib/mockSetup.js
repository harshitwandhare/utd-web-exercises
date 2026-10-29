/**
 * Install mock endpoints on the same Axios instance the UI uses.
 * Remove the setup call from api.js when connecting to the P2 server.
 */
import MockAdapter from 'axios-mock-adapter';
import models from '../modelData/photoApp.js';

export function installMock(api) {
  const mock = new MockAdapter(api, { onNoMatch: 'throwException' });

  mock.onGet('/test/info').reply(200, models.schemaInfo());
  mock.onGet('/user/list').reply(200, models.userListModel());

  mock.onGet(/^\/user\/[^/]+$/).reply((config) => {
    const userId = config.url.split('/').pop();
    const user = models.userModel(userId);
    return user ? [200, user] : [404, { error: 'User not found' }];
  });

  mock.onGet(/^\/photosOfUser\/[^/]+$/).reply((config) => {
    const userId = config.url.split('/').pop();
    if (!models.userModel(userId)) {
      return [404, { error: 'User not found' }];
    }
    return [200, models.photoOfUserModel(userId)];
  });

  return mock;
}
