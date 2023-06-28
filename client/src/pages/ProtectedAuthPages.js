import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { MyContext } from "../App.js";

function ProtectedAuthPages({ children }) {
    const { loggedIn } = useContext(MyContext);
    if (loggedIn) {
        return <Navigate to="/" />
    }
    return children;
}

export default ProtectedAuthPages;