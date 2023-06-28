import React, { useContext } from 'react';
// import { MyContext } from '../context/MyContext';
import { MyContext } from '../App.js';

function Footer() {
    const { theme } = useContext(MyContext);

    return (
        <div className={`footer-container ${theme}`}>
            <div className="footer-content">
                <p>&copy; 2023 Your Website. All rights reserved.</p>
            </div>
        </div>
    )
}

export default Footer;