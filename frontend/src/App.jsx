import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ModernNavbar from './components/ModernNavbar';
import Footer from './components/Footer';
import FloatingThemeToggle from './components/FloatingThemeToggle';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import News from './pages/News';
import Events from './pages/Events';
import Clubs from './pages/Clubs';
import ENSA from './pages/ENSA';
import ADEI from './pages/ADEI';
import ClubDetails from './pages/ClubDetails';
import Feedbacks from './pages/Feedbacks';
import Login from './pages/Login';
import AdminPanel from './pages/AdminPanel';
import Contact from './pages/Contact';
import Messages from './pages/Messages';
import Profile from './pages/Profile';
import ImageUploadTest from './components/ui/ImageUploadTest';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import FilieresAdmin from './pages/admin/FilieresAdmin';
import ClubsAdmin from './pages/admin/ClubsAdmin';
import NewsAdmin from './pages/admin/NewsAdmin';
import EventsAdmin from './pages/admin/EventsAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import PartnersAdmin from './pages/admin/PartnersAdmin';
import ADEIMembersAdmin from './pages/admin/ADEIMembersAdmin';
import FeedbacksAdmin from './pages/admin/FeedbacksAdmin';

import './styles/theme.css';
import './styles/floating-theme-toggle.css';
import './styles/modern-navbar.css';

// 404 Page Component
function NotFound() {
  return (
    <div style={{ 
      padding: '50px 20px', 
      textAlign: 'center',
      minHeight: '50vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <h1>404 - Page non trouvée</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <button 
        onClick={() => window.location.href = '/'}
        style={{
          padding: '10px 20px',
          backgroundColor: '#ff3b30',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '10px'
        }}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isProfilePage = location.pathname === '/profile';
  const shouldHideFooter = isAdminPage || isProfilePage;

  return (
    <ErrorBoundary>
      <div className="app-container fade-in">
        <ModernNavbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/events" element={<Events />} />
            <Route path="/clubs" element={<Clubs />} />
            <Route path="/ensa" element={<ENSA />} />
            <Route path="/adei" element={<ADEI />} />
            <Route path="/club/:clubId" element={<ClubDetails />} />
            <Route path="/feedbacks" element={<Feedbacks />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/filieres" element={
              <ProtectedRoute requireAdmin={true}>
                <FilieresAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/clubs" element={
              <ProtectedRoute requireAdmin={true}>
                <ClubsAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedRoute requireAdmin={true}>
                <NewsAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/events" element={
              <ProtectedRoute requireAdmin={true}>
                <EventsAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute requireAdmin={true}>
                <UsersAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/partners" element={
              <ProtectedRoute requireAdmin={true}>
                <PartnersAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/adei-members" element={
              <ProtectedRoute requireAdmin={true}>
                <ADEIMembersAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/feedbacks" element={
              <ProtectedRoute requireAdmin={true}>
                <FeedbacksAdmin />
              </ProtectedRoute>
            } />
            <Route path="/admin/legacy" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } />
            <Route path="/test-image-upload" element={<ImageUploadTest />} />
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        {!shouldHideFooter && <Footer />}
        <FloatingThemeToggle />
      </div>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;