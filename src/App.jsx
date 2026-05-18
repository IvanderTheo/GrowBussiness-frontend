import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'

import { MainLayout } from './layout/MainLayout'
import { AuthLayout } from './layout/AuthLayout'
import { FeatureLayout } from './layout/FeatureLayout'

import { AuthPage } from './pages/AuthPage'
import { LandingPage } from './pages/LandingPage'
import { AiChatPage } from './pages/AiChatPage'
import { ForumPage } from './pages/ForumPage'
import { ForumDetailPage } from './pages/ForumDetailPage'
import { SchedulePage } from './pages/SchedulePage'
import { CalculationPage  } from './pages/CalculationPage'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Layout dengan navbar */}
          <Route path="/" element={<MainLayout><LandingPage/></MainLayout>}/>
          {/* feature layout and protected*/}
          <Route path="/ai" element={<ProtectedRoute><FeatureLayout><AiChatPage/></FeatureLayout></ProtectedRoute>}/>
          <Route path ="/schedule" element={<ProtectedRoute><FeatureLayout><SchedulePage/></FeatureLayout></ProtectedRoute>}/>
          <Route path='/cogs-calculator' element={<ProtectedRoute><FeatureLayout><CalculationPage/></FeatureLayout></ProtectedRoute>}/>
          {/* unprotected route */}
          <Route path='/forum' element={<FeatureLayout><ForumPage/></FeatureLayout>}/>
          <Route path="/forum/:id" element={<FeatureLayout><ForumDetailPage/></FeatureLayout>}/>
          {/* Layout auth tanpa navbar */}
          <Route path="/login" element={<AuthLayout><AuthPage /></AuthLayout>}/>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
