/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';

jest.mock('@app/config/performance', () => ({
  trackAppLaunch: jest.fn(),
}));

import App from '../App';
import { queryClient } from '@app/contexts/query';

const globalWithDev = globalThis as typeof globalThis & { __DEV__: boolean };

test('renders correctly', async () => {
  const prevDev = globalWithDev.__DEV__;
  globalWithDev.__DEV__ = false;

  let renderer: ReactTestRenderer.ReactTestRenderer;

  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });

    await ReactTestRenderer.act(() => {
      renderer.unmount();
    });
    queryClient.clear();
  } finally {
    globalWithDev.__DEV__ = prevDev;
  }
});
