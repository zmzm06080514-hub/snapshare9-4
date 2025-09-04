import { useState, createContext } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Save from './components/Save';
import List from './components/List';
import Detail from "./components/Detail";
import Update from "./components/Update";
import Register from "./components/Register";
import Login from "./components/Login";
import ProtectedRoute from "./components/ProtectedRoute"; // 추가

export const AuthContext = createContext();

function App() { 
  const [member, setMember] = useState(
    JSON.parse(localStorage.getItem("member")) || null
  );

  const [token, setToken] = useState(
    localStorage.getItem("token") || null
  );

  return (
    <AuthContext.Provider value={{ member, setMember, token, setToken }}>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path='/' element={<Home/>}/>          
          <Route path='/save' element={<ProtectedRoute><Save/></ProtectedRoute>}/>          
          <Route path='/list' element={<ProtectedRoute><List/></ProtectedRoute>}/>                    
          <Route path='/board/:id' element={<ProtectedRoute><Detail/></ProtectedRoute>}/>                    
          <Route path='/update/:id' element={<ProtectedRoute><Update/></ProtectedRoute>}/>   
          <Route path='/register' element={<Register/>}/>                 
          <Route path='/login' element={<Login/>}/>                 
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
