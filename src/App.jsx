import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import NewsManagement from './pages/NewsManagement'
import UserManagement from './pages/UserManagement'
import NewsDetail from './pages/NewsDetail'
import NewsAll from './pages/NewsAll'
import NewsDetailBasic from './pages/NewsDetailBasic'
import Login from './pages/Login'
import { NewsProvider } from './context/NewsContext'
import { UserProvider } from './context/UserContext'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

const Shell = () => {
  const location = useLocation()
  const hideSidebar = location.pathname === '/login'
  return (
    <div className="flex h-screen bg-gray-50">
      {!hideSidebar && <Sidebar />}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/news" element={<ProtectedRoute><NewsManagement /></ProtectedRoute>} />
          <Route path="/news/:id" element={<ProtectedRoute><NewsDetail /></ProtectedRoute>} />
          <Route path="/news-all" element={<ProtectedRoute><NewsAll /></ProtectedRoute>} />
          <Route path="/news-all/:id" element={<ProtectedRoute><NewsDetailBasic /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute><UserManagement /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <NewsProvider>
          <UserProvider>
            <Shell />
          </UserProvider>
        </NewsProvider>
      </AuthProvider>
    </Router>
  )
}

export default App 