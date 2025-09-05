import "../assets/css/Login.css";
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const { setMember, setToken } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const onChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");
        try {
            const res = await axios.post(
                "http://localhost:8000/api/login",
                form,
                { headers: { "Content-Type": "application/json" } }
            );

            if (res.data.ok) {
                setMember(res.data.user);
                setToken(res.data.accessToken);
                localStorage.setItem("member", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.accessToken);

                navigate("/main");
            } else {
                setMsg(res.data.msg || "로그인 실패");
            }
        } catch (e) {
            console.error("Axios error:", e);
            let serverMsg = "서버 오류 발생";
            if (e.response) {
                if (e.response.data && e.response.data.msg) serverMsg = e.response.data.msg;
                else if (typeof e.response.data === "string") serverMsg = e.response.data;
                else serverMsg = e.response.statusText || serverMsg;
            } else if (e.message) {
                serverMsg = e.message;
            }
            setMsg(serverMsg);
        }
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f0f4f8, #d9e4ec)",
                fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
            }}
        >
            <h1 style={{ fontSize: "48px", fontWeight: "700", color: "#1e293b", marginBottom: "40px", textAlign: "center" }}>
                SnapShare
            </h1>

            <div
                style={{
                    width: "560px",
                    padding: "60px",
                    borderRadius: "24px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                }}
            >
                <h2 style={{ textAlign: "center", marginBottom: "40px", fontSize: "34px", color: "#1e293b", fontWeight: "700", letterSpacing: "-0.5px" }}>
                    로그인
                </h2>

                <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
                    <div>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "10px", fontSize: "15px" }}>email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="snapshare@example.com"
                            style={{
                                width: "100%",
                                padding: "18px",
                                borderRadius: "14px",
                                border: "1px solid #e2e8f0",
                                fontSize: "16px",
                                outline: "none",
                                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)",
                                transition: "all 0.2s ease"
                            }}
                            onFocus={(e) => (e.target.style.border = "1px solid #3b82f6")}
                            onBlur={(e) => (e.target.style.border = "1px solid #e2e8f0")}
                        />
                    </div>

                    <div style={{ position: "relative" }}>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "15px" }}>password</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            placeholder="비밀번호를 입력하세요"
                            style={{
                                width: "100%",
                                padding: "14px 40px 14px 14px",
                                borderRadius: "12px",
                                border: "1px solid #e2e8f0",
                                fontSize: "16px",
                                outline: "none",
                                boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
                            }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{
                                position: "absolute",
                                right: "12px",
                                top: "70%",
                                transform: "translateY(-50%)",
                                border: "none",
                                background: "none",
                                cursor: "pointer",
                                padding: "0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center"
                            }}
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z"/>
                                    <line x1="1" y1="1" x2="21" y2="21"/>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="#000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M1 10s4-6 9-6 9 6 9 6-4 6-9 6-9-6-9-6z"/>
                                    <circle cx="10" cy="10" r="3"/>
                                </svg>
                            )}
                        </button>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: "100%",
                            padding: "18px",
                            border: "none",
                            borderRadius: "14px",
                            background: "linear-gradient(135deg, #3b82f6, #2563eb)",
                            color: "#fff",
                            fontSize: "18px",
                            fontWeight: "700",
                            cursor: "pointer",
                            transition: "all 0.3s ease",
                        }}
                        onMouseOver={(e) => (e.target.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)")}
                        onMouseOut={(e) => (e.target.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)")}
                    >
                        로그인
                    </button>
                </form>

                {msg && (
                    <p style={{ marginTop: "35px", textAlign: "center", color: "#dc2626", fontWeight: "600", fontSize: "16px" }}>
                        {msg}
                    </p>
                )}

                {/* 회원가입 연결 버튼 */}
                <div style={{ marginTop: "30px", textAlign: "center", fontSize: "15px" }}>
                    <span>회원가입을 하시겠습니까? </span>
                    <button
                        type="button"
                        onClick={() => navigate("/signup")} // Register.jsx 화면으로 이동
                        style={{
                            border: "none",
                            background: "none",
                            color: "#2563eb",
                            fontWeight: "600",
                            cursor: "pointer",
                            textDecoration: "underline",
                            marginLeft: "5px"
                        }}
                    >
                        회원가입
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
