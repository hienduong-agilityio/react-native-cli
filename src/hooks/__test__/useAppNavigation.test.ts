import { renderHook, act } from '@testing-library/react-native';

import { useAppNavigation } from '../useAppNavigation';
import { PRIVATE_SCREENS } from '@app/constants';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockCanGoBack = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    canGoBack: mockCanGoBack,
  }),
}));

describe('useAppNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('exposes navigation and handlers', () => {
    const { result } = renderHook(() => useAppNavigation());

    expect(result.current.navigation).toBeDefined();
    expect(typeof result.current.handleGoBack).toBe('function');
    expect(typeof result.current.navigateToDetail).toBe('function');
  });

  it('navigateToDetail navigates to product detail with id', () => {
    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.navigateToDetail('abc123');
    });

    expect(mockNavigate).toHaveBeenCalledWith(PRIVATE_SCREENS.PRODUCT_DETAIL, {
      productId: 'abc123',
    });
  });

  it('handleGoBack calls goBack when stack can go back', () => {
    mockCanGoBack.mockReturnValue(true);

    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockGoBack).toHaveBeenCalledTimes(1);
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('handleGoBack navigates to main tabs when stack cannot go back', () => {
    mockCanGoBack.mockReturnValue(false);

    const { result } = renderHook(() => useAppNavigation());

    act(() => {
      result.current.handleGoBack();
    });

    expect(mockGoBack).not.toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(PRIVATE_SCREENS.MAIN_TABS);
  });
});
