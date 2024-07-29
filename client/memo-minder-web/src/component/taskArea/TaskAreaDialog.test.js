// TaskAreaDialog.test.jsx

import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import TaskAreaDialog from './TaskAreaDialog';
import TaskArea from './TaskArea';

describe('TaskAreaDialog', () => {
  const onCloseMock = jest.fn();
  const onSaveMock = jest.fn();
  const onDeleteMock = jest.fn();

  const item = {
    _id: '1',
    title: 'Test Title',
    note: 'Test Note',
    positive: true,
    negative: false,
    completed: false,
    price: 10
  };

  it('renders correctly with Habit type', () => {
    const { getByText, getByLabelText } = render(
      <TaskAreaDialog item={item} type="Habit" onClose={onCloseMock} onSave={onSaveMock} onDelete={onDeleteMock} />
    );

    expect(getByText('Edit Habit')).toBeInTheDocument();
    fireEvent.change(getByLabelText('Title*:'), { target: { value: 'New Title' } });
    fireEvent.click(getByText('Save'));
    expect(onSaveMock).toHaveBeenCalled();
  });

  it('renders correctly with Daily type', () => {
    const { getByText } = render(
      <TaskAreaDialog item={item} type="Daily" onClose={onCloseMock} onSave={onSaveMock} onDelete={onDeleteMock} />
    );

    expect(getByText('Edit Daily')).toBeInTheDocument();
    fireEvent.click(getByText('Mark as Completed'));
    fireEvent.click(getByText('Save'));
    expect(onSaveMock).toHaveBeenCalled();
  });

  it('renders correctly with Reward type', () => {
    const { getByText, getByLabelText } = render(
      <TaskAreaDialog item={item} type="Reward" onClose={onCloseMock} onSave={onSaveMock} onDelete={onDeleteMock} />
    );

    expect(getByText('Edit Reward')).toBeInTheDocument();
    fireEvent.change(getByLabelText('Price*:'), { target: { value: 20 } });
    fireEvent.click(getByText('Save'));
    expect(onSaveMock).toHaveBeenCalled();
  });

  it('calls onClose when Cancel button is clicked', () => {
    const { getByText } = render(
      <TaskAreaDialog item={item} type="Habit" onClose={onCloseMock} onSave={onSaveMock} onDelete={onDeleteMock} />
    );

    fireEvent.click(getByText('Cancel'));
    expect(onCloseMock).toHaveBeenCalled();
  });

  it('calls onDelete when Delete button is clicked', () => {
    const { getByText } = render(
      <TaskAreaDialog item={item} type="Habit" onClose={onCloseMock} onSave={onSaveMock} onDelete={onDeleteMock} />
    );

    fireEvent.click(getByText('Delete this Habit'));
    expect(onDeleteMock).toHaveBeenCalled();
  });

  it('toggles positive state when Positive button is clicked with Habit type', () => {
    const { getByText } = render(
      <TaskAreaDialog item={item} type="Habit" onClose={onCloseMock} onSave={onSaveMock} onDelete={onDeleteMock} />
    );

    fireEvent.click(getByText('Positive'));
    fireEvent.click(getByText('Save'));
    expect(onSaveMock).toHaveBeenCalled();
  });

  it('toggles negative state when Negative button is clicked with Habit type', () => {
    const { getByText } = render(
      <TaskAreaDialog item={item} type="Habit" onClose={onCloseMock} onSave={onSaveMock} onDelete={onDeleteMock} />
    );

    fireEvent.click(getByText('Negative'));
    fireEvent.click(getByText('Save'));
    expect(onSaveMock).toHaveBeenCalled();
  });

  // it('updates price state when Price input is changed with Reward type', () => {
  //   const { getByLabelText } = render(
  //     <TaskAreaDialog item={item} type="Reward" onClose={onCloseMock} onSave={onSaveMock} onDelete={onDeleteMock} />
  //   );

  //   fireEvent.change(getByLabelText('Price*:'), { target: { value: 30 } });
  //   fireEvent.click(getByLabelText('Save'));
  //   expect(onSaveMock).toHaveBeenCalled();
  // });

  // it('should update notes on change', () => {
  //   const { getByTestId } = render(<TaskArea />);
  //   // 假设你的<textarea>有一个"data-testid"属性
  //   const textarea = getByTestId('notes-textarea');

  //   // 模拟用户输入
  //   fireEvent.change(textarea, { target: { value: 'New note content' } });

  //   // 确认状态更新逻辑被调用，这里使用了getByDisplayValue来验证输入是否成功
  //   expect(textarea.value).toBe('New note content');
  // });
});
