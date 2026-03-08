import { useState, useEffect } from 'react';
import API from '../api/axios';

function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [form, setForm] = useState({
    category: '',
    amount: '',
    note: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [expRes, catRes] = await Promise.all([
        API.get('/expenses/'),
        API.get('/expenses/categories/'),
      ]);
      setExpenses(expRes.data);
      setCategories(catRes.data);
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
    try {
      if (editingExpense) {
        await API.put(`/expenses/${editingExpense.id}/`, form);
      } else {
        await API.post('/expenses/', form);
      }
      setForm({
        category: '',
        amount: '',
        note: '',
        date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      setEditingExpense(null);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setForm({
      category: expense.category,
      amount: expense.amount,
      note: expense.note || '',
      date: expense.date,
    });
    setShowForm(true);
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this expense?')) {
      await API.delete(`/expenses/${id}/`);
      fetchAll();
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    try {
      await API.post('/expenses/categories/', { name: categoryName });
      setCategoryName('');
      setShowCategoryForm(false);
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Delete this category?')) {
      await API.delete(`/expenses/categories/${id}/`);
      fetchAll();
    }
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '80vh',
    }}>
      <p style={{ color: '#64748b' }}>Loading expenses...</p>
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
          <h1 style={{ fontSize: '26px', fontWeight: '800', color: '#1e293b' }}>
            💸 Expenses
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            Track and manage your daily expenses
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowCategoryForm(!showCategoryForm)}
            style={{
              background: '#f0fdf4',
              color: '#16a34a',
              border: '1px solid #bbf7d0',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              width: 'auto',
            }}
          >
            + Category
          </button>
          <button
            onClick={() => { setShowForm(!showForm); setEditingExpense(null); }}
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              color: '#fff',
              border: 'none',
              padding: '10px 18px',
              borderRadius: '10px',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              width: 'auto',
            }}
          >
            + Add Expense
          </button>
        </div>
      </div>

      {/* Category Form */}
      {showCategoryForm && (
        <div style={{
          background: '#fff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
          border: '1px solid #e2e8f0',
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b', marginBottom: '16px' }}>
            Add New Category
          </h3>
          <form onSubmit={handleAddCategory} style={{ display: 'flex', gap: '12px' }}>
            <input
              type="text"
              placeholder="Category name (e.g. Food, Travel)"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              required
              style={{ flex: 1 }}
            />
            <button type="submit" style={{
              width: 'auto',
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
            }}>
              Add
            </button>
          </form>

          {/* Categories List */}
          {categories.length > 0 && (
            <div style={{ marginTop: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {categories.map((cat) => (
                <div key={cat.id} style={{
                  background: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '13px',
                  color: '#16a34a',
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}>
                  {cat.name}
                  <span
                    onClick={() => handleDeleteCategory(cat.id)}
                    style={{ cursor: 'pointer', color: '#ef4444', fontWeight: '700' }}
                  >
                    ×
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Expense Form */}
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
            {editingExpense ? '✏️ Edit Expense' : '+ New Expense'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Category</label>
                <select name="category" value={form.category} onChange={handleChange} required>
                  <option value="">Select category</option>
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
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Date</label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '500', color: '#374151' }}>Note (optional)</label>
                <input
                  type="text"
                  name="note"
                  placeholder="Add a note..."
                  value={form.note}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" style={{ width: 'auto', padding: '11px 28px' }}>
                {editingExpense ? 'Update Expense' : 'Save Expense'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditingExpense(null); }}
                style={{
                  width: 'auto',
                  padding: '11px 28px',
                  background: '#f1f5f9',
                  color: '#64748b',
                  border: 'none',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Expenses Table */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        boxShadow: '0 1px 8px rgba(0,0,0,0.06)',
        border: '1px solid #e2e8f0',
        overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e2e8f0' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e293b' }}>
            All Expenses ({expenses.length})
          </h3>
        </div>

        {expenses.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Note</th>
                <th>Amount</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((expense) => (
                <tr key={expense.id}>
                  <td style={{ color: '#64748b' }}>{expense.date}</td>
                  <td>
                    <span style={{
                      background: '#f0fdf4',
                      color: '#16a34a',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '500',
                    }}>
                      {expense.category_name}
                    </span>
                  </td>
                  <td style={{ color: '#64748b' }}>{expense.note || '—'}</td>
                  <td style={{ fontWeight: '700', color: '#ef4444' }}>
                    ₹{expense.amount}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(expense)}
                        style={{
                          width: 'auto',
                          padding: '6px 14px',
                          fontSize: '13px',
                          background: '#eff6ff',
                          color: '#2563eb',
                          border: 'none',
                          borderRadius: '6px',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        style={{
                          width: 'auto',
                          padding: '6px 14px',
                          fontSize: '13px',
                          background: '#fef2f2',
                          color: '#ef4444',
                          border: 'none',
                          borderRadius: '6px',
                        }}
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
          <div style={{
            padding: '60px',
            textAlign: 'center',
            color: '#94a3b8',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>💸</div>
            <p style={{ fontSize: '16px', fontWeight: '500' }}>No expenses yet!</p>
            <p style={{ fontSize: '14px', marginTop: '8px' }}>
              Click "+ Add Expense" to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Expenses;
