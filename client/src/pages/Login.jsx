import React, { useState } from 'react';
import { faCircleExclamation, faRightToBracket } from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF,
    faGoogle
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from 'react-router-dom';
import useSessionStorage from '../hooks/useSessionStorage';
import Cookies from 'js-cookie';

export async function google() {
    window.open(`${process.env.REACT_APP_API_URL}/auth/google`, "_self");
};

function Login() {
    const navigate = useNavigate();
    const [username, setUsername] = useSessionStorage("username", "");
    const [password, setPassword] = useSessionStorage("password", "");
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const submitForm = async (e) => {
        e.preventDefault();
        if (!submit) {
            if ((!username || (username && username.trim().length <= 0)) || (!password || (password && password.trim().length <= 0))) {
                setError(true);
                setSubmit(false);
            }
            else {
                setSubmit(true);
                e.preventDefault();
                const url = `${process.env.REACT_APP_API_URL}/auth/login`;
                const fd = new URLSearchParams();
                fd.append("username", username.toLowerCase());
                fd.append("password", password);
                try {
                    setLoading(true);
                    const response = await fetch(url, {
                        method: "POST",
                        body: fd
                    });
                    let responseData = null;
                    const responseText = await response.text();
                    try {
                        responseData = JSON.parse(responseText);
                    } catch (err) {
                        responseData = null;
                    }
                    if (responseData && Object.keys(responseData).length > 0) {
                        console.log(responseData);
                        if (responseData.error) {
                            setLoading(true);
                            setError(true);
                            setResponseMessage(responseData.error);
                            setLoading(false);
                        } else if (responseData.message && responseData.accessToken && responseData.refreshToken && responseData.user) {
                            setError(false);
                            setResponseMessage(responseData.message);
                            setLoading(true);
                            navigate("/");
                            Cookies.set("accessToken", responseData.accessToken, { expires: 1 });
                            Cookies.set("refreshToken", responseData.refreshToken, { expires: 1 });
                            window.sessionStorage.setItem("user", JSON.stringify(responseData.user));
                            window.sessionStorage.removeItem("username");
                            window.sessionStorage.removeItem("password");
                            window.location.reload();
                            setLoading(false);
                        } else {
                            setError(true);
                            setResponseMessage("Something went wrong");
                            setLoading(false);
                        }
                    }
                } catch (err) {
                    setError(true);
                    setSubmit(false);
                    setLoading(false);
                } finally {
                    setSubmit(false);
                    setLoading(false);
                }
            }
        }
    }

    return (
        <div className="navbar-padding auth-container">
            {loading ? <p>loading...</p> : (
                <div className="width-container">
                    <div className="auth-form-container">
                        <h1 className="auth-form-title"><FontAwesomeIcon icon={faRightToBracket} /> Login</h1>
                        <form onSubmit={submitForm}>
                            <div className="auth-form-group">
                                {error && responseMessage ? <p className="response-message">{responseMessage}</p> : null}
                                <label htmlFor="username">Username:</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                                {error && (!username || (username && username.trim().length <= 0)) ?
                                    <div className='auth-form-error-message'>
                                        <FontAwesomeIcon icon={faCircleExclamation} /> Field is required
                                    </div>
                                    : null
                                }
                            </div>
                            <div className="auth-form-group">
                                <label htmlFor="password">Password:</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                {error && (!password || (password && password.trim().length <= 0)) ?
                                    <div className='auth-form-error-message'>
                                        <FontAwesomeIcon icon={faCircleExclamation} /> Field is required
                                    </div>
                                    : null
                                }
                            </div>
                            <div className="form-line-text flex-center" style={{ padding: "10px 0 24px 0" }}>
                                <div className="remember-me-container flex-center" style={{ margin: "0 16px" }}>
                                    <input type="checkbox" name="remember_me" id="remember_me" />
                                    <p>Remember me</p>
                                </div>
                                <Link to="/forgot-password" style={{ margin: "0 16px" }}>Forgot Password?</Link>
                            </div>
                            <button className="submit-auth-form" type="submit">Login</button>
                            <div className="form-line-text flex-center" style={{ padding: "14px 0 10px 0" }}>
                                <p style={{ margin: "0 2px" }}>Not a member?</p>
                                <Link to="/signup" style={{ margin: "0 2px" }}>Register</Link>
                            </div>
                            <div className="form-line-text flex-center" style={{ padding: "14px 0 10px 0" }}>or sign up with:</div>
                            <div className="form-line-text flex-center" style={{ padding: "14px 0 10px 0" }}>
                                <button
                                    onClick={google}
                                    className="icon-login-button"
                                    type="button"
                                >
                                    <FontAwesomeIcon icon={faGoogle} size='2x' />
                                </button>
                                <button className="icon-login-button" type="button">
                                    <FontAwesomeIcon icon={faFacebookF} size='2x' />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Login;