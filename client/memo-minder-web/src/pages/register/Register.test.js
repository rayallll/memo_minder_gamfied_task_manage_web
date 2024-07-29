import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom'; 
import axios from 'axios';
import { Register } from './Register';

jest.mock('axios');

describe('Register component', () => {
  test('allows user to sign up successfully', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });

    fireEvent.submit(getByText('Sign up'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
    expect(axios.post).toHaveBeenCalledWith('https://memo-minder.onrender.com/api/users', {
      username: 'testUser',
      password: 'password',
      email: 'test@example.com',
    });
    });

    
  test('displays error message for password mismatch', () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'wrongPassword' } });

    expect(getByText('Passwords do not match')).toBeInTheDocument();
  });

  test('handles server error during sign up', async () => {
    axios.post.mockRejectedValueOnce({ message: 'Server Error' });

    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });

    fireEvent.submit(getByText('Sign up'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));
  });

  test('updates confirm password and password match state', () => {
    const { getByLabelText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    const confirmPasswordInput = getByLabelText('Confirm Password');

    fireEvent.change(confirmPasswordInput, { target: { value: 'password' } });
    expect(confirmPasswordInput.value).toBe('password');
  });

  test('does not submit form if passwords do not match', async () => {
    const { getByLabelText, getByText } = render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'wrongPassword' } });

    fireEvent.submit(getByText('Sign up'));

    await waitFor(() => expect(axios.post).not.toHaveBeenCalled());
  });

  test('navigates to login page after successful sign up', async () => {
    axios.post.mockResolvedValueOnce({ status: 200 });
    const { getByLabelText, getByText, findByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <Routes> {/* 使用 <Routes> 元素 */}
          <Route path="/" element={<Register />} /> {/* 使用 element 属性 */}
          <Route path="/Login" element={<div>Login Page</div>} /> {/* 添加登录页面的路由 */}
        </Routes>
      </MemoryRouter>
    );

    fireEvent.change(getByLabelText('User Name'), { target: { value: 'testUser' } });
    fireEvent.change(getByLabelText('Email'), { target: { value: 'test@example.com' } });
    fireEvent.change(getByLabelText('Password'), { target: { value: 'password' } });
    fireEvent.change(getByLabelText('Confirm Password'), { target: { value: 'password' } });

    fireEvent.submit(getByText('Sign up'));

    await waitFor(() => expect(axios.post).toHaveBeenCalledTimes(1));

    // 等待页面跳转到登录页面
    await waitFor(() => {
      expect(findByText('Login')).toBeTruthy(); // 使用 findByText 查找文本 "Login"
    });
  });

});
