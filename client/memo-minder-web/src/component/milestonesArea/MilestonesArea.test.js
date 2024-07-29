import React from 'react';
import { render } from '@testing-library/react';
import MilestonesArea from './MilestonesArea';

describe('MilestonesArea', () => {
  it('renders Milestone components with correct data', () => {
    const { getByText, getByAltText } = render(<MilestonesArea />);
    
    expect(getByText('First victory in a challenge')).toBeInTheDocument();
    expect(getByText('Completed all active Dailies on 3 days')).toBeInTheDocument();
    expect(getByText("Add 10 Habits")).toBeInTheDocument();
    expect(getByText("Add 10 Dailies")).toBeInTheDocument();
    expect(getByText("Add 10 Todo's")).toBeInTheDocument();
    expect(getByText("Add 10 Rewards")).toBeInTheDocument();
    expect(getByText("Complete 3 Habits")).toBeInTheDocument();
    expect(getByText("Complete 3 Dailies")).toBeInTheDocument();
    // expect(getByText("Complete 3 Todo's")).toBeInTheDocument();
    // expect(getByText("Gain 3 Rewards")).toBeInTheDocument();
    
    // Ensure images are rendered
    expect(getByText('Warrior')).toBeInTheDocument();
    expect(getByText('3 Perfect Days')).toBeInTheDocument();
    expect(getByText('Habit Planner')).toBeInTheDocument();
    expect(getByText('Daily Planner')).toBeInTheDocument();
    expect(getByText("Todo Planner")).toBeInTheDocument();
    expect(getByText('Daydreamer')).toBeInTheDocument();
    expect(getByText('Habit Champion')).toBeInTheDocument();
    expect(getByText('Daily Champion')).toBeInTheDocument();
    // expect(getByText("Todo Champion")).toBeInTheDocument();
    // expect(getByText('Fulfilled Dreamer')).toBeInTheDocument();
  });

  it('displays correct pagination', () => {
    const { getByText } = render(<MilestonesArea />);
    
    expect(getByText('1/2')).toBeInTheDocument(); // Assuming there are 10 milestones and 8 milestones per page, hence 2 pages
  });

  it('handles pagination correctly', () => {
    const { getByText } = render(<MilestonesArea />);
    const leftArrowButton = getByText('<');
    const rightArrowButton = getByText('>');

    // Initial page number is 1
    expect(getByText('1/2')).toBeInTheDocument();

    // Click right arrow
    rightArrowButton.click();
    // expect(getByText('2/2')).toBeInTheDocument();

    // Click left arrow
    leftArrowButton.click();
    expect(getByText('1/2')).toBeInTheDocument();
  });
});
