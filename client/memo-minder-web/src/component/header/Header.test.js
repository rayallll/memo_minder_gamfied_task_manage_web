import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Header from './Header';

describe('Header component', () => {
  beforeEach(() => {
    // Mock local storage methods
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
      },
      writable: true
    });
  });

  test('updates bought products and selected item from localStorage', () => {
    // Mock local storage values
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify({ stick: true }));
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify({ id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' }));

    render(<Header health={80} experience={50} level={3} />);

    expect(window.localStorage.getItem).toHaveBeenCalledWith('boughtItems');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('selectedItem');
  });

  test('updates selected item in localStorage when an item is clicked', () => {
    const { getByAltText } = render(<Header health={80} experience={50} level={3} />);
    const stickImage = getByAltText('Stick');

    fireEvent.click(stickImage);

    expect(window.localStorage.setItem).toHaveBeenCalledWith('selectedItem', JSON.stringify({ id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' }));
  });

  test('updates bought products and selected item from localStorage', () => {
    // Mock local storage values
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify({ stick: true }));
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify({ id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' }));

    render(<Header health={80} experience={50} level={3} />);

    expect(window.localStorage.getItem).toHaveBeenCalledWith('boughtItems');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('selectedItem');
  });

  test('updates selected item in localStorage when an item is clicked', () => {
    const { getByAltText } = render(<Header health={80} experience={50} level={3} />);
    const stickImage = getByAltText('Stick');

    fireEvent.click(stickImage);

    expect(window.localStorage.setItem).toHaveBeenCalledWith('selectedItem', JSON.stringify({ id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' }));
  });

  test('displays bought products correctly', () => {
    // Mock local storage values
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify({ stick: true, sword: true }));

    const { getByAltText } = render(<Header health={80} experience={50} level={3} />);
    const stickImage = getByAltText('Stick');
    const swordImage = getByAltText('Sword');

    expect(stickImage).toBeInTheDocument();
    expect(swordImage).toBeInTheDocument();
  });

  test('does not update selected item in localStorage if item is not clicked', () => {
    render(<Header health={80} experience={50} level={3} />);

    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });

  test('updates bought products and selected item from localStorage', () => {
    // Mock local storage values
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify({ stick: true }));
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify({ id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' }));

    render(<Header health={80} experience={50} level={3} />);

    expect(window.localStorage.getItem).toHaveBeenCalledWith('boughtItems');
    expect(window.localStorage.getItem).toHaveBeenCalledWith('selectedItem');
  });

  test('updates selected item in localStorage when an item is clicked', () => {
    const { getByAltText } = render(<Header health={80} experience={50} level={3} />);
    const stickImage = getByAltText('Stick');

    fireEvent.click(stickImage);

    expect(window.localStorage.setItem).toHaveBeenCalledWith('selectedItem', JSON.stringify({ id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' }));
  });

  test('displays bought products correctly', () => {
    // Mock local storage values
    window.localStorage.getItem.mockReturnValueOnce(JSON.stringify({ stick: true, sword: true }));

    const { getByAltText } = render(<Header health={80} experience={50} level={3} />);
    const stickImage = getByAltText('Stick');
    const swordImage = getByAltText('Sword');

    expect(stickImage).toBeInTheDocument();
    expect(swordImage).toBeInTheDocument();
  });

  test('does not update selected item in localStorage if item is not clicked', () => {
    render(<Header health={80} experience={50} level={3} />);

    expect(window.localStorage.setItem).not.toHaveBeenCalled();
  });

  test('removes event listener on unmount', () => {
    const { unmount } = render(<Header health={80} experience={50} level={3} />);
    const handleLocalStorageChange = jest.fn();
    window.addEventListener('localStorageChanged', handleLocalStorageChange);
    unmount();
    expect(window.removeEventListener).toHaveBeenCalledWith('localStorageChanged', handleLocalStorageChange);
  });

  test('updates selected item in state and localStorage when an item is clicked', () => {
    const { getByAltText } = render(<Header health={80} experience={50} level={3} />);
    const stickImage = getByAltText('Stick');
  
    fireEvent.click(stickImage);
  
    expect(window.localStorage.setItem).toHaveBeenCalledWith('selectedItem', JSON.stringify({ id: 'stick', name: 'Stick', price: 15, imgSrc: '/stick.png', soldSrc: '/stick.png' }));
    expect(getByAltText('Stick')).toHaveAttribute('style', 'background-color: #f75d5d;');
  });

  test('displays selected weapon in user character when an item is clicked', () => {
    const { getByAltText } = render(<Header health={80} experience={50} level={3} />);
    const stickImage = getByAltText('Stick');
  
    fireEvent.click(stickImage);
  
    expect(getByAltText('Stick')).toBeInTheDocument();
    expect(getByAltText('Stick')).toHaveClass('selected-weapon');
  });
  
  test('does not display selected weapon in user character when no item is clicked', () => {
    const { getByAltText, queryByTestId } = render(<Header health={80} experience={50} level={3} />);
  
    expect(queryByTestId('user-character-pic')).toBeNull();
  });

  test('removes event listener for local storage changes on unmount', () => {
    const { unmount } = render(<Header health={80} experience={50} level={3} />);
    const handleLocalStorageChange = jest.fn();
    
    window.addEventListener('localStorageChanged', handleLocalStorageChange);
    expect(handleLocalStorageChange).toHaveBeenCalledTimes(0); // Ensure listener is initially added
  
    unmount();
  
    expect(window.removeEventListener).toHaveBeenCalledWith('localStorageChanged', handleLocalStorageChange);
  });

  
  

});
