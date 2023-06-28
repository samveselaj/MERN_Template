import React, {
    useState,
    useRef,
    useEffect
} from 'react';
import {
    faCircleExclamation,
    faUserPlus
} from '@fortawesome/free-solid-svg-icons';
import {
    faFacebookF,
    faGoogle
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    Link,
    useNavigate
} from 'react-router-dom';
import useSessionStorage from '../hooks/useSessionStorage';

export async function google() {
    window.open(`${process.env.REACT_APP_API_URL}/auth/google`, "_self");
};

function Signup() {
    const navigate = useNavigate();
    const [username, setUsername] = useSessionStorage("username", "");
    const [email, setEmail] = useSessionStorage("email", "");
    const [password, setPassword] = useSessionStorage("password", "");
    const [confirmPassword, setConfirmPassword] = useSessionStorage("confirmPassword", "");
    const [submit, setSubmit] = useState(false);
    const [error, setError] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const [openOtp, setOpenOtp] = useState(false);

    const submitForm = async (e) => {
        e.preventDefault();
        if (!submit) {
            if ((!username || (username && username.trim().length <= 0)) || (!email || (email && email.trim().length <= 0)) || (!password || (password && password.trim().length <= 0)) || (!confirmPassword || (confirmPassword && confirmPassword.trim().length <= 0))) {
                setError(true);
                setSubmit(false);
            }
            else {
                const result = window.confirm("Are you sure?");

                if (result === false || result === "false") {
                    e.preventDefault();
                } else {
                    setSubmit(true);
                    e.preventDefault();
                    const url = `${process.env.REACT_APP_API_URL}/auth/signup`;
                    const fd = new URLSearchParams();
                    fd.append("username", username.toLowerCase());
                    fd.append("email", email.toLowerCase());
                    fd.append("password", password);
                    fd.append("confirmPassword", confirmPassword);
                    try {
                        setLoading(true);
                        const response = await fetch(url, {
                            method: "POST",
                            body: fd
                        });
                        const responseText = await response.text();
                        let responseData;
                        try {
                            responseData = JSON.parse(responseText);
                        } catch (err) {
                            responseData = null;
                            setSubmit(false);
                        }
                        if (responseData && Object.keys(responseData).length > 0) {
                            if (responseData.error) {
                                setLoading(true);
                                setError(true);
                                setResponseMessage(responseData.error);
                                window.sessionStorage.removeItem("password");
                                window.sessionStorage.removeItem("confirmPassword");
                                setLoading(false);
                            } else {
                                setError(false);
                                setResponseMessage("");
                                setLoading(true);
                                setOpenOtp(true);
                                window.sessionStorage.removeItem("password");
                                window.sessionStorage.removeItem("confirmPassword");
                                // navigate("/verifyOTP");
                                // window.location.reload();
                                setLoading(false);
                            }
                        } else {
                            setError(true);
                            setResponseMessage("Something went wrong. Please try again later.");
                            setSubmit(false);
                        }
                    } catch (err) {
                        setError(true);
                        setSubmit(false);
                    } finally {
                        setSubmit(false);
                        setLoading(false);
                    }
                }
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
        const url = `${process.env.REACT_APP_API_URL}/auth/verifyOTP`;
        const fd = new URLSearchParams();
        fd.append("otp", otp.join(""));
        fd.append("username", username);
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
            }
            catch (err) {
                responseData = null;
            }
            if (responseData && Object.keys(responseData).length > 0) {
                console.log(responseData);
                if (responseData.error) {
                    setLoading(false);
                    setError(true);
                    setResponseMessage(responseData.error);
                } else {
                    setLoading(false);
                    setError(false);
                    setResponseMessage(responseData.message);
                    window.sessionStorage.removeItem("password");
                    window.sessionStorage.removeItem("confirmPassword");
                    navigate("/login");
                }
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setResponseMessage("Something went wrong. Please try again later.");
        }
    }

    const resendOTP = async (e) => {
        e.preventDefault();
        const url = `${process.env.REACT_APP_API_URL}/auth/resendOTP`;
        const fd = new URLSearchParams();
        fd.append("username", username);
        try {
            setLoading(true);
            const response = await fetch(url, {
                method: "POST",
                body: fd
            });
            console.log(response);
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
                    setLoading(false);
                    setError(true);
                    setResponseMessage(responseData.error);
                } else {
                    setLoading(false);
                    setError(false);
                    setResponseMessage(responseData.message);
                    window.sessionStorage.removeItem("password");
                    window.sessionStorage.removeItem("confirmPassword");
                }
            } else {
                setLoading(false);
                setError(true);
                setResponseMessage("Something went wrong. Please try again later.");
            }
        } catch (err) {
            setLoading(false);
            setError(true);
            setResponseMessage("Something went wrong. Please try again later.");
        }
    }

    return (
        <div className="navbar-padding auth-container">
            {loading ? <p>loading...</p> : (
                openOtp ? (
                    <div className="width-container">
                        <div className="auth-form-container">
                            <h1 className="auth-form-title">Verify OTP</h1>
                            {error && responseMessage ? <p className="response-message">{responseMessage}</p> : null}
                            <p className="otp-info-message">A <b>six digit</b> random number has been sent to your email address. Please enter that number below:</p>
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
                ) : (
                    <div className="width-container">
                        <div className="auth-form-container">
                            <h1 className="auth-form-title"><FontAwesomeIcon icon={faUserPlus} /> Signup</h1>
                            <form onSubmit={submitForm}>
                                <div className="auth-form-group">
                                    {error && responseMessage ? <p className="response-message">{responseMessage}</p> : null}
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
                                    {error && (!username || (username && username.trim().length <= 0)) ?
                                        <div className='auth-form-error-message'>
                                            <FontAwesomeIcon icon={faCircleExclamation} /> Field is required
                                        </div>
                                        : null
                                    }
                                </div>
                                <div className="auth-form-group">
                                    <label htmlFor="email">Email:</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        autoComplete="off"
                                        aria-describedby="uidnote"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    {error && (!email || (email && email.trim().length <= 0)) ?
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
                                <button className="submit-auth-form" type="submit">Sign up</button>
                                <div className="form-line-text flex-center" style={{ padding: "14px 0 10px 0" }}>
                                    <p style={{ margin: "0 2px" }}>Already a member?</p>
                                    <Link to="/login" style={{ margin: "0 2px" }}>Login</Link>
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
                )
            )}
        </div>
    )
}

export default Signup;