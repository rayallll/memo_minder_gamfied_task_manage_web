import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TaskButton from './TaskButton';

describe('TaskButton component', () => {
  const onAddHabitMock = jest.fn();
  const onAddDailyMock = jest.fn();
  const onAddTodoMock = jest.fn();
  const onAddRewardMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders Add Task button', () => {
    const { getByText } = render(<TaskButton />);
    const addTaskButton = getByText('Add Task');
    expect(addTaskButton).toBeInTheDocument();
  });

  test('clicking Add Task button toggles menu visibility', () => {
    const { getByText, queryByText } = render(<TaskButton />);
    const addTaskButton = getByText('Add Task');

    // Initially, menu is not visible
    expect(queryByText('Habit')).not.toBeInTheDocument();

    // Click the button to show the menu
    fireEvent.click(addTaskButton);

    // Now, menu should be visible
    expect(queryByText('Habit')).toBeInTheDocument();

    // Click the button again to hide the menu
    fireEvent.click(addTaskButton);

    // Now, menu should not be visible again
    expect(queryByText('Habit')).not.toBeInTheDocument();
  });

  test('clicking menu item opens dialog', () => {
    const { getByText, queryByText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );
    const addTaskButton = getByText('Add Task');

    // Click the button to show the menu
    fireEvent.click(addTaskButton);

    // Click on a menu item
    const habitMenuItem = getByText('Habit');
    fireEvent.click(habitMenuItem);

    // Now, dialog should be visible
    expect(queryByText('Create Habit')).toBeInTheDocument();
  });

  test('handles create habit task correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );
    const addTaskButton = getByText('Add Task');

    fireEvent.click(addTaskButton);
    const habitMenuItem = getByText('Habit');
    fireEvent.click(habitMenuItem);

    const titleInput = getByPlaceholderText('Add a title');
    fireEvent.change(titleInput, { target: { value: 'New Habit' } });

    fireEvent.click(getByText('Create Habit'));
    fireEvent.click(getByText('Create'));
    expect(onAddHabitMock).toHaveBeenCalled();
  });

  test('handles create daily task correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );
    const addTaskButton = getByText('Add Task');

    fireEvent.click(addTaskButton);
    const habitMenuItem = getByText('Daily');
    fireEvent.click(habitMenuItem);

    const titleInput = getByPlaceholderText('Add a title');
    fireEvent.change(titleInput, { target: { value: 'New Daily' } });

    fireEvent.click(getByText('Create Daily'));
    fireEvent.click(getByText('Create'));
    expect(onAddDailyMock).toHaveBeenCalled();
  });

  test('handles create todo task correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );
    const addTaskButton = getByText('Add Task');

    fireEvent.click(addTaskButton);
    const habitMenuItem = getByText('To Do');
    fireEvent.click(habitMenuItem);

    const titleInput = getByPlaceholderText('Add a title');
    fireEvent.change(titleInput, { target: { value: 'New Todo' } });

    fireEvent.click(getByText('Create To Do'));
    fireEvent.click(getByText('Create'));
    expect(onAddTodoMock).toHaveBeenCalled();
  });

  test('handles create reward task correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );
    const addTaskButton = getByText('Add Task');

    fireEvent.click(addTaskButton);
    const habitMenuItem = getByText('Reward');
    fireEvent.click(habitMenuItem);

    const titleInput = getByPlaceholderText('Add a title');
    fireEvent.change(titleInput, { target: { value: 'New Reward' } });
    const notesTextarea = getByPlaceholderText('Add notes');
    fireEvent.change(notesTextarea, { target: { value: 'New reward notes' } });

    fireEvent.click(getByText('Create Reward'));
    fireEvent.click(getByText('Create'));
    expect(onAddRewardMock).toHaveBeenCalled();
  });

  test('handles cancel button correctly', () => {
    const { getByText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );
    const addTaskButton = getByText('Add Task');

    fireEvent.click(addTaskButton);
    const habitMenuItem = getByText('Habit');
    fireEvent.click(habitMenuItem);

    fireEvent.click(getByText('Cancel'));
    expect(onAddHabitMock).not.toHaveBeenCalled();
  });

  test('handles positive button click correctly', () => {
    const { getByText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );

    fireEvent.click(getByText('Add Task'));
    fireEvent.click(getByText('Habit'));

    fireEvent.click(getByText('+'));
    expect(getByText('+').classList.contains('selected')).toBeFalsy();

    fireEvent.click(getByText('+'));
    expect(getByText('+').classList.contains('selected')).toBeTruthy();
  });

  test('handles negative button click correctly', () => {
    const { getByText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );

    fireEvent.click(getByText('Add Task'));
    fireEvent.click(getByText('Habit'));

    fireEvent.click(getByText('-'));
    expect(getByText('-').classList.contains('selected')).toBeFalsy();

    fireEvent.click(getByText('-'));
    expect(getByText('-').classList.contains('selected')).toBeTruthy();
  });

  test('handles reward price input change correctly', () => {
    const { getByText, getByPlaceholderText } = render(
      <TaskButton 
        onAddHabit={onAddHabitMock} 
        onAddDaily={onAddDailyMock} 
        onAddTodo={onAddTodoMock} 
        onAddReward={onAddRewardMock} 
      />
    );

    fireEvent.click(getByText('Add Task'));
    fireEvent.click(getByText('Reward'));

    const priceInput = getByPlaceholderText('10');
    fireEvent.change(priceInput, { target: { value: 20 } });

    fireEvent.click(getByText('Create'));
    expect(onAddRewardMock).toHaveBeenCalled();

  });
});
