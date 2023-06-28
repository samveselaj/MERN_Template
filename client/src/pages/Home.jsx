import React, { useContext } from 'react';
import { MyContext } from '../App.js';

function Home() {
    const { user } = useContext(MyContext);

    return (
        user && user.username ? (
            <div className="navbar-padding">Hello <b>{user.username}</b></div>
        ) : (
            <div className="navbar-padding">Hello Guest</div>
        )
    )
}

export default Home;