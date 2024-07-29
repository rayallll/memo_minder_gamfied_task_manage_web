import { render, screen } from '@testing-library/react';
import TaskArea from './TaskArea'; // 确保路径正确
import '@testing-library/jest-dom';

describe('TaskArea Initialization Render Test', () => {
  test('renders all child components correctly on initialization', () => {
    render(<TaskArea
      updateHealth={() => {}}
      updateLevel={() => {}}
      updateCoin={() => {}}
      decreaseCoin={() => {}}
      habits={[]}
      dailies={[]}
      todos={[]}
      rewards={[]}
      onAddHabit={() => {}}
      onUpdateHabit={() => {}}
      onDeleteHabit={() => {}}
      onAddDaily={() => {}}
      onUpdateDaily={() => {}}
      onDeleteDaily={() => {}}
      onAddTodo={() => {}}
      onUpdateTodo={() => {}}
      onDeleteTodo={() => {}}
      onAddReward={() => {}}
      onUpdateReward={() => {}}
      onDeleteReward={() => {}}
      onClear={() => {}}
    />);

    // 验证习惯输入框是否渲染
    expect(screen.getByPlaceholderText('Add a habit')).toBeInTheDocument();

    // 验证日常任务输入框是否渲染
    expect(screen.getByPlaceholderText('Add a daily')).toBeInTheDocument();

    // 验证待办事项输入框是否渲染
    expect(screen.getByPlaceholderText('Add a To Do')).toBeInTheDocument();

    // 验证奖励输入框是否渲染
    expect(screen.getByPlaceholderText('Add a Reward')).toBeInTheDocument();

    // 验证“Clear and Reset”按钮是否渲染
    expect(screen.getByText('Clear and Reset')).toBeInTheDocument();

    // 如果还有其他特定的按钮或组件需要验证，继续使用expect语句验证
    // 例如，验证任务添加按钮是否渲染
    // 注意：这可能需要根据你的实现调整，比如按钮的文本或角色
  });
});


test('adds a habit correctly', () => {
  const habitInput = screen.getByPlaceholderText('Add a habit');
  fireEvent.change(habitInput, { target: { value: 'Read every day' } });
  fireEvent.keyPress(habitInput, { key: 'Enter', code: 'Enter' });

  expect(mockAddHabit).toHaveBeenCalledWith(expect.any(Object));
});

test('adds a daily task correctly', () => {
  const dailyInput = screen.getByPlaceholderText('Add a daily');
  fireEvent.change(dailyInput, { target: { value: 'Workout' } });
  fireEvent.keyPress(dailyInput, { key: 'Enter', code: 'Enter' });

  expect(mockAddDaily).toHaveBeenCalledWith(expect.any(Object));
});

test('adds a todo correctly', () => {
  const todoInput = screen.getByPlaceholderText('Add a To Do');
  fireEvent.change(todoInput, { target: { value: 'Finish project' } });
  fireEvent.keyPress(todoInput, { key: 'Enter', code: 'Enter' });

  expect(mockAddTodo).toHaveBeenCalledWith(expect.any(Object));
});

test('adds a reward correctly', () => {
  const rewardInput = screen.getByPlaceholderText('Add a Reward');
  fireEvent.change(rewardInput, { target: { value: 'Ice cream' } });
  fireEvent.keyPress(rewardInput, { key: 'Enter', code: 'Enter' });

  expect(mockAddReward).toHaveBeenCalledWith(expect.any(Object));
});


// Mock functions for updating tasks
const mockUpdateHabit = jest.fn();

describe('TaskArea Update Task Test', () => {
  beforeEach(() => {
    render(<TaskArea
      habits={[{ _id: 'habit1', title: 'Read daily', positive: true, negative: false }]}
      dailies={[]}
      todos={[]}
      rewards={[]}
      onUpdateHabit={mockUpdateHabit}
      {...otherProps} // Add other necessary mock props
    />);
  });

  test('opens edit dialog and saves changes for a habit correctly', async () => {
    // Assuming that clicking on the habit title triggers the edit dialog
    const habitTitle = screen.getByText('Read daily');
    fireEvent.click(habitTitle);

    // Assuming the dialog input can be identified by a placeholder or label text
    const dialogInput = screen.getByLabelText('Habit Title'); // Adjust based on your actual implementation
    fireEvent.change(dialogInput, { target: { value: 'Read a book daily' } });

    // Assuming there is a save button in the dialog
    const saveButton = screen.getByRole('button', { name: 'Save' }); // Adjust the role/name based on your actual implementation
    fireEvent.click(saveButton);

    // Verify that the mockUpdateHabit function was called with the expected argument
    expect(mockUpdateHabit).toHaveBeenCalledWith('habit1', expect.objectContaining({
      _id: 'habit1',
      title: 'Read a book daily', // Assuming the title is what's being updated
      positive: true, // Assuming these values remain unchanged
      negative: false
    }));
  });
});


test('updates a habit correctly', () => {
  const habits = [{ id: 1, content: 'Drink water', positive: true, negative: false }];
  const onUpdateHabitMock = jest.fn();
  render(
    <TaskArea
      updateHealth={() => { }}
      updateLevel={() => { }}
      updateCoin={() => { }}
      habits={habits}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={onUpdateHabitMock}
      onDeleteHabit={() => { }}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const habitItem = screen.getByText('Drink water');
  fireEvent.click(habitItem);

  expect(onUpdateHabitMock).not.toHaveBeenCalled();

  const habitInput = screen.getByDisplayValue('Drink water');
  fireEvent.change(habitInput, { target: { value: 'Drink water daily' } });

  const saveButton = screen.getByText('Save');
  fireEvent.click(saveButton);

  expect(onUpdateHabitMock).toHaveBeenCalledWith(expect.objectContaining({
    id: habits[0].id,
    content: 'Drink water daily',
    positive: true,
    negative: false
  }));
});

test('deletes a habit correctly', () => {
  const habits = [{ id: 1, content: 'Drink water', positive: true, negative: false }];
  const onDeleteHabitMock = jest.fn();
  render(
    <TaskArea
      updateHealth={() => { }}
      updateLevel={() => { }}
      updateCoin={() => { }}
      habits={habits}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={() => { }}
      onDeleteHabit={onDeleteHabitMock}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const habitItem = screen.getByText('Drink water');
  fireEvent.click(habitItem);

  const deleteButton = screen.getByText(`Delete this Habit`);
  fireEvent.click(deleteButton);

  expect(onDeleteHabitMock).toHaveBeenCalledWith(habits[0].id);
});

// health
test('updates health when positive habit is clicked', () => {
  const updateHealthMock = jest.fn();
  const updateLevelMock = jest.fn();
  const updateCoinMock = jest.fn();
  const habits = [{ id: 1, content: 'Exercise', positive: true, negative: false }];

  render(
    <TaskArea
      updateHealth={updateHealthMock}
      updateLevel={updateLevelMock}
      updateCoin={updateCoinMock}
      habits={habits}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={() => { }}
      onDeleteHabit={() => { }}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const positiveHabitButton = screen.getByText('+');
  fireEvent.click(positiveHabitButton);

  expect(updateLevelMock).toHaveBeenCalled();
});

test('updates health when negative habit is clicked', () => {
  const updateHealthMock = jest.fn();
  const updateLevelMock = jest.fn();
  const habits = [{ id: 1, content: 'Smoking', positive: false, negative: true }];

  render(
    <TaskArea
      updateHealth={updateHealthMock}
      updateLevel={updateLevelMock}
      habits={habits}
      dailies={[]}
      todos={[]}
      onAddHabit={() => { }}
      onUpdateHabit={() => { }}
      onDeleteHabit={() => { }}
      onAddDaily={() => { }}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onClear={() => { }}
    />
  );

  const negativeHabitButton = screen.getByText('-');
  fireEvent.click(negativeHabitButton);

  expect(updateHealthMock).toHaveBeenCalled();
});

// 假设 TaskArea 有多个输入框和按钮，我们需要确保所有的功能都被测试到
// 包括添加习惯、日常任务、待办事项和奖励，以及它们的更新和删除
// 我们还需要测试点击正面和负面习惯按钮时的逻辑，以及购买奖励时的逻辑

// 由于篇幅限制，这里给出测试正面习惯按钮和购买奖励功能的例子
// 其他功能的测试用例可以参照这些例子来编写

test('handlePositiveClick updates coin and level correctly', () => {
  const updateCoinMock = jest.fn();
  const updateLevelMock = jest.fn();
  const onUpdateHabitMock = jest.fn();
  const habits = [{ _id: 'habit1', title: 'Exercise', positive: true, negative: false, positiveCount: 0 }];

  render(
    <TaskArea
      updateHealth={() => {}}
      updateLevel={updateLevelMock}
      updateCoin={updateCoinMock}
      habits={habits}
      dailies={[]}
      todos={[]}
      rewards={[]}
      onAddHabit={() => {}}
      onUpdateHabit={onUpdateHabitMock}
      onDeleteHabit={() => {}}
      onAddDaily={() => {}}
      onUpdateDaily={() => {}}
      onDeleteDaily={() => {}}
      onAddTodo={() => {}}
      onUpdateTodo={() => {}}
      onDeleteTodo={() => {}}
      onAddReward={() => {}}
      onUpdateReward={() => {}}
      onDeleteReward={() => {}}
      onClear={() => {}}
    />
  );

  // 假设正面习惯按钮渲染为 "+"
  const positiveHabitButton = screen.getByText('+');
  fireEvent.click(positiveHabitButton);

  // 验证是否正确调用了更新硬币和等级的函数
  expect(updateCoinMock).toHaveBeenCalled();
  expect(updateLevelMock).toHaveBeenCalled();
  // 验证是否更新了习惯的 positiveCount
  expect(onUpdateHabitMock).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
    positiveCount: 1
  }));
});

test('handlePayReward decreases coin correctly and shows success popup when enough coins', () => {
  const decreaseCoinMock = jest.fn();
  const rewards = [{ _id: 'reward1', title: 'Ice Cream', cost: 5 }];
  const coin = 10; // 假设用户有足够的硬币

  render(
    <TaskArea
      updateHealth={() => {}}
      updateLevel={() => {}}
      updateCoin={() => {}}
      coin={coin}
      decreaseCoin={decreaseCoinMock}
      habits={[]}
      dailies={[]}
      todos={[]}
      rewards={rewards}
      onAddHabit={() => {}}
      onUpdateHabit={() => {}}
      onDeleteHabit={() => {}}
      onAddDaily={() => {}}
      onUpdateDaily={() => {}}
      onDeleteDaily={() => {}}
      onAddTodo={() => {}}
      onUpdateTodo={() => {}}
      onDeleteTodo={() => {}}
      onAddReward={() => {}}
      onUpdateReward={() => {}}
      onDeleteReward={() => {}}
      onClear={() => {}}
    />
  );

  // 假设奖励按钮渲染为奖励的成本
  const rewardButton = screen.getByText('5 coins');
  fireEvent.click(rewardButton);

  // 验证是否正确减少了硬币
  expect(decreaseCoinMock).toHaveBeenCalledWith(5);
  // 验证成功的弹窗是否显示
  expect(screen.getByText('Purchase Successful')).toBeInTheDocument();
});

test('adds a daily task correctly', () => {
  const onAddDailyMock = jest.fn();
  render(
    <TaskArea
      updateHealth={() => { }}
      updateLevel={() => { }}
      updateCoin={() => { }}
      coin={10}
      habits={[]}
      dailies={[]}
      todos={[]}
      rewards={[]}
      onAddHabit={() => { }}
      onUpdateHabit={() => { }}
      onDeleteHabit={() => { }}
      onAddDaily={onAddDailyMock}
      onUpdateDaily={() => { }}
      onDeleteDaily={() => { }}
      onAddTodo={() => { }}
      onUpdateTodo={() => { }}
      onDeleteTodo={() => { }}
      onAddReward={() => { }}
      onUpdateReward={() => { }}
      onDeleteReward={() => { }}
      onClear={() => { }}
    />
  );

  const dailyInput = screen.getByPlaceholderText('Add a daily');
  fireEvent.change(dailyInput, { target: { value: 'Check emails' } });
  fireEvent.keyDown(dailyInput, { key: 'Enter', code: 'Enter' });

  expect(onAddDailyMock).toHaveBeenCalledWith(expect.objectContaining({
    content: 'Check emails',
    repeats: "daily",
    "repeatEvery": "1",
    completed: false
  }));
});

test('deletes a todo correctly', () => {
  const onDeleteTodoMock = jest.fn();
  const todos = [{ id: 'todo1', content: 'Finish assignment', completed: false }];
  render(
    <TaskArea
      // 省略其他props以简化代码
      todos={todos}
      onDeleteTodo={onDeleteTodoMock}
    />
  );

  // 假设点击待办事项会出现删除按钮（这取决于你的实现）
  const todoItem = screen.getByText('Finish assignment');
  fireEvent.click(todoItem); // 模拟点击待办事项

  const deleteButton = screen.getByText('Delete'); // 假设删除按钮的文本是"Delete"
  fireEvent.click(deleteButton);

  expect(onDeleteTodoMock).toHaveBeenCalledWith('todo1');
});

test('shows failure popup when insufficient coins for a reward', () => {
  const coin = 2; // 假设用户硬币不足
  const rewards = [{ _id: 'reward2', title: 'Movie Ticket', cost: 10 }];
  render(
    <TaskArea
      // 省略其他props以简化代码
      coin={coin}
      rewards={rewards}
    />
  );

  const rewardButton = screen.getByText('10 coins');
  fireEvent.click(rewardButton);

  // 验证失败的弹窗是否显示，依赖于具体实现可能需要调整断言
  expect(screen.getByText('Purchase Failed')).toBeInTheDocument();
});

test('updates a reward correctly', () => {
  const onUpdateRewardMock = jest.fn();
  const rewards = [{ id: 'reward1', title: 'Ice Cream', cost: 5 }];
  render(
    <TaskArea
      // 省略其他props以简化代码
      rewards={rewards}
      onUpdateReward={onUpdateRewardMock}
    />
  );

  // 假设点击奖励项会展示编辑表单（这取决于你的实现）
  const rewardItem = screen.getByText('Ice Cream');
  fireEvent.click(rewardItem); // 模拟点击奖励项

  // 假设编辑表单中的保存按钮文本是"Save"
  const saveButton = screen.getByText('Save');
  fireEvent.click(saveButton);

  expect(onUpdateRewardMock).toHaveBeenCalled();
});

test('adds a todo correctly', () => {
  const onAddTodoMock = jest.fn();
  render(
    <TaskArea
      // 省略其他props以简化
      onAddTodo={onAddTodoMock}
    />
  );

  const todoInput = screen.getByPlaceholderText('Add a To Do');
  fireEvent.change(todoInput, { target: { value: 'Complete project' } });
  fireEvent.keyDown(todoInput, { key: 'Enter', code: 'Enter' });

  expect(onAddTodoMock).toHaveBeenCalledWith(expect.objectContaining({
    content: 'Complete project',
    completed: false
    // 你可能还需要添加其他由 onAddTodo 函数期望的属性
  }));
});

test('adds a habit correctly when enter is pressed', async () => {
  const onAddHabitMock = jest.fn();
  render(<TaskArea onAddHabit={onAddHabitMock} {...otherProps} />);

  const habitInput = screen.getByPlaceholderText('Add a habit');
  fireEvent.change(habitInput, { target: { value: 'New Habit' } });
  fireEvent.keyPress(habitInput, { key: 'Enter', code: 'Enter' });

  expect(onAddHabitMock).toHaveBeenCalledTimes(1);
  expect(onAddHabitMock).toHaveBeenCalledWith(expect.objectContaining({
    content: 'New Habit',
    positive: true, // 或其他默认值
    negative: true, // 或其他默认值
  }));
});
