import { Linking } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

import { NoInternetModal } from '../index';

jest.mock('react-native-fast-image', () => {
  const { View } = require('react-native');
  const FastImage = (props: object) => <View testID="fast-image" {...props} />;
  FastImage.priority = { normal: 0, low: 1, high: 2 };
  FastImage.resizeMode = {
    cover: 'cover',
    contain: 'contain',
    stretch: 'stretch',
  };
  return { __esModule: true, default: FastImage };
});

describe('NoInternetModal', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Linking, 'openSettings').mockImplementation(jest.fn());
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders when visible', () => {
    render(<NoInternetModal visible onClose={mockOnClose} />);

    expect(screen.getByText('No Internet Connection')).toBeTruthy();
    expect(
      screen.getByText('Please check your connection and try again.'),
    ).toBeTruthy();
  });

  it('opens system settings when primary action pressed', () => {
    render(<NoInternetModal visible onClose={mockOnClose} />);

    fireEvent.press(screen.getByText('Go to Settings'));

    expect(Linking.openSettings).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when OK pressed', () => {
    render(<NoInternetModal visible onClose={mockOnClose} />);

    fireEvent.press(screen.getByText('OK'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
