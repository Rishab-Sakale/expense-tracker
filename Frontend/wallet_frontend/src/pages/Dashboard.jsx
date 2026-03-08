import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import API from '../api/axios';

const COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#bbf7d0', '#f59e0b', '#ef4444'];

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, categoryRes, trendRes] = await Promise.all([
          API.get('/analytics/monthly-summary/'),
          API.get('/analytics/category-wise/'),
          API.get('/analytics/monthly-trend/'),
        ]);
        setSummary(summaryRes.data);
        setCategoryData(categoryRes.data);
        setTrendData(trendRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}>💳</div>
        <p style={styles.loadingText}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div style={styles.header}>
        <h1 className="page-title">👋 Welcome, {user.username || 'User'}!</h1>
        <p className="page-subtitle">Here's your financial overview for this month</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="card" style={styles.summaryCard}>
          <div style={styles.cardIcon}>💸</div>
          <div style={styles.cardLabel}>Total Spent</div>
          <div style={styles.cardValue}>₹{summary?.total_spent || '0'}</div>
          <div style={styles.cardSub}>This month</div>
        </div>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.cardIcon}>📂</div>
          <div style={styles.cardLabel}>Categories</div>
          <div style={styles.cardValue}>{summary?.total_categories || '0'}</div>
          <div style={styles.cardSub}>Active categories</div>
        </div>
        <div className="card" style={styles.summaryCard}>
          <div style={styles.cardIcon}>📅</div>
          <div style={styles.cardLabel}>Current Month</div>
          <div style={styles.cardValue} styles={{...styles.cardValue, fontSize: '18px'}}>
            {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}
          </div>
          <div style={styles.cardSub}>Tracking period</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Pie Chart */}
        <div className="card">
          <h3 style={styles.chartTitle}>📊 Spending by Category</h3>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="total"
                  nameKey="category"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label={({ category, percent }) =>
                    `${category} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {categoryData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `₹${value}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.emptyChart}>No expense data yet</div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card">
          <h3 style={styles.chartTitle}>📈 6-Month Trend</h3>
          {trendData.length > 0 ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0fdf4" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Bar dataKey="total" fill="#16a34a" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={styles.emptyChart}>No trend data yet</div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={styles.chartTitle}>⚡ Quick Actions</h3>
        <div className="quick-actions" style={{ marginTop: '16px' }}>
          <button
            onClick={() => navigate('/expenses')}
            style={styles.actionBtn}
          >
            ➕ Add Expense
          </button>
          <button
            onClick={() => navigate('/budgets')}
            style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
          >
            💰 Manage Budgets
          </button>
          <button
            onClick={() => navigate('/expenses')}
            style={{ ...styles.actionBtn, background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}
          >
            📂 Add Category
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    gap: '16px',
  },
  loadingSpinner: {
    fontSize: '48px',
    animation: 'pulse 1.5s infinite',
  },
  loadingText: {
    color: '#6b7280',
    fontSize: '16px',
  },
  header: {
    marginBottom: '24px',
  },
  summaryCard: {
    textAlign: 'center',
    borderTop: '4px solid #16a34a',
  },
  cardIcon: {
    fontSize: '32px',
    marginBottom: '8px',
  },
  cardLabel: {
    fontSize: '13px',
    color: '#6b7280',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '8px',
  },
  cardValue: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#15803d',
    marginBottom: '4px',
  },
  cardSub: {
    fontSize: '12px',
    color: '#9ca3af',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '4px',
  },
  emptyChart: {
    height: '280px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#9ca3af',
    fontSize: '14px',
  },
  actionBtn: {
    background: 'linear-gradient(135deg, #16a34a, #15803d)',
    color: 'white',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s',
    flex: 1,
    minWidth: '140px',
  },
};