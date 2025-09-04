import "../assets/css/Login.css"
import { useContext, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";

const Login = () => {
    const { setMember, setToken } = useContext(AuthContext);
    const [form, setForm] = useState({ email: "", password: "" });
    const [msg, setMsg] = useState("");
    const [user, setUser] = useState(null);

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

            // 정상 로그인 체크
            if (res.data.ok) {
                setUser(res.data.user);
                setMsg(`🎉 로그인 성공! ${res.data.user.name}님 환영합니다.`);
                setForm({ email: "", password: "" });

                localStorage.setItem("member", JSON.stringify(res.data.user));
                localStorage.setItem("token", res.data.accessToken);

                setMember(res.data.user);
                setToken(res.data.accessToken);
            } else {
                // 서버가 보내는 실패 메시지 사용
                setMsg(res.data.msg || "로그인 실패");
            }
        } catch (e) {
            console.error("Axios error:", e); // 개발자용 디버그
            // e.response가 undefined인 경우가 있어서 메시지 처리 강화
            let serverMsg = "서버 오류 발생";

            if (e.response) {
                // 서버에서 JSON으로 보낸 경우
                if (e.response.data && e.response.data.msg) serverMsg = e.response.data.msg;
                // 서버에서 그냥 문자열을 보낸 경우
                else if (typeof e.response.data === "string") serverMsg = e.response.data;
                // 상태 텍스트 활용
                else serverMsg = e.response.statusText || serverMsg;
            } else if (e.message) {
                // 네트워크 오류 등
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
                justifyContent: "center",
                alignItems: "center",
                background: "linear-gradient(135deg, #f0f4f8, #d9e4ec)"
            }}
        >
            <div
                style={{
                    width: "560px",
                    padding: "60px",
                    borderRadius: "24px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                    background: "rgba(255,255,255,0.95)",
                    backdropFilter: "blur(10px)",
                    fontFamily: "'Inter', 'Segoe UI', Roboto, sans-serif",
                }}
            >
                <h2
                    style={{
                        textAlign: "center",
                        marginBottom: "40px",
                        fontSize: "34px",
                        color: "#1e293b",
                        fontWeight: "700",
                        letterSpacing: "-0.5px"
                    }}
                >
                    Login
                </h2>
                <form onSubmit={onSubmit} style={{ display: "flex", flexDirection: "column", gap: "26px" }}>
                    <div>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "10px", fontSize: "15px" }}>
                            email
                        </label>
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
                    <div>
                        <label style={{ display: "block", fontWeight: "600", marginBottom: "10px", fontSize: "15px" }}>
                            password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={onChange}
                            placeholder="비밀번호를 입력하세요"
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
                        onMouseOver={(e) =>
                            (e.target.style.background = "linear-gradient(135deg, #2563eb, #1d4ed8)")
                        }
                        onMouseOut={(e) =>
                            (e.target.style.background = "linear-gradient(135deg, #3b82f6, #2563eb)")
                        }
                    >
                        로그인
                    </button>
                </form>

                {msg && (
                    <p
                        style={{
                            marginTop: "35px",
                            textAlign: "center",
                            color: msg.includes("성공") ? "#2563eb" : "#dc2626",
                            fontWeight: "600",
                            fontSize: "16px",
                        }}
                    >
                        {msg}
                    </p>
                )}

                {user && (
                    <div
                        style={{
                            marginTop: "30px",
                            padding: "16px",
                            borderRadius: "12px",
                            border: "1px solid #e2e8f0",
                            background: "#f9fafb",
                            boxShadow: "inset 0 1px 3px rgba(0,0,0,0.05)"
                        }}
                    >
                        <div><b>ID:</b> {user.id}</div>
                        <div><b>이메일:</b> {user.email}</div>
                        <div><b>이름:</b> {user.name}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
