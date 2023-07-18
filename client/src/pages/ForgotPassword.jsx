import React, { useState, useRef } from 'react'
import useSessionStorage from '../hooks/useSessionStorage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const navigate = useNavigate();
    const [username, setUsername] = useSessionStorage("username", "");
    const [password, setPassword] = useSessionStorage("password", "");
    const [confirmPassword, setConfirmPassword] = useSessionStorage("confirmPassword", "");
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [previewEmailUrl, setPreviewEmailUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [openOtp, setOpenOtp] = useState(false);
    const [openPasswordPage, setOpenPasswordPage] = useState(false);

    const submitUsername = async (e) => {
        e.preventDefault();
        if (!submit) {
            if ((!username || (username && username.trim().length <= 0))) {
                setError(true);
                setSubmit(false);
            }
            else {
                setSubmit(true);
                e.preventDefault();
                const url = `${process.env.REACT_APP_API_URL}/auth/forgot-password`;
                const fd = new URLSearchParams();
                fd.append("username", username.toLowerCase());
                try {
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
                        if (responseData.error) {
                            setError(true);
                            setResponseMessage(responseData.error);
                        } else if (responseData.message) {
                            setError(false);
                            setPreviewEmailUrl(responseData.previewEmailURL);
                            setOpenOtp(true);
                        }
                    } else {
                        setError(true);
                        setResponseMessage("An error occurred. Please try again later.");
                    }
                } catch (err) {
                    setError(true);
                    setResponseMessage("An error occurred. Please try again later.");
                }
                setSubmit(false);
            }
        }
    }

    const [otp, setOtp] = useState(Array(6).fill(''));
    const otpInputs = useRef([]);

    const handleChange = (index, value) => {
        const updatedOtp = [...otp];
        let numberValue = value;
        if (Number.parseInt(value, 10) === parseInt(value, 10)) numberValue = value;
        else numberValue = '';
        updatedOtp[index] = numberValue;
        setOtp(updatedOtp);

        if (numberValue !== "" && otpInputs.current[index + 1]) {
            otpInputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index, event) => {
        if (event.key === 'Backspace' && otp[index] === '') {
            if (otpInputs.current[index - 1]) {
                otpInputs.current[index - 1].focus();
            }
        }
    };

    const submitOtpForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = `${process.env.REACT_APP_API_URL}/auth/verifyOTP`;
        const fd = new URLSearchParams();
        fd.append("otp", otp.join(""));
        fd.append("username", username);
        try {
            const response = await fetch(url, {
                method: "POST",
                body: fd
            });

            let responseData = null;
            const responseText = await response.text();
            try {
                responseData = JSON.parse(responseText);
            }
            catch (err) {
                responseData = null;
            }
            if (responseData && Object.keys(responseData).length > 0) {
                if (responseData.error) {
                    // setLoading(false);
                    setError(true);
                    setResponseMessage(responseData.error);
                } else {
                    // setLoading(false);
                    setError(false);
                    setResponseMessage(responseData.message);
                    setOpenOtp(false);
                    setOpenPasswordPage(true);
                }
            }
        } catch (err) {
            // setLoading(false);
            setError(true);
            setResponseMessage("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const resendOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = `${process.env.REACT_APP_API_URL}/auth/resendOTP`;
        const fd = new URLSearchParams();
        fd.append("username", username);
        try {
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
                if (responseData.error) {
                    // setLoading(false);
                    setError(true);
                    setResponseMessage(responseData.error);
                } else {
                    // setLoading(false);
                    setError(false);
                    setResponseMessage(responseData.message);
                    window.sessionStorage.removeItem("password");
                    window.sessionStorage.removeItem("confirmPassword");
                }
            } else {
                // setLoading(false);
                setError(true);
                setResponseMessage("Something went wrong. Please try again later.");
            }
        } catch (err) {
            // setLoading(false);
            setError(true);
            setResponseMessage("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
        }
    }

    const submitPasswordForm = async (e) => {
        e.preventDefault();
        setLoading(true);
        const url = `${process.env.REACT_APP_API_URL}/auth/reset-password`;
        const fd = new URLSearchParams();
        fd.append("username", username);
        fd.append("password", password);
        fd.append("confirmPassword", confirmPassword);
        try {
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
                if (responseData.error) {
                    // setLoading(false);
                    setError(true);
                    setResponseMessage(responseData.error);
                } else {
                    // setLoading(false);
                    setError(false);
                    setResponseMessage(responseData.message);
                    setOpenPasswordPage(false);
                    navigate("/login");
                }
            } else {
                // setLoading(false);
                setError(true);
                setResponseMessage("Something went wrong. Please try again later.");
            }
        } catch (err) {
            // setLoading(false);
            setError(true);
            setResponseMessage("Something went wrong. Please try again later.");
        } finally {
            setLoading(false);
            window.sessionStorage.removeItem("password");
            window.sessionStorage.removeItem("confirmPassword");
        }
    }


    return (
        <div className="navbar-padding auth-container">
            {(() => {
                if (loading) {
                    return <p>loading...</p>
                } else if (openOtp) {
                    return (
                        <div className="width-container">
                            {previewEmailUrl && <a href={previewEmailUrl} target="_blank" rel="noreferrer" className="preview-email-link">Preview Email</a>}
                            <div className="auth-form-container">
                                <h1 className="auth-form-title">Verify OTP</h1>
                                {error && responseMessage ? <p className="response-message">{responseMessage}</p> : null}
                                <p className="otp-info-message">A <b>6 digit code number</b> has been sent to your email address. Please enter your code number below:</p>
                                <form onSubmit={submitOtpForm}>
                                    <div className="otp-container">
                                        {otp.map((digit, index) => (
                                            <input
                                                key={index}
                                                type="text"
                                                maxLength="1"
                                                value={digit}
                                                onChange={(e) => handleChange(index, e.target.value)}
                                                onKeyDown={(e) => handleKeyDown(index, e)}
                                                ref={(input) => (otpInputs.current[index] = input)}
                                            />
                                        ))}
                                    </div>
                                    <div className="otp-submit-btn-container">
                                        <button type="submit">Send Code</button>
                                    </div>
                                </form>
                                <button className="otp-resend-btn" onClick={resendOTP} type="button">Resend OTP</button>
                            </div>
                        </div>
                    )
                }
                else if (openPasswordPage) {
                    return (
                        <div className="width-container">
                            <div className="auth-form-container">
                                <h1 className="auth-form-title">Set New Password</h1>
                                {error && responseMessage ? <p className="response-message">{responseMessage}</p> : null}
                                <form onSubmit={submitPasswordForm}>
                                    <div className="auth-form-group">
                                        <label htmlFor="password">New Password:</label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            autoComplete="off"
                                            aria-describedby="uidnote"
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
                                    <div className="auth-form-group">
                                        <label htmlFor="confirm_password">Confirm Password:</label>
                                        <input
                                            type="password"
                                            id="confirm_password"
                                            name="confirm_password"
                                            autoComplete="off"
                                            aria-describedby="uidnote"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                        />
                                        {error && (!confirmPassword || (confirmPassword && confirmPassword.trim().length <= 0)) ?
                                            <div className='auth-form-error-message'>
                                                <FontAwesomeIcon icon={faCircleExclamation} /> Field is required
                                            </div>
                                            : null
                                        }
                                    </div>
                                    <button className="submit-auth-form" type="submit">Set Password</button>
                                </form>
                            </div>
                        </div>
                    )
                } else {
                    return (
                        <div className="width-container">
                            <div className="auth-form-container">
                                <h1 className="auth-form-title">Forgot Password?</h1>
                                {error && responseMessage ? <p className="response-message">{responseMessage}</p> : null}
                                <p className="otp-info-message" style={{ marginBottom: "14px" }}>Enter the usarname you use for this website, and a <b>6 digit code number</b> will be sent to your email for verification</p>
                                <form onSubmit={submitUsername}>
                                    <div className="auth-form-group">
                                        <label htmlFor="username">Username:</label>
                                        <input
                                            type="text"
                                            id="username"
                                            name="username"
                                            autoComplete="off"
                                            aria-describedby="uidnote"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                        />
                                    </div>
                                    <button className="submit-auth-form" type="submit">Send Username</button>
                                </form>
                            </div>
                        </div>
                    )
                }
            })()}
        </div>
    )
}

export default ForgotPassword;