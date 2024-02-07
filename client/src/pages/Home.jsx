import React, { useContext } from 'react';
import { MyContext } from '../App.js';

function Home() {
    const { user } = useContext(MyContext);

    return (
        user ? (
            <div className="navbar-padding">Hello <b>{user && user.sub ? user.name : user.username}</b></div>
        ) : (
            <div className="navbar-padding">Hello Guest</div>
        )
    )
}

export default Home;