import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/expenses', label: '💸 Expenses' },
    { path: '/budgets', label: '💰 Budgets' },
  ];

  return (
    <>
      <nav style={styles.navbar}>
        {/* Logo */}
        <div style={styles.logo}>
          <span style={{ fontSize: '24px' }}>💳</span>
          <span style={styles.logoText}>WalletTracker</span>
        </div>

        {/* Desktop Nav Links — hidden on mobile via index.css */}
        <div className="desktop-links" style={styles.desktopLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === link.path ? styles.activeLink : {}),
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop User Info — hidden on mobile via index.css */}
        <div className="desktop-user" style={styles.desktopUser}>
          <span style={styles.username}>👤 {user.username || 'User'}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Logout
          </button>
        </div>

        {/* Mobile Hamburger — shown on mobile via index.css */}
        <button
          className="hamburger-btn"
          style={styles.hamburger}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? '✕' : '☰'}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="mobile-menu" style={styles.mobileMenu}>
          <div style={styles.mobileUser}>
            👤 <strong>{user.username || 'User'}</strong>
          </div>
          <hr style={styles.divider} />
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.mobileLink,
                ...(location.pathname === link.path ? styles.mobileLinkActive : {}),
              }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <hr style={styles.divider} />
          <button
            onClick={() => { handleLogout(); setMenuOpen(false); }}
            style={styles.mobileLogout}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </>
  );
}

const styles = {
  navbar: {
    background: 'linear-gradient(135deg, #15803d, #16a34a)',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  logoText: {
    color: 'white',
    fontWeight: '700',
    fontSize: '18px',
  },
  desktopLinks: {
    display: 'flex',
    gap: '8px',
  },
  navLink: {
    color: 'rgba(255,255,255,0.85)',
    textDecoration: 'none',
    padding: '8px 14px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
  },
  activeLink: {
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    fontWeight: '600',
  },
  desktopUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  username: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: '14px',
    fontWeight: '500',
  },
  logoutBtn: {
    background: 'rgba(255,255,255,0.15)',
    color: 'white',
    border: '1px solid rgba(255,255,255,0.3)',
    padding: '6px 14px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
  },
  hamburger: {
    background: 'rgba(255,255,255,0.15)',
    border: 'none',
    color: 'white',
    fontSize: '20px',
    cursor: 'pointer',
    padding: '6px 12px',
    borderRadius: '8px',
  },
  mobileMenu: {
    background: 'white',
    padding: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    position: 'sticky',
    top: '64px',
    zIndex: 999,
  },
  mobileUser: {
    padding: '8px 12px',
    fontSize: '15px',
    color: '#15803d',
  },
  mobileLink: {
    textDecoration: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    color: '#374151',
    fontWeight: '500',
    display: 'block',
  },
  mobileLinkActive: {
    background: '#f0fdf4',
    color: '#15803d',
    fontWeight: '600',
  },
  mobileLogout: {
    background: '#fef2f2',
    color: '#dc2626',
    border: 'none',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    width: '100%',
  },
  divider: {
    border: 'none',
    borderTop: '1px solid #f3f4f6',
    margin: '4px 0',
  },
};
