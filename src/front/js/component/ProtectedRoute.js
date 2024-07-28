import React from "react";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem("token");
    const navigate=useNavigate();

    if (!isAuthenticated) {
        return navigate("/auth");

    }

    return children;
};

export default ProtectedRoute;
