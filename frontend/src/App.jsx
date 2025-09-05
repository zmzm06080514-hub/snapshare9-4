import { useState, createContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login.jsx';
import Signup from './components/Signup.jsx';
import MainPage from './components/MainPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

// 인증 상태를 전역에서 관리할 컨텍스트 생성
export const AuthContext = createContext();

function App() { 
  // 로컬 스토리지에서 기존 회원 정보/토큰 가져오기
  const [member, setMember] = useState(
    JSON.parse(localStorage.getItem("member")) || null
  );
  const [token, setToken] = useState(localStorage.getItem("token") || null);

  return (
    <AuthContext.Provider value={{ member, setMember, token, setToken }}>
      <BrowserRouter>
        <Routes>
          {/* 기본 루트는 로그인 페이지로 */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 로그인 및 회원가입 페이지 */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 보호된 메인 페이지 */}
          <Route 
            path="/main" 
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            } 
          />

          {/* 잘못된 경로 접근 시 로그인으로 리디렉션 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
