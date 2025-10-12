import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
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

function App() {

  return (
    <AuthProvider>
      <Router>
        <div className="app-container fade-in">
          <Navbar />
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
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;