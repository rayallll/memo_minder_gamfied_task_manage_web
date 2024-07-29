import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { Login } from './Login';

jest.mock('axios');

describe('Login component', () => {
  test('allows user to login successfully', async () => {
    axios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        token: 'testToken',
        id: 'testId',
        username: 'testUser',
      },
    });

    const handleLoginSuccess = jest.fn();

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Login handleLoginSuccess={handleLoginSuccess} />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Email / User Name'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });

    fireEvent.submit(getByText('Log In'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('login'), {
      username: 'test@example.com',
      password: 'password',
      email: 'test@example.com',
    });

    expect(handleLoginSuccess).toHaveBeenCalled();
  });

  test('handles server error during login', async () => {
    axios.post.mockRejectedValueOnce({ message: 'Server Error' });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Email / User Name'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });

    fireEvent.submit(getByText('Log In'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith(expect.stringContaining('login'), {
      username: 'test@example.com',
      password: 'password',
      email: 'test@example.com',
    });
    expect(getByText('sign in error:')).toBeInTheDocument();
  });

  test('navigates to register page when "Register" button is clicked', () => {
    const { getByText } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.click(getByText('Don\'t have an account? Register.'));

    expect(window.location.pathname).toBe('/register');
  });
});
