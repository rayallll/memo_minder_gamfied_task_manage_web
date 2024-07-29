import axios from 'axios';
import React, {useState} from "react"
import './register.css';
import { Link, useNavigate } from "react-router-dom";
import {BASE_URL, STATUS_CODE, SERVER_API} from '../../utils/constants'

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const navigate = useNavigate();

    const handleSubmit = async (e) =>{
        e.preventDefault();

        if (!passwordsMatch) {
            console.error("Passwords do not match");
            return;
          }

        console.log(email);

        signUp();
    }

    const signUp = async () => {
        try {
          const response = await axios.post(BASE_URL + SERVER_API.REGISTER, {
            'username': name,
            'password': confirmPass,
            'email': email
          });
          console.debug('sign up success:', response.status);
          navigate("/Login");
        } catch (error) {
          console.warn('sign up error:', error);
        }
      };

    const handleConfirmPassChange = (e) => {
        const confirmPassword = e.target.value;
        setConfirmPass(confirmPassword);
        setPasswordsMatch(confirmPassword === pass);
      }
    
    return (
        <div className="register">
            <div className="auth-form-container">
                <h2>Register</h2>
                <form className="register-form" onSubmit={handleSubmit}>
                    <label htmlFor="name">User Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} type="name" id="name" placeholder="User Name" />
                    <label htmlFor="email">Email</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" id="email" name="email" />
                    <label htmlFor="password">Password</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input value={confirmPass} onChange={handleConfirmPassChange} type="password" placeholder="********" id="confirmPassword" name="confirmPassword"/>
                    
                    {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match</p>}
                    <button className="login-btn" type="submit">Sign up</button>
                </form>
                <Link to="/login">
                    <button className="link-btn">Already have an account? Login here.</button>
                </Link>
            </div>
        </div>
    )
}