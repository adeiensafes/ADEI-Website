import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ModernNavbar from './components/ModernNavbar';
import Footer from './components/Footer';
import FloatingThemeToggle from './components/FloatingThemeToggle';
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
import './styles/theme.css';
import './styles/floating-theme-toggle.css';
import './styles/modern-navbar.css';

function App() {

  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
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
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
            <Footer />
            <FloatingThemeToggle />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;