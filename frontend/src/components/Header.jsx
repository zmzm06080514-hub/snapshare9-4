import { Link } from "react-router-dom";
import { AuthContext } from "../App";
import { useContext } from "react";

import "../assets/css/Header.css"
const Header = () => {
    // 변경: setToken도 컨텍스트에서 받기
    const { member, setMember,setToken } = useContext(AuthContext);

    const handleLogout = () => {
        localStorage.removeItem("member");
        localStorage.removeItem("token");
        setMember(null); // ✅ 즉시 반영
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
