import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/css/Register.css";
import axios from "axios";

const Register = () => {
    const [form, setForm] = useState({ email: "", password: "", name: "" });
    const [msg, setMsg] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [nameCheckMsg, setNameCheckMsg] = useState("");

    const onChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
        if (e.target.name === "name") setNameCheckMsg("");
    };

    const checkNameDuplicate = async () => {
        if (!form.name) return;
        try {
            const res = await axios.post("http://localhost:8000/api/check-name", { name: form.name });
            setNameCheckMsg(res.data.exists ? "❌ 이미 사용 중인 닉네임입니다." : "✅ 사용 가능한 닉네임입니다.");
        } catch (e) {
            setNameCheckMsg("서버 오류로 확인할 수 없습니다.");
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setMsg("");

        // 이름 검증 (한글 또는 영어만)
        const nameRegex = /^[a-zA-Z가-힣]+$/;
        if (!nameRegex.test(form.name)) {
            setMsg("이름은 한글 또는 영어만 입력 가능합니다.");
            return;
        }

        // 이메일 검증 (@gmail.com만 허용)
        const gmailRegex = /^[^\s@]+@gmail\.com$/;
        if (!gmailRegex.test(form.email)) {
            setMsg("이메일은 @gmail.com 형식만 가능합니다.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/api/register", form);
            if (res.data.ok) {
                setMsg(`🎉 회원가입 성공! 환영합니다, ${res.data.user.name}님`);
                setForm({ email: "", password: "", name: "" });
                setNameCheckMsg("");
            } else {
                setMsg(res.data.msg || "회원가입 실패");
            }
        } catch (e) {
            setMsg(e.response?.data?.msg || "서버 오류가 발생했습니다.");
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
            {/* 페이지 상단 로고 / 타이틀 */}
            <h1 style={{ fontSize: "48px", fontWeight: "700", color: "#1e293b", marginBottom: "40px" }}>
                SnapShare
            </h1>

            {/* 회원가입 폼 컨테이너 */}
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
                    회원가입
                </h2>

                <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "15px" }}>email</label>
                        <input
                            name="email"
                            value={form.email}
                            onChange={onChange}
                            placeholder="snapshare@gmail.com"
                            style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "16px", outline: "none", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)" }}
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
                            style={{ width: "100%", padding: "14px 40px 14px 14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "16px", outline: "none", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)" }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ position: "absolute", right: "12px", top: "70%", transform: "translateY(-50%)", border: "none", background: "none", cursor: "pointer", padding: "0" }}
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

                    <div>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "8px", fontSize: "15px" }}>name</label>
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            <input
                                name="name"
                                value={form.name}
                                onChange={onChange}
                                placeholder="닉네임"
                                onBlur={checkNameDuplicate}
                                style={{ flex: 1, padding: "14px", borderRadius: "12px", border: "1px solid #e2e8f0", fontSize: "16px", outline: "none", boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)" }}
                            />
                        </div>
                        {nameCheckMsg && <p style={{ marginTop: "6px", fontSize: "14px", color: nameCheckMsg.includes("✅") ? "green" : "red" }}>{nameCheckMsg}</p>}
                    </div>

                    <button
                        type="submit"
                        style={{ width: "100%", padding: "14px", border: "none", borderRadius: "12px", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", fontSize: "18px", fontWeight: "700", cursor: "pointer" }}
                    >
                        회원가입
                    </button>
                </form>

                <p style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#6b7280" }}>
                    이미 계정이 있으신가요? <Link to="/login" style={{ color: "#2563eb", textDecoration: "underline" }}>로그인</Link>
                </p>

                {msg && <p style={{ marginTop: "20px", textAlign: "center", color: msg.includes("성공") ? "#2563eb" : "#dc2626", fontWeight: "600", fontSize: "16px" }}>{msg}</p>}
            </div>
        </div>
    );
};

export default Register;
