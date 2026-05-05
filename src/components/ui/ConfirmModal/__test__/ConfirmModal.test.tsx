import { render, screen, fireEvent } from '@testing-library/react-native';

import { ConfirmModal } from '@app/components/ui/ConfirmModal';
import { modalStore } from '@app/stores/modalStore';
import { BUTTON_LABELS } from '@app/constants/common';

jest.mock('@app/stores/modalStore');

const applySelector = <T extends object>(
  state: T,
  selector?: (s: T) => unknown,
) => (typeof selector === 'function' ? selector(state) : state);

describe('ConfirmModal', () => {
  const mockHideConfirm = jest.fn();
  const mockOnConfirm = jest.fn();
  const mockOnCancel = jest.fn();

  const setupVisible = (overrides: Record<string, unknown> = {}) => {
    (modalStore as unknown as jest.Mock).mockImplementation(selector => {
      const state = {
        confirmModal: {
          visible: true,
          config: {
            title: 'Title',
            message: 'Body',
            onConfirm: mockOnConfirm,
            onCancel: mockOnCancel,
            ...overrides,
          },
        },
        hideConfirm: mockHideConfirm,
      };
      return applySelector(state, selector);
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    setupVisible();
  });

  it('returns null when config is missing', () => {
    (modalStore as unknown as jest.Mock).mockImplementation(selector => {
      const state = {
        confirmModal: { visible: false, config: null },
        hideConfirm: mockHideConfirm,
      };
      return applySelector(state, selector);
    });

    const { toJSON } = render(<ConfirmModal />);
    expect(toJSON()).toBeNull();
  });

  it('renders title and message', () => {
    render(<ConfirmModal />);
    expect(screen.getByText('Title')).toBeTruthy();
    expect(screen.getByText('Body')).toBeTruthy();
  });

  it('confirm runs onConfirm then hideConfirm', () => {
    render(<ConfirmModal />);
    fireEvent.press(screen.getByText(BUTTON_LABELS.CONFIRM));

    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockHideConfirm).toHaveBeenCalledTimes(1);
  });

  it('cancel runs onCancel when provided then hideConfirm', () => {
    render(<ConfirmModal />);
    fireEvent.press(screen.getByText(BUTTON_LABELS.CANCEL));

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockHideConfirm).toHaveBeenCalledTimes(1);
  });

  it('uses custom labels when set in config', () => {
    setupVisible({
      confirmLabel: 'Yes',
      cancelLabel: 'No',
    });
    render(<ConfirmModal />);

    expect(screen.getByText('Yes')).toBeTruthy();
    expect(screen.getByText('No')).toBeTruthy();
  });
});
