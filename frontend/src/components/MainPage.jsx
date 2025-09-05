import { useContext, useState } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
    const { member, setMember, setToken } = useContext(AuthContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("gallery");
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([
        { from: "친구1", msg: "안녕하세요!" },
        { from: member?.name, msg: "안녕하세요, 사진 공유하셨나요?" },
    ]);

    const handleLogout = () => {
        localStorage.removeItem("member");
        localStorage.removeItem("token");
        setMember(null);
        setToken(null);
        navigate("/login");
    };

    const sendMessage = () => {
        if (chatInput.trim() === "") return;
        setChatMessages([...chatMessages, { from: member?.name, msg: chatInput }]);
        setChatInput("");
    };

    return (
        <div style={{ display: "flex", minHeight: "100vh", fontFamily: "'Inter', sans-serif", background: "#f3f4f6" }}>
            {/* 사이드바 */}
            <aside style={{ width: "240px", background: "#111827", color: "#fff", display: "flex", flexDirection: "column", padding: "30px 20px" }}>
                <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "50px" }}>SnapShare</h1>
                <nav style={{ display: "flex", flexDirection: "column", gap: "25px", fontSize: "16px" }}>
                    <button
                        style={{ background: "none", border: "none", color: activeTab === "gallery" ? "#3b82f6" : "#fff", textAlign: "left", cursor: "pointer", fontWeight: activeTab === "gallery" ? 700 : 500 }}
                        onClick={() => setActiveTab("gallery")}
                    >
                        📷 사진 갤러리
                    </button>
                    <button
                        style={{ background: "none", border: "none", color: activeTab === "chat" ? "#3b82f6" : "#fff", textAlign: "left", cursor: "pointer", fontWeight: activeTab === "chat" ? 700 : 500 }}
                        onClick={() => setActiveTab("chat")}
                    >
                        💬 채팅
                    </button>
                    <button
                        style={{ background: "none", border: "none", color: activeTab === "board" ? "#3b82f6" : "#fff", textAlign: "left", cursor: "pointer", fontWeight: activeTab === "board" ? 700 : 500 }}
                        onClick={() => setActiveTab("board")}
                    >
                        📝 게시판
                    </button>
                </nav>
                <div style={{ marginTop: "auto" }}>
                    <button
                        onClick={handleLogout}
                        style={{ width: "100%", padding: "14px 0", borderRadius: "8px", border: "none", background: "#ef4444", color: "#fff", fontWeight: 600, cursor: "pointer" }}
                    >
                        로그아웃
                    </button>
                </div>
            </aside>

            {/* 메인 컨텐츠 */}
            <main style={{ flex: 1, padding: "40px 60px" }}>
                {/* 상단바 */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h2 style={{ fontSize: "28px", fontWeight: 700 }}>환영합니다, {member?.name}님!</h2>
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <input
                            type="text"
                            placeholder="검색..."
                            style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", outline: "none" }}
                        />
                        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "#3b82f6", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
                            {member?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </div>

                {/* 컨텐츠 영역 */}
                {activeTab === "gallery" && (
                    <section>
                        <h3 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "20px" }}>사진 갤러리</h3>
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "15px" }}>
                            {[...Array(8)].map((_, idx) => (
                                <div key={idx} style={{ height: "150px", background: "#e5e7eb", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>
                                    Photo {idx + 1}
                                </div>
                            ))}
                        </div>
                    </section>
                )}

                {activeTab === "chat" && (
                    <section>
                        <h3 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "20px" }}>채팅</h3>
                        <div style={{ display: "flex", flexDirection: "column", height: "400px", background: "#fff", borderRadius: "10px", padding: "20px", overflowY: "auto", gap: "10px" }}>
                            {chatMessages.map((c, idx) => (
                                <div key={idx} style={{ alignSelf: c.from === member?.name ? "flex-end" : "flex-start", background: c.from === member?.name ? "#3b82f6" : "#d1d5db", color: c.from === member?.name ? "#fff" : "#000", padding: "8px 12px", borderRadius: "10px", maxWidth: "60%" }}>
                                    <strong>{c.from}:</strong> {c.msg}
                                </div>
                            ))}
                        </div>
                        <div style={{ display: "flex", marginTop: "15px", gap: "10px" }}>
                            <input
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                placeholder="메시지를 입력하세요"
                                style={{ flex: 1, padding: "10px 12px", borderRadius: "8px", border: "1px solid #d1d5db", outline: "none" }}
                            />
                            <button onClick={sendMessage} style={{ padding: "10px 20px", borderRadius: "8px", border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600 }}>전송</button>
                        </div>
                    </section>
                )}

                {activeTab === "board" && (
                    <section>
                        <h3 style={{ fontSize: "22px", fontWeight: 600, marginBottom: "20px" }}>게시판</h3>
                        <div style={{ background: "#fff", borderRadius: "10px", padding: "20px" }}>
                            <button style={{ padding: "8px 16px", borderRadius: "6px", border: "none", background: "#3b82f6", color: "#fff", fontWeight: 600, marginBottom: "15px" }}>글쓰기</button>
                            <ul style={{ listStyle: "none", padding: 0 }}>
                                {[...Array(5)].map((_, idx) => (
                                    <li key={idx} style={{ padding: "12px 0", borderBottom: "1px solid #e5e7eb" }}>게시글 제목 {idx + 1}</li>
                                ))}
                            </ul>
                        </div>
                    </section>
                )}
            </main>
        </div>
    );
};

export default MainPage;
