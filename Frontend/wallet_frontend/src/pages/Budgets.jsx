import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', month: '', year: '' });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('budgets');

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const fetchData = async () => {
    try {
      const [budgetRes, catRes] = await Promise.all([
        API.get(`/budgets/check/?month=${currentMonth}&year=${currentYear}`),
        API.get('/expenses/categories/'),
      ]);
      setBudgets(budgetRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    if (!form.category || !form.amount || !form.month || !form.year) {
      alert('Please fill all fields!');
      return;
    }
    try {
      if (editId) {
        await API.put(`/budgets/${editId}/`, form);
        setEditId(null);
      } else {
        await API.post('/budgets/', form);
      }
      setForm({ category: '', amount: '', month: '', year: '' });
      fetchData();
      setActiveTab('budgets');
    } catch (err) {
      alert('Error saving budget!');
    }
  };

  const handleEdit = (budget) => {
    setForm({
      category: budget.category,
      amount: budget.budget,
      month: budget.month,
      year: budget.year,
    });
    setEditId(budget.id);
    setActiveTab('add');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this budget?')) return;
    await API.delete(`/budgets/${id}/`);
    fetchData();
  };

  const getProgressColor = (spent, budget) => {
    const percent = (spent / budget) * 100;
    if (percent > 100) return '#b91c1c';
    if (percent >= 90) return '#ef4444';
    if (percent >= 75) return '#f59e0b';
    return '#16a34a';
  };

  const getStatusEmoji = (spent, budget) => {
    const percent = (spent / budget) * 100;
    if (percent > 100) return '🚨 Exceeded';
    if (percent >= 90) return '🔴 Danger';
    if (percent >= 75) return '⚠️ Warning';
    return '✅ Safe';
  };

  const getStatusBg = (spent, budget) => {
    const percent = (spent / budget) * 100;
    if (percent > 100) return '#fef2f2';
    if (percent >= 90) return '#fef2f2';
    if (percent >= 75) return '#fffbeb';
    return '#f0fdf4';
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading budgets...</p>
      </div>
    );
  }

  return (
    <div className="budgets-container">
      <h1 className="page-title">💰 Budgets</h1>
      <p className="page-subtitle">
        {new Date().toLocaleString('default', { month: 'long', year: 'numeric' })} — Budget Overview
      </p>

      {/* Mobile Tabs */}
      <div style={styles.mobileTabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'budgets' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('budgets')}
        >
          💰 Budgets
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'add' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('add')}
        >
          ➕ {editId ? 'Edit' : 'Add'}
        </button>
      </div>

      <div className="budgets-layout">

        {/* Left — Add/Edit Form */}
        <div
          style={{
            display: activeTab === 'add' || window.innerWidth > 768 ? 'block' : 'none'
          }}
        >
          <div className="card">
            <h3 style={styles.sectionTitle}>
              {editId ? '✏️ Edit Budget' : '➕ Set Budget'}
            </h3>

            <div className="form-group">
              <label style={styles.label}>Category *</label>
              <select
                className="form-input"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label style={styles.label}>Budget Amount (₹) *</label>
              <input
                className="form-input"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div style={styles.twoCol}>
              <div className="form-group">
                <label style={styles.label}>Month *</label>
                <select
                  className="form-input"
                  value={form.month}
                  onChange={(e) => setForm({ ...form, month: e.target.value })}
                >
                  <option value="">Month</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      {new Date(0, m - 1).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label style={styles.label}>Year *</label>
                <select
                  className="form-input"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                >
                  <option value="">Year</option>
                  {[2024, 2025, 2026, 2027].map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              </div>
            </div>

            <button className="btn-primary" onClick={handleSubmit}>
              {editId ? '✅ Update Budget' : '➕ Set Budget'}
            </button>

            {editId && (
              <button
                style={styles.cancelBtn}
                onClick={() => { setEditId(null); setForm({ category: '', amount: '', month: '', year: '' }); }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Right — Budget Cards */}
        <div
          style={{
            display: activeTab === 'budgets' || window.innerWidth > 768 ? 'block' : 'none'
          }}
        >
          {budgets.length === 0 ? (
            <div className="card" style={styles.emptyState}>
              <div style={{ fontSize: '48px', marginBottom: '12px' }}>💰</div>
              <p style={styles.emptyText}>No budgets set for this month!</p>
              <p style={{ color: '#9ca3af', fontSize: '13px', marginTop: '4px' }}>
                Set a budget to track your spending
              </p>
              <button
                className="btn-primary"
                style={{ marginTop: '16px', maxWidth: '200px', margin: '16px auto 0' }}
                onClick={() => setActiveTab('add')}
              >
                ➕ Set First Budget
              </button>
            </div>
          ) : (
            <div className="budgets-grid">
              {budgets.map((item) => {
                const percent = Math.min((item.spent / item.budget) * 100, 100);
                const rawPercent = (item.spent / item.budget) * 100;
                const color = getProgressColor(item.spent, item.budget);
                const status = getStatusEmoji(item.spent, item.budget);
                const bgColor = getStatusBg(item.spent, item.budget);

                return (
                  <div
                    key={item.id}
                    className="card"
                    style={{ ...styles.budgetCard, background: bgColor }}
                  >
                    {/* Header */}
                    <div style={styles.budgetHeader}>
                      <div>
                        <h4 style={styles.categoryName}>{item.category_name}</h4>
                        <span style={{ ...styles.statusBadge, background: color }}>
                          {status}
                        </span>
                      </div>
                      <div style={styles.budgetActions}>
                        <button
                          style={styles.editBtn}
                          onClick={() => handleEdit(item)}
                        >
                          ✏️
                        </button>
                        <button
                          style={styles.deleteBtn}
                          onClick={() => handleDelete(item.id)}
                        >
                          🗑️
                        </button>
                      </div>
                    </div>

                    {/* Amounts */}
                    <div style={styles.amountRow}>
                      <div style={styles.amountItem}>
                        <div style={styles.amountLabel}>Spent</div>
                        <div style={{ ...styles.amountValue, color }}>₹{item.spent}</div>
                      </div>
                      <div style={styles.amountDivider}>/</div>
                      <div style={styles.amountItem}>
                        <div style={styles.amountLabel}>Budget</div>
                        <div style={styles.amountValue}>₹{item.budget}</div>
                      </div>
                      <div style={styles.amountItem}>
                        <div style={styles.amountLabel}>Remaining</div>
                        <div style={{ ...styles.amountValue, color: item.remaining >= 0 ? '#16a34a' : '#dc2626' }}>
                          ₹{item.remaining}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div style={styles.progressContainer}>
                      <div style={styles.progressBg}>
                        <div
                          style={{
                            ...styles.progressFill,
                            width: `${percent}%`,
                            background: color,
                          }}
                        />
                      </div>
                      <span style={{ ...styles.percentText, color }}>
                        {rawPercent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  loading: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    color: '#6b7280',
  },
  mobileTabs: {
    display: 'flex',
    gap: '8px',
    marginBottom: '20px',
    background: 'white',
    padding: '6px',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  },
  tab: {
    flex: 1,
    padding: '10px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '500',
    background: 'transparent',
    color: '#6b7280',
    transition: 'all 0.2s',
  },
  tabActive: {
    background: '#16a34a',
    color: 'white',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
  },
  twoCol: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px',
  },
  cancelBtn: {
    width: '100%',
    padding: '10px',
    marginTop: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: 'white',
    color: '#6b7280',
    cursor: 'pointer',
    fontSize: '14px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '15px',
    fontWeight: '500',
  },
  budgetCard: {
    borderRadius: '12px',
    padding: '16px',
    border: '1px solid #e5e7eb',
  },
  budgetHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '12px',
  },
  categoryName: {
    fontSize: '15px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '6px',
  },
  statusBadge: {
    color: 'white',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '11px',
    fontWeight: '600',
  },
  budgetActions: {
    display: 'flex',
    gap: '6px',
  },
  editBtn: {
    background: '#eff6ff',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  deleteBtn: {
    background: '#fef2f2',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  amountRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    flexWrap: 'wrap',
  },
  amountItem: {
    flex: 1,
    minWidth: '70px',
  },
  amountLabel: {
    fontSize: '11px',
    color: '#9ca3af',
    marginBottom: '2px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  amountValue: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#374151',
  },
  amountDivider: {
    color: '#d1d5db',
    fontSize: '20px',
  },
  progressContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  progressBg: {
    flex: 1,
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: '4px',
    transition: 'width 0.5s ease',
  },
  percentText: {
    fontSize: '12px',
    fontWeight: '600',
    minWidth: '40px',
    textAlign: 'right',
  },
};