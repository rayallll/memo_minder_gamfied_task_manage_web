import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import App from '../App';

test('health and level integration test', () => {
    // Render the app
    render(<App />);

    // Initially, health should be 100 and level should be 1
    expect(screen.getByText('100/100')).toBeInTheDocument();
    expect(screen.getByText('Level 1: 0/100')).toBeInTheDocument();

    // Trigger a negative habit click
    fireEvent.click(screen.getByText('-'));

    // Health should decrease by 10
    expect(screen.getByText('90/100')).toBeInTheDocument();

    // Trigger a positive habit click
    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]);

    // Level should increase by 20
    expect(screen.getByText('Level 1: 20/100')).toBeInTheDocument();
    expect(screen.getByText('90/100')).toBeInTheDocument();

    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByText('0/100')).toBeInTheDocument();

    // // Trigger 3 more positive habit clicks
    fireEvent.click(screen.getAllByText('+')[1]);
    fireEvent.click(screen.getAllByText('+')[1]);
    fireEvent.click(screen.getAllByText('+')[0]);
    fireEvent.click(screen.getAllByText('+')[0]);

    // Level should increase to 2 and health should be reset to 100/100
    expect(screen.getByText('Level 2: 0/100')).toBeInTheDocument();
    expect(screen.getByText('100/100')).toBeInTheDocument()
});
