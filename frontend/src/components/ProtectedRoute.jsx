import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

const ProtectedRoute = ({ children }) => {
    const { member } = useContext(AuthContext);
    const [checkingAuth, setCheckingAuth] = useState(true);
    const [clicked, setClicked] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setCheckingAuth(false);
    }, [member]);

    if (checkingAuth) {
        return <p style={{ textAlign: "center", marginTop: "50px" }}>로딩 중...</p>;
    }

    if (!member) {
        const handleClick = () => {
            setClicked(true);
            setTimeout(() => {
                setClicked(false);
                navigate("/register"); // 색상 변화 후 이동
            }, 200);
        };

        return (
            <div style={{ textAlign: "center", marginTop: "100px" }}>
                <h2>회원가입을 하시겠습니까?</h2>
                <button
                    onClick={handleClick}
                    style={{
                        marginTop: "20px",
                        padding: "12px 24px",
                        backgroundColor: clicked ? "#0056b3" : "#007bff",
                        color: "#fff",
                        borderRadius: "8px",
                        fontWeight: "600",
                        border: "none",
                        cursor: "pointer",
                        transition: "background-color 0.2s ease",
                    }}
                >
                    회원가입 하러 가기
                </button>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
