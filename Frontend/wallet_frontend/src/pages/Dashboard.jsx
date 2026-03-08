import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import API from '../api/axios';

const COLORS = ['#16a34a', '#2563eb', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [categoryData, setCategoryData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const now = new Date();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [summaryRes, categoryRes, trendRes] = await Promise.all([
        API.get(`/analytics/monthly-summary/?month=${now.getMonth() + 1}&year=${now.getFullYear()}`),
        API.get(`/analytics/category-wise/?month=${now.getMonth() + 1}&year=${now.getFullYear()}`),
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

  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
    }}>
      <p style={{ color: '#64748b', fontSize: '16px' }}>Loading dashboard...</p>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>

      {/* Welcome */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>
          👋 Welcome, {user.username}!
        </h1>
        <p style={{ color: '#64748b', marginTop: '4px' }}>
          Here's your financial summary for {now.toLocaleString('default', { month: 'long' })} {now.getFullYear()}
        </p>
      </div>

      {/* Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px',
        marginBottom: '32px',
      }}>
        {[
          {
            icon: '💸',
            label: 'Total Spent',
            value: `₹${summary?.total_spent || 0}`,
            color: '#ef4444',
            bg: '#fef2f2',
          },
          {
            icon: '📊',
            label: 'Categories',
            value: categoryData.length,
            color: '#2563eb',
            bg: '#eff6ff',
          },
          {
            icon: '📅',
            label: 'Current Month',
            value: now.toLocaleString('default', { month: 'long' }),
            color: '#16a34a',
            bg: '#f0fdf4',
          },
        ].map((card, i) => (
          <div key={i} style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}>
            <div style={{
              width: '52px',
              height: '52px',
              background: card.bg,
              borderRadius: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              flexShrink: 0,
            }}>
              {card.icon}
            </div>
            <div>
              <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '4px' }}>{card.label}</p>
              <p style={{ fontSize: '22px', fontWeight: '700', color: card.color }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '20px',
        marginBottom: '32px',
      }}>

        {/* Pie Chart */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
            📊 Spending by Category
          </h3>
          {categoryData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    dataKey="total"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ category, percent }) =>
                      `${category} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {categoryData.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value}`} />
                </PieChart>
              </ResponsiveContainer>

              {/* Legend */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '16px' }}>
                {categoryData.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: COLORS[i % COLORS.length],
                      flexShrink: 0,
                    }} />
                    <span style={{ fontSize: '12px', color: '#64748b' }}>
                      {item.category} — ₹{item.total}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div style={{
              height: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#94a3b8',
              fontSize: '14px',
            }}>
              No expenses this month yet!
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
            📈 6 Month Trend
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={trendData}>
              <XAxis
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#64748b' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="total" fill="#16a34a" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
      }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
          ⚡ Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/expenses" style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: '#16a34a',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            textDecoration: 'none',
          }}>
            + Add Expense
          </a>
          <a href="/budgets" style={{
            padding: '10px 20px',
            borderRadius: '10px',
            background: '#2563eb',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            textDecoration: 'none',
          }}>
            + Set Budget
          </a>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;