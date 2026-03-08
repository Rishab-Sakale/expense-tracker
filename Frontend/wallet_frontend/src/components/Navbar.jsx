import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: '📊 Dashboard' },
    { path: '/expenses', label: '💸 Expenses' },
    { path: '/budgets', label: '💰 Budgets' },
  ];

  return (
    <nav style={{
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
    }}>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, #16a34a, #15803d)',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '18px',
        }}>
          💸
        </div>
        <span style={{ fontWeight: '700', fontSize: '17px', color: '#1e293b' }}>
          Expense Tracker
        </span>
      </div>

      {/* Nav Links */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: '500',
              color: location.pathname === item.path ? '#16a34a' : '#64748b',
              background: location.pathname === item.path ? '#f0fdf4' : 'transparent',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            {item.label}
          </Link>
        ))}
      </div>

      {/* User + Logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <div style={{
            width: '32px',
            height: '32px',
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '13px',
            fontWeight: '700',
          }}>
            {user.username ? user.username[0].toUpperCase() : 'U'}
          </div>
          <span style={{ fontSize: '14px', fontWeight: '500', color: '#374151' }}>
            {user.username || 'User'}
          </span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            width: 'auto',
            transition: 'all 0.2s',
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
