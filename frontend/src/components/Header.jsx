import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../App";
import { useContext } from "react";

import "../assets/css/Header.css"

const Header = () => {
    const location = useLocation(); // 현재 경로 확인
    const { member, setMember, setToken } = useContext(AuthContext);

    // 회원가입과 로그인 페이지에서는 Header 숨김
    if (location.pathname === "/register" || location.pathname === "/login") return null;

    const handleLogout = () => {
        localStorage.removeItem("member");
        localStorage.removeItem("token");
        setMember(null);
        setToken(null);
    };

    return (
        <>
            <div className="header">
                <Link to="/">Home</Link>
                <Link to="/save">글작성</Link>
                <Link to="/list">글목록</Link>
                {!member && <Link to="/register">회원가입</Link>}
                {!member && <Link to="/login">로그인</Link>}
                {member && <button onClick={handleLogout}>로그아웃</button>}
            </div>
            
            {member && (
                <p style={{ marginTop: "8px" }}>
                    👋 {member.name}님 환영합니다
                </p>
            )}
        </>
    );
};

export default Header;
