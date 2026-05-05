import DeviceInfo from 'react-native-device-info';

import { syncFcmToken, userService } from '../user';
import { apiRequest } from '../apiClient';
import { HTTP_METHODS, USER_ENDPOINTS } from '@app/constants/api';

jest.mock('react-native-device-info');
jest.mock('../apiClient');

function findApiPutCall(apiMock: jest.Mock): unknown[] | undefined {
  return apiMock.mock.calls.find((c: unknown) => {
    if (!Array.isArray(c) || c.length < 2) {
      return false;
    }
    const opts = c[1];
    return (
      typeof opts === 'object' &&
      opts !== null &&
      'method' in opts &&
      (opts as { method: string }).method === HTTP_METHODS.PUT
    );
  }) as unknown[] | undefined;
}

describe('user service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (DeviceInfo.getUniqueId as jest.Mock).mockResolvedValue('device-xyz');
  });

  it('exports userService with syncFcmToken', () => {
    expect(userService.syncFcmToken).toBe(syncFcmToken);
  });

  it('POSTs a new device token when none exists for device', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce(undefined);

    await syncFcmToken('user-doc-1', 'fcm-new');

    expect(apiRequest).toHaveBeenNthCalledWith(
      1,
      USER_ENDPOINTS.DEVICE_TOKEN,
      expect.objectContaining({ method: HTTP_METHODS.GET, auth: true }),
    );
    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      USER_ENDPOINTS.DEVICE_TOKEN,
      expect.objectContaining({
        method: HTTP_METHODS.POST,
        auth: true,
        body: expect.objectContaining({
          data: expect.objectContaining({
            token: 'fcm-new',
            users_permissions_users: ['user-doc-1'],
            deviceId: 'device-xyz',
          }),
        }),
      }),
    );
  });

  it('PUTs when token entry exists and user is not linked yet', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce({
        data: [
          {
            documentId: 'dt-99',
            users_permissions_users: [{ id: 7, documentId: 'other-user' }],
          },
        ],
      })
      .mockResolvedValueOnce(undefined);

    await syncFcmToken('user-doc-1', 'fcm-upd');

    expect(apiRequest).toHaveBeenNthCalledWith(
      2,
      `${USER_ENDPOINTS.DEVICE_TOKEN}/dt-99`,
      expect.objectContaining({
        method: HTTP_METHODS.PUT,
        body: {
          data: {
            token: 'fcm-upd',
            users_permissions_users: ['other-user', 'user-doc-1'],
            deviceId: 'device-xyz',
          },
        },
      }),
    );
  });

  it('PUTs without appending user id when already linked (numeric id)', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce({
        data: [
          {
            documentId: 'dt-88',
            users_permissions_users: [{ id: 42, documentId: 'user-doc-1' }],
          },
        ],
      })
      .mockResolvedValueOnce(undefined);

    await syncFcmToken(42, 'fcm-same');

    const putCall = findApiPutCall(apiRequest as jest.Mock);
    expect(
      (
        putCall?.[1] as {
          body: { data: { users_permissions_users: string[] } };
        }
      ).body.data.users_permissions_users,
    ).toEqual(['user-doc-1']);
  });

  it('PUTs without appending user id when already linked (documentId)', async () => {
    (apiRequest as jest.Mock)
      .mockResolvedValueOnce({
        data: [
          {
            documentId: 'dt-77',
            users_permissions_users: [{ id: 99, documentId: 'user-doc-1' }],
          },
        ],
      })
      .mockResolvedValueOnce(undefined);

    await syncFcmToken('user-doc-1', 'fcm-same');

    const putCall = findApiPutCall(apiRequest as jest.Mock);
    expect(
      (
        putCall?.[1] as {
          body: { data: { users_permissions_users: string[] } };
        }
      ).body.data.users_permissions_users,
    ).toEqual(['user-doc-1']);
  });
});
