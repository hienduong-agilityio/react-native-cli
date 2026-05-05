import { renderWithProviders, screen, fireEvent } from '@app/test-utils';

// Components
import { HorizontalProductList } from '../HorizontalProductList';

// Mocks
import { MOCK_PRODUCTS } from '@app/mocks/products';
import { IProductCardProps } from '@app/interfaces';

describe('HorizontalProductList', () => {
  const mockProps = {
    products: MOCK_PRODUCTS.slice(0, 3),
    onItemPress: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with products', () => {
    const { toJSON } = renderWithProviders(
      <HorizontalProductList
        {...mockProps}
        products={mockProps.products as unknown as IProductCardProps[]}
      />,
    );

    expect(screen.getByText('Black Winter Jacket')).toBeTruthy();
    expect(toJSON()).toMatchSnapshot();
  });

  it('calls onItemPress when product is pressed', () => {
    renderWithProviders(
      <HorizontalProductList
        {...mockProps}
        products={mockProps.products as unknown as IProductCardProps[]}
      />,
    );

    const productCard = screen.getByLabelText(
      'Product: Black Winter Jacket, Price: 499 INR, Rating: 5 stars',
    );
    fireEvent.press(productCard);

    expect(mockProps.onItemPress).toHaveBeenCalledWith('1');
  });

  it('renders with custom itemWidth', () => {
    const { toJSON } = renderWithProviders(
      <HorizontalProductList
        {...mockProps}
        itemWidth={200}
        products={mockProps.products as unknown as IProductCardProps[]}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with snap enabled', () => {
    const { toJSON } = renderWithProviders(
      <HorizontalProductList
        {...mockProps}
        snap={true}
        products={mockProps.products as unknown as IProductCardProps[]}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('handles empty products array', () => {
    const { toJSON } = renderWithProviders(
      <HorizontalProductList products={[]} onItemPress={jest.fn()} />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('handles custom keyExtractor', () => {
    const customKeyExtractor = (item: IProductCardProps) => `custom-${item.id}`;
    const { toJSON } = renderWithProviders(
      <HorizontalProductList
        {...mockProps}
        keyExtractor={customKeyExtractor}
        products={mockProps.products as unknown as IProductCardProps[]}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('handles keyExtractor with null id and name', () => {
    const productsWithNullId = [
      { ...MOCK_PRODUCTS[0], id: null, name: null },
    ] as unknown as IProductCardProps[];

    const { toJSON } = renderWithProviders(
      <HorizontalProductList
        products={productsWithNullId}
        onItemPress={jest.fn()}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('handles customStyle', () => {
    const customStyle = {
      itemContainer: { backgroundColor: 'red' },
    };

    const { toJSON } = renderWithProviders(
      <HorizontalProductList
        {...mockProps}
        customStyle={customStyle}
        products={mockProps.products as unknown as IProductCardProps[]}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });

  it('renders with snap disabled', () => {
    const { toJSON } = renderWithProviders(
      <HorizontalProductList
        {...mockProps}
        snap={false}
        products={mockProps.products as unknown as IProductCardProps[]}
      />,
    );

    expect(toJSON()).toMatchSnapshot();
  });
});
