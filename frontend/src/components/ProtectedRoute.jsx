import { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../App";

const ProtectedRoute = ({ children }) => {
    const { member } = useContext(AuthContext);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        setCheckingAuth(false);
    }, [member]);

    if (checkingAuth) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>로딩 중...</p>;
    }

    if (!member) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
