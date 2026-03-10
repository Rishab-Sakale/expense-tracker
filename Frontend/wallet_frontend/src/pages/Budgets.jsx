import { useState, useEffect } from 'react';
import API from '../api/axios';

function Budgets() {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgetCheck, setBudgetCheck] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const now = new Date();

  const [form, setForm] = useState({
    category: '',
    amount: '',
    month: now.getMonth() + 1,
    year: now.getFullYear(),
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [budgetRes, catRes, checkRes] = await Promise.all([
        API.get('/budgets/'),
        API.get('/expenses/categories/'),
        API.get(`/budgets/check/?month=${now.getMonth() + 1}&year=${now.getFullYear()}`),
      ]);
      setBudgets(budgetRes.data);
      setCategories(catRes.data);
      setBudgetCheck(checkRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.category) {
      alert('Please select a category!');
      return;
    }

    const amount = parseFloat(form.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid positive amount!');
      return;
    }

    if (submitting) return;
    setSubmitting(true);

    try {
      if (editingBudget) {
        await API.put(`/budgets/${editingBudget.id}/`, { ...form, amount });
      } else {
        await API.post('/budgets/', { ...form, amount });
      }
      setForm({ category: '', amount: '', month: now.getMonth() + 1, year: now.getFullYear() });
      setShowForm(false);
      setEditingBudget(null);
      fetchAll();
    } catch (err) {
      alert('Budget already exists for this category and month!');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (budget) => {
    setEditingBudget(budget);
    setForm({
      category: budget.category,
      amount: budget.amount,
      month: budget.month,
      year: budget.year,
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this budget?')) {
      await API.delete(`/budgets/${id}/`);
      fetchAll();
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '80vh' }}>
      <p style={{ color: '#64748b' }}>Loading budgets...</p>
    </div>
  );

  return (
    <div style={{ padding: '32px', maxWidth: '1100px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
      }}>
        <div>
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>💰 Budgets</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>Set and track your monthly spending limits</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditingBudget(null); }}
          style={{
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '10px',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            width: 'auto',
          }}
        >
          + Set Budget
        </button>
      </div>

      {/* Budget Form */}
      {showForm && (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '28px',
          marginBottom: '24px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '20px' }}>
            {editingBudget ? '✏️ Edit Budget' : '+ New Budget'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              gap: '16px',
              marginBottom: '20px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Amount (₹)</label>
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleChange}
                  min="0.01"
                  step="0.01"
                  onKeyDown={(e) => ['e', 'E', '+', '-'].includes(e.key) && e.preventDefault()}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Month</label>
                <select name="month" value={form.month} onChange={handleChange} required>
                  {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m, i) => (
                    <option key={i} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Year</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: 'auto',
                  padding: '11px 28px',
                  opacity: submitting ? 0.7 : 1,
                  cursor: submitting ? 'not-allowed' : 'pointer',
                }}
              >
                {submitting ? 'Saving...' : editingBudget ? 'Update Budget' : 'Save Budget'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingBudget(null); }}
                style={{ width: 'auto', padding: '11px 28px', background: '#f1f5f9', color: '#64748b', border: 'none' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Budget Check Cards */}
      {budgetCheck.length > 0 && (
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
            📊 This Month's Budget Status
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {budgetCheck.map((item, i) => {
              const percent = Math.min((item.spent / item.budget) * 100, 100);
              const rawPercent = (item.spent / item.budget) * 100;

              const getColor = () => {
                if (rawPercent > 100) return '#b91c1c';
                if (rawPercent >= 90) return '#ef4444';
                if (rawPercent >= 75) return '#f59e0b';
                return '#16a34a';
              };

              const getBorderColor = () => {
                if (rawPercent > 100) return '#fecaca';
                if (rawPercent >= 90) return '#fecaca';
                if (rawPercent >= 75) return '#fde68a';
                return '#e2e8f0';
              };

              const getStatus = () => {
                if (rawPercent > 100) return { text: 'EXCEEDED 🚨', bg: '#fef2f2', color: '#b91c1c' };
                if (rawPercent >= 90) return { text: 'DANGER 🔴', bg: '#fef2f2', color: '#ef4444' };
                if (rawPercent >= 75) return { text: 'WARNING ⚠️', bg: '#fffbeb', color: '#f59e0b' };
                return null;
              };

              return (
                <div key={i} style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
                  border: `1px solid ${getBorderColor()}`,
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px' }}>
                      {item.category_name || item.category}
                    </span>
                    {getStatus() && (
                      <span style={{
                        background: getStatus().bg,
                        color: getStatus().color,
                        fontSize: '11px',
                        fontWeight: '700',
                        padding: '3px 8px',
                        borderRadius: '6px',
                      }}>
                        {getStatus().text}
                      </span>
                    )}
                  </div>

                  <div style={{
                    background: '#f1f5f9',
                    borderRadius: '99px',
                    height: '8px',
                    marginBottom: '12px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${percent}%`,
                      height: '100%',
                      background: getColor(),
                      borderRadius: '99px',
                      transition: 'width 0.5s ease',
                    }} />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
                    <span style={{ color: '#64748b' }}>
                      Spent: <strong style={{ color: getColor() }}>₹{item.spent}</strong>
                    </span>
                    <span style={{ color: '#64748b' }}>
                      Budget: <strong style={{ color: '#1e293b' }}>₹{item.budget}</strong>
                    </span>
                  </div>

                  <p style={{ marginTop: '8px', fontSize: '12px', color: getColor(), fontWeight: '500' }}>
                    {rawPercent > 100
                      ? `Exceeded by ₹${Math.abs(item.remaining)}`
                      : `₹${item.remaining} remaining`
                    }
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Budgets Table */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
            All Budgets ({budgets.length})
          </h3>
        </div>

        {budgets.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Category</th>
                <th>Amount</th>
                <th>Month</th>
                <th>Year</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {budgets.map((budget) => (
                <tr key={budget.id}>
                  <td>
                    <span style={{
                      background: '#f0fdf4',
                      color: '#16a34a',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}>
                      {budget.category_name}
                    </span>
                  </td>
                  <td style={{ fontWeight: '700', color: '#1e293b' }}>₹{budget.amount}</td>
                  <td style={{ color: '#64748b' }}>{budget.month}</td>
                  <td style={{ color: '#64748b' }}>{budget.year}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(budget)}
                        style={{ width: 'auto', padding: '6px 14px', fontSize: '13px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '6px' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(budget.id)}
                        style={{ width: 'auto', padding: '6px 14px', fontSize: '13px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: '6px' }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '60px', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💰</div>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>No budgets set yet!</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>Click "+ Set Budget" to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Budgets;