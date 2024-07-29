import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './NavBar';

describe('Navbar component', () => {
  test('renders Navbar correctly', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(getByText('MEMO MINDER')).toBeInTheDocument();
  });

  test('handles task link click', () => {
    const handleTaskClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleTaskClick={handleTaskClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Tasks'));

    expect(handleTaskClick).toHaveBeenCalled();
  });

  test('handles shop link click', () => {
    const handleShopClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleShopClick={handleShopClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Shops'));

    expect(handleShopClick).toHaveBeenCalled();
  });

  test('handles challenge link click', () => {
    const handleChallengeClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleChallengeClick={handleChallengeClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Challenges'));

    expect(handleChallengeClick).toHaveBeenCalled();
  });

  test('handles milestones link click', () => {
    const handleMilestonesClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleMilestonesClick={handleMilestonesClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Milestones'));

    expect(handleMilestonesClick).toHaveBeenCalled();
  });

  test('toggles user menu on user pic click', () => {
    const { getByAltText, getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const userPic = getByAltText('user-pic');
    fireEvent.click(userPic);

    expect(getByText('Log Out')).toBeInTheDocument();
  });

  test('logs out when "Log Out" link is clicked', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Log Out'));

    expect(window.location.pathname).toBe('/login');
  });

  test('scrolls to bottom when shop link is clicked', () => {
    const handleShopClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleShopClick={handleShopClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Shops'));

    expect(handleShopClick).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalled();
  });

  test('scrolls to bottom when challenge link is clicked', () => {
    const handleChallengeClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleChallengeClick={handleChallengeClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Challenges'));

    expect(handleChallengeClick).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalled();
  });

  test('scrolls to bottom when milestones link is clicked', () => {
    const handleMilestonesClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleMilestonesClick={handleMilestonesClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Milestones'));

    expect(handleMilestonesClick).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalled();
  });

  test('scrolls to bottom after a delay', () => {
    jest.useFakeTimers();

    const { getByAltText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const userPic = getByAltText('user-pic');
    fireEvent.click(userPic);

    jest.advanceTimersByTime(201); // advance timer beyond 200ms

    expect(window.scrollTo).toHaveBeenCalled();
  });
  test('does not toggle user menu when other area is clicked', () => {
    const { getByAltText, queryByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    const userPic = getByAltText('user-pic');
    fireEvent.click(userPic);
  
    const otherArea = document.body;
    fireEvent.click(otherArea);
  
    expect(queryByText('Log Out')).not.toBeInTheDocument();
  });
  
  test('does not scroll to bottom if delay not exceeded', () => {
    jest.useFakeTimers();
  
    const { getByAltText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    const userPic = getByAltText('user-pic');
    fireEvent.click(userPic);
  
    jest.advanceTimersByTime(199); // advance timer within 200ms
  
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
  test('toggles user menu when user pic is clicked', () => {
    const { getByAltText, getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    const userPic = getByAltText('user-pic');
    fireEvent.click(userPic);
  
    expect(getByText('Log Out')).toBeInTheDocument();
  
    fireEvent.click(userPic);
  
    expect(getByText('Log Out')).not.toBeInTheDocument();
  });
  
  test('displays username when user is logged in', () => {
    const username = 'testuser';
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    expect(getByText(username)).toBeInTheDocument();
  });
  
  test('displays "Log Out" link when user is logged in', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    expect(getByText('Log Out')).toBeInTheDocument();
  });
  
  test('does not display username when user is not logged in', () => {
    // Mocking user not logged in by not passing handleLoginSuccess
    const { queryByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    expect(queryByText('testuser')).not.toBeInTheDocument();
  });
  
  test('does not display "Log Out" link when user is not logged in', () => {
    // Mocking user not logged in by not passing handleLoginSuccess
    const { queryByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );
  
    expect(queryByText('Log Out')).not.toBeInTheDocument();
  });
  test('renders Navbar correctly', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(getByText('MEMO MINDER')).toBeInTheDocument();
  });

  test('handles task link click', () => {
    const handleTaskClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleTaskClick={handleTaskClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Tasks'));

    expect(handleTaskClick).toHaveBeenCalled();
  });

  // 添加测试用例来检查用户登录状态下的菜单项显示
  test('displays correct menu items when user is logged in', () => {
    setAuthInfo('username', 'token', 'id'); // 模拟已登录状态

    const { getByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(getByText('Log Out')).toBeInTheDocument(); // 检查登出菜单项是否显示
  });

  // 添加测试用例来检查用户菜单的显示与隐藏
  test('toggles user menu visibility on user pic click', () => {
    const { getByAltText, queryByText } = render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const userPic = getByAltText('user-pic');
    fireEvent.click(userPic);

    expect(queryByText('Log Out')).toBeInTheDocument(); // 检查菜单项是否显示

    fireEvent.click(userPic);

    expect(queryByText('Log Out')).not.toBeInTheDocument(); // 检查菜单项是否隐藏
  });

  // 添加测试用例来检查滚动到底部的条件是否正确触发
  test('scrolls to bottom when shop link is clicked', () => {
    const handleShopClick = jest.fn();
    const { getByText } = render(
      <MemoryRouter>
        <Navbar handleShopClick={handleShopClick} />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Shops'));

    expect(handleShopClick).toHaveBeenCalled();
    expect(window.scrollTo).toHaveBeenCalled();
  });
});
