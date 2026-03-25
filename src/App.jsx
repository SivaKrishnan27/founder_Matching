import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'

import Login       from './pages/Login'
import Dashboard   from './pages/Dashboard'
import Matches     from './pages/Matches'
import Ideas       from './pages/Ideas'
import Skills      from './pages/Skills'
import Chat        from './pages/Chat'
import MyStartups  from './pages/MyStartups'
import Progress    from './pages/Progress'
import Investors   from './pages/Investors'
import InvestorMatch from './pages/InvestorMatch'
import Analytics   from './pages/Analytics'
import Profile     from './pages/Profile'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename='/founder_Matching'>
        <Routes>
          <Route path="/login"  element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/" index exact  element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/matches"     element={<PrivateRoute><Matches /></PrivateRoute>} />
          <Route path="/ideas"       element={<PrivateRoute><Ideas /></PrivateRoute>} />
          <Route path="/skills"      element={<PrivateRoute><Skills /></PrivateRoute>} />
          <Route path="/chat"        element={<PrivateRoute><Chat /></PrivateRoute>} />
          <Route path="/my-startups" element={<PrivateRoute><MyStartups /></PrivateRoute>} />
          <Route path="/progress"    element={<PrivateRoute><Progress /></PrivateRoute>} />
          <Route path="/investors"   element={<PrivateRoute><Investors /></PrivateRoute>} />
          <Route path="/investor-match" element={<PrivateRoute><InvestorMatch /></PrivateRoute>} />
          <Route path="/analytics"   element={<PrivateRoute><Analytics /></PrivateRoute>} />
          <Route path="/profile"     element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="*"            element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
