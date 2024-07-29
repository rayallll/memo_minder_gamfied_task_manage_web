import axios from 'axios';
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login.css';
import { BASE_URL, STATUS_CODE, SERVER_API } from '../../utils/constants';
import { setAuthInfo, clearAuthInfo } from '../../utils/auth'

export const Login = ({handleLoginSuccess}) => {
    clearAuthInfo();
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        console.debug('handleSubmit');

        e.preventDefault();
        try {
            const response = await axios.post(BASE_URL + SERVER_API.LOGIN, {
                'username': email,
                'password': pass,
                'email': email
            });
            if (response?.data?.token && response?.data?.id && response?.data?.username) {
                console.debug('sign in success:', response.status);
                setAuthInfo(response.data.username, response.data.token, response.data.id)
                handleLoginSuccess();
                navigate("/");
            }
        } catch (error) {
            console.warn('sign in error:', error);
            clearAuthInfo();
        }
    }

    return (
        <div className="login">
            <div className="auth-form-container" >
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">User Name</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your User Name" id="email" name="email" />
                    <label htmlFor="password">Password</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                    <button className="login-btn" type="submit">Log In</button>
                </form>
                <Link to="/register">
                    <button className="link-btn">Don't have an account? Register.</button>
                </Link>
            </div>
        </div>
    )
}
