import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Predict from './pages/Predict';
import About from './pages/About';

function Nav() {
  return (
    <nav className="nav">
      <NavLink to="/" className="nav-logo">
        <div className="nav-logo-mark">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
          </svg>
        </div>
        MediSense
      </NavLink>

      <ul className="nav-links">
        <li><NavLink to="/"       end className={({isActive}) => isActive ? 'active' : ''}>Home</NavLink></li>
        <li><NavLink to="/predict"    className={({isActive}) => isActive ? 'active' : ''}>Predict</NavLink></li>
        <li><NavLink to="/about"      className={({isActive}) => isActive ? 'active' : ''}>About</NavLink></li>
      </ul>

      <NavLink to="/predict" className="nav-btn">
        Check Symptoms
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </NavLink>
    </nav>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-logo">
        <div className="nav-logo-mark" style={{width:26,height:26}}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
          </svg>
        </div>
        MediSense
      </div>
      <p className="footer-copy">For informational use only · Not a substitute for medical advice</p>
      <ul className="footer-links">
        <li><a href="#">Privacy</a></li>
        <li><a href="#">Disclaimer</a></li>
        <li><a href="https://github.com" target="_blank" rel="noreferrer">GitHub</a></li>
      </ul>
    </footer>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/"        element={<Home />} />
        <Route path="/predict" element={<Predict />} />
        <Route path="/about"   element={<About />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
