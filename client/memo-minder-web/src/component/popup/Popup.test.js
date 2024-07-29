import React from 'react';
import { render, screen, act } from '@testing-library/react';
import Popup from './Popup';

describe('Popup component', () => {
  test('renders correctly when show is true', () => {
    const message = { title: 'Test Title', body: 'Test Body', background_color: '#ffffff' };
    render(<Popup show={true} onClose={() => {}} message={message} />);
    const popup = screen.getByText('Test Title');
    expect(popup).toBeInTheDocument();
  });

  test('does not render when show is false', () => {
    const message = { title: 'Test Title', body: 'Test Body', background_color: '#ffffff' };
    render(<Popup show={false} onClose={() => {}} message={message} />);
    const popup = screen.queryByText('Test Title');
    expect(popup).not.toBeInTheDocument();
  });

  test('closes after a certain time when show is true', async () => {
    jest.useFakeTimers();
    const onCloseMock = jest.fn();
    const message = { title: 'Test Title', body: 'Test Body', background_color: '#ffffff' };
    render(<Popup show={true} onClose={onCloseMock} message={message} />);
    
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    expect(onCloseMock).toHaveBeenCalled();
  });
});
