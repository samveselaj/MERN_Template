import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { faBars, faHome, faInfoCircle, faMagnifyingGlass, faPowerOff, faRightToBracket, faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from 'react-router-dom';
import ReactSwitch from "react-switch";
// import { MyContext } from '../context/MyContext';
import { MyContext } from '../App.js';
import Cookies from 'js-cookie';

export async function google() {
  window.open(`${process.env.REACT_APP_API_URL}/auth/google`, "_self");
};

function Navbar() {
  const navigate = useNavigate();

  const {
    theme,
    setTheme,
    setLoading,
    loggedIn
  } = useContext(MyContext);

  const toggleTheme = () => setTheme(curr => (curr === "light" ? "dark" : "light"));

  const settingsDropdownRef = useRef(null);
  const [settingsDropdown, setSettingsDropdown] = useState(false);

  function toggleSettingsDropdown() {
    setSettingsDropdown(!settingsDropdown);
  }

  const handleClickOutside = useCallback((event) => {
    if (settingsDropdownRef.current && !settingsDropdownRef.current.contains(event.target)) {
      setSettingsDropdown(false);
    }
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      handleClickOutside(event);
    };

    window.document.addEventListener('click', handleDocumentClick);

    return () => {
      window.document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleClickOutside, settingsDropdown]);

  const linksDropdownRef = useRef(null);
  const [linksDropdown, setLinksDropdown] = useState(false);

  function toggleLinksDropdown() {
    setLinksDropdown(!linksDropdown);
  }

  const handleClickOutsideDropdown = useCallback((event) => {
    if (linksDropdownRef.current && !linksDropdownRef.current.contains(event.target)) {
      setLinksDropdown(false);
    }
  }, []);

  useEffect(() => {
    const handleDocumentClick = (event) => {
      handleClickOutsideDropdown(event);
    };

    window.document.addEventListener('click', handleDocumentClick);

    return () => {
      window.document.removeEventListener('click', handleDocumentClick);
    };
  }, [handleClickOutsideDropdown, linksDropdown]);

  useEffect(() => {
    window.document.addEventListener("popstate", () => {
      setSettingsDropdown(false);
      setLinksDropdown(false);
    });

    return () => {
      window.document.removeEventListener("popstate", () => {
        setSettingsDropdown(false);
        setLinksDropdown(false);
      });
    }
  }, [])

  const logout = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      window.open(`${process.env.REACT_APP_API_URL}/auth/google/logout`, "_self");
      const url = `${process.env.REACT_APP_API_URL}/auth/logout`;
      const response = await fetch(url);
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (err) {
        responseData = null;
      }
      if (responseData && responseData.login && responseData.login === "false") {
        alert("login: " + responseData.login);
        setLoading(false);
        navigate("/login");
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        window.sessionStorage.clear();
        window.location.reload();
      } else {
        setLoading(false);
        alert("Logout failed");
      }
    } catch (err) {
      setLoading(false);
      alert("Logout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="navbar-container">
      <div className="navbar-logo">Logo</div>
      <div className="navbar-search">
        <input type="text" name="search" placeholder="Search" id="" />
        <button className="search-submit">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      <div className="navbar-links-bg">
        <Link to="/" className="navbar-link">Home</Link>
        <Link to="/about" className="navbar-link">About</Link>
        <div ref={settingsDropdownRef} className="navbar-link">
          <button onClick={toggleSettingsDropdown}>Settings</button>
          {settingsDropdown && (
            <div className="navbar-dropdown">
              <div className="navbar-dropdown-item">
                <p>Dark Mode</p> <ReactSwitch onChange={toggleTheme} checked={theme === "dark"} />
              </div>
            </div>
          )}
        </div>
        {!loggedIn ? (
          <>
            <Link to="/login" className="navbar-link">Login</Link>
            <Link to="/Signup" className="navbar-link">Signup</Link>
          </>
        ) : (
          <button onClick={logout} className="navbar-link">Logout</button>
        )}
      </div>

      <div ref={linksDropdownRef} className="navbar-links-md">
        <button onClick={toggleLinksDropdown} className="navbar-links-dropdown-button">
          <FontAwesomeIcon icon={faBars} />
        </button>
        {linksDropdown && (
          <div className="navbar-dropdown">
            <Link to="/" className="navbar-dropdown-item">
              <p>Home</p>
              <FontAwesomeIcon icon={faHome} />
            </Link>
            <Link to="/about" className="navbar-dropdown-item">
              <p>About</p>
              <FontAwesomeIcon icon={faInfoCircle} />
            </Link>
            {!loggedIn ? (
              <>
                <Link to="/login" className="navbar-dropdown-item">
                  <p>Login</p>
                  <FontAwesomeIcon icon={faRightToBracket} />
                </Link>
                <Link to="/Signup" className="navbar-dropdown-item">
                  <p>Signup</p>
                  <FontAwesomeIcon icon={faUserPlus} />
                </Link>
              </>
            ) : (
              <button onClick={logout} className="navbar-dropdown-item">
                <p>Logout</p>
                <FontAwesomeIcon icon={faPowerOff} />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar;