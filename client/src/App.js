// import React, { useEffect, useState, useContext } from 'react';
// import './assets/css/global.css';
// import { Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Home from './pages/Home/Home';
// import About from './pages/About/About';
// import Settings from './pages/Settings/Settings';
// import Login from './pages/Login/Login';
// import Signup from './pages/Signup/Signup';
// import MissingRoute from './pages/MissingRoute';
// import useLocalStorage from './hooks/useLocalStorage';
// import Cookies from 'js-cookie';
// import ProtectedAuthPages from './pages/ProtectedAuthPages';
// import Footer from './components/Footer';
// import { MyContext, MyContextProvider } from './context/MyContext';

// function App() {
//   const {
//     setLoading,
//     loading,
//     setLoggedIn,
//     theme,
//     setTheme,
//     loggedIn,
//   } = useContext(MyContext);

//   return (
//     loading ? (
//       <div style={{
//         backgroundColor: theme === "dark" ? "#333" : "#fff",
//         color: theme === "dark" ? "#fff" : "#333",
//         minWidth: "100vw",
//         minHeight: "100vh",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         padding: "0",
//         margin: "0",
//       }}>
//         Loading...
//       </div>
//     ) : (
//       <MyContextProvider>
//         <div
//           id={theme}
//           style={{
//             backgroundColor: theme === "dark" ? "#333" : "#fff",
//             color: theme === "dark" ? "#fff" : "#333",
//             minWidth: "100vw",
//             minHeight: "100vh",
//           }}>
//           <Navbar />
//           <Routes>
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/settings" element={<Settings />} />
//             <Route path="/login" element={
//               <ProtectedAuthPages>
//                 <Login />
//               </ProtectedAuthPages>
//             } />
//             <Route path="/signup" element={
//               <ProtectedAuthPages>
//                 <Signup />
//               </ProtectedAuthPages>
//             } />
//             <Route path="*" element={<MissingRoute />} />
//           </Routes>
//         </div>
//         <Footer />
//       </MyContextProvider>
//     )
//   );
// }

// export default App;

import React, { useEffect, useState, createContext } from 'react';
import './assets/css/global.css';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
// import Settings from './pages/Settings/Settings';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MissingRoute from './pages/MissingRoute';
import useLocalStorage from './hooks/useLocalStorage';
import Cookies from 'js-cookie';
import ProtectedAuthPages from './pages/ProtectedAuthPages';
import Footer from './components/Footer';

export const MyContext = createContext();

function App() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

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

  const userFromSessionStorage = window.sessionStorage.getItem("user");

  let contextValues = {
    setLoading: setLoading,
    theme: theme,
    setTheme: setTheme,
    loggedIn: loggedIn,
  }
  if (userFromSessionStorage) {
    const userJson = JSON.parse(userFromSessionStorage);
    contextValues.user = userJson.id
  }

  return (
    loading ? (
      <div style={{
        backgroundColor: theme === "dark" ? "#333" : "#fff",
        color: theme === "dark" ? "#fff" : "#333",
        minWidth: "100vw",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0",
        margin: "0",
      }}>
        Loading...
      </div>
    ) : (
      <MyContext.Provider value={contextValues}>
        <div
          id={theme}
          style={{
            backgroundColor: theme === "dark" ? "#333" : "#fff",
            color: theme === "dark" ? "#fff" : "#333",
            minWidth: "100vw",
            minHeight: "100vh",
          }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
            <Route path="/login" element={
              <ProtectedAuthPages>
                <Login />
              </ProtectedAuthPages>
            } />
            <Route path="/signup" element={
              <ProtectedAuthPages>
                <Signup />
              </ProtectedAuthPages>
            } />
            <Route path="*" element={<MissingRoute />} />
          </Routes>
        </div>
        <Footer />
      </MyContext.Provider>
    )
  );
}

export default App;
