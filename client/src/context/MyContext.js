import React, { createContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import useLocalStorage from '../hooks/useLocalStorage';

export const MyContext = createContext();

const MyContextProvider = ({ children }) => {
    const [theme, setTheme] = useLocalStorage("theme", "light");
    const [loading, setLoading] = useState(true);
    const [loggedIn, setLoggedIn] = useState(false);

    const userFromSessionStorage = window.sessionStorage.getItem("user");

    let contextValues = {
        setLoading: setLoading,
        loading: loading,
        setLoggedIn: setLoggedIn,
        theme: theme,
        setTheme: setTheme,
        loggedIn: loggedIn,
    }
    if (userFromSessionStorage) {
        contextValues.user = JSON.parse(userFromSessionStorage);
    }

    useEffect(() => {
        async function checkToken() {
            setLoading(true);
            const accessToken = Cookies.get("accessToken");
            const refreshToken = Cookies.get("refreshToken");
            const url = `${process.env.REACT_APP_API_URL}/auth/token`;
            const fd = new URLSearchParams();
            fd.append("accessToken", accessToken);
            fd.append("refreshToken", refreshToken);
            const response = await fetch(url, {
                method: "POST",
                body: fd
            });
            const responseText = await response.text();
            let responseData = null;
            try {
                responseData = JSON.parse(responseText);
            } catch (err) {
                responseData = null;
            } finally {
                setLoading(false);
            }
            if (!responseData || (response && response.status !== 200)) {
                Cookies.remove("accessToken");
                Cookies.remove("refreshToken");
                window.sessionStorage.clear();
                return;
            } else {
                window.sessionStorage.setItem("user", JSON.stringify(responseData.user));
                setLoggedIn(true);
            }
        }
        checkToken();
    }, []);
    return (
        <MyContext.Provider value={contextValues}>
            {children}
        </MyContext.Provider>
    );
};

export { MyContextProvider };
