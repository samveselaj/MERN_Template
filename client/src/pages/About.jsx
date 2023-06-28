import React from 'react';
import logo192 from '../assets/png/logo192.png';

function About() {
    return (
        <div className="navbar-padding about-page">
            <h1 className="page-title">About</h1>
            <div className="content-section">
                <div className="content-section-info">
                    <h2 className="content-section-title">What is this?</h2>
                    <p className="content-section-text">This is a full stack web application that allows users to create an account, login, and create posts. This application was built using the MERN stack (MongoDB, Express, React, Node.js).</p>
                </div>
                <div className="content-section-image-box">
                    <img src={logo192} alt="" />
                </div>
            </div>
        </div>
    )
}

export default About;