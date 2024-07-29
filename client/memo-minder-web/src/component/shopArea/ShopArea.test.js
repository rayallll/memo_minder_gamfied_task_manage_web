import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ShopArea from './ShopArea'; // Adjust the import path to where your ShopArea component is located

// Mock the Popup component to prevent actual rendering
jest.mock('../popup/Popup', () => (props) => (
  <div data-testid="mockPopup">
    Mock Popup: {props.message.title} - {props.message.body}
  </div>
));

// Utility function to setup the test with props and context if needed
const setup = (coin = 50, decreaseCoin = jest.fn()) => {
  return render(<ShopArea coin={coin} decreaseCoin={decreaseCoin} />);
};

describe('ShopArea Component', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders products correctly', () => {
    setup();
    const productNames = screen.getAllByRole('heading').map((h) => h.textContent);
    expect(productNames).toEqual(['Stick', 'Sword', 'MagicBook']);
  });

  test('allows a user to buy a product when they have enough coins', () => {
    const decreaseCoin = jest.fn();
    setup(100, decreaseCoin);

    const buyButtons = screen.getAllByText('Buy');
    fireEvent.click(buyButtons[0]); // Click "Buy" on the first product

    expect(decreaseCoin).toHaveBeenCalledWith(15); // Stick price
    expect(screen.getByTestId('mockPopup')).toHaveTextContent('Purchase Successful - You have successfully purchased the Stick.');
  });

  test('prevents a user from buying a product without enough coins', () => {
    setup(10); // Not enough coins to buy anything

    const buyButtons = screen.getAllByText('Buy');
    fireEvent.click(buyButtons[0]); // Try to buy the first product

    expect(screen.getByTestId('mockPopup')).toHaveTextContent('Purchase Failed - You do not have enough coins.');
  });

  test('buys and disables button for a sold product', () => {
    localStorage.setItem('boughtItems', JSON.stringify({ stick: true }));
    setup();

    const buyButton = screen.getByText('Buy', { selector: 'button[disabled]' });
    expect(buyButton).toBeDisabled();
  });
});
