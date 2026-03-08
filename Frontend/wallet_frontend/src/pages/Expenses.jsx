import { useEffect, useState } from 'react';
import API from '../api/axios';

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', note: '', date: '' });
  const [editId, setEditId] = useState(null);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('expenses'); // for mobile tabs

  const fetchData = async () => {
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

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async () => {
    if (!form.category || !form.amount || !form.date) {
      alert('Please fill all required fields!');
      return;
    }
    try {
      if (editId) {
        await API.put(`/expenses/${editId}/`, form);
        setEditId(null);
      } else {
        await API.post('/expenses/', form);
      }
      setForm({ category: '', amount: '', note: '', date: '' });
      fetchData();
    } catch (err) {
      alert('Error saving expense!');
    }
  };

  const handleEdit = (expense) => {
    setForm({
      category: expense.category,
      amount: expense.amount,
      note: expense.note || '',
      date: expense.date,
    });
    setEditId(expense.id);
    setActiveTab('add'); // switch to add tab on mobile
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense?')) return;
    await API.delete(`/expenses/${id}/`);
    fetchData();
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await API.post('/expenses/categories/', { name: newCategory });
      setNewCategory('');
      fetchData();
    } catch (err) {
      alert('Error adding category!');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    await API.delete(`/expenses/categories/${id}/`);
    fetchData();
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        <p>Loading expenses...</p>
      </div>
    );
  }

  return (
    <div className="expenses-container">
      <h1 className="page-title">💸 Expenses</h1>
      <p className="page-subtitle">Manage your daily expenses and categories</p>

      {/* Mobile Tabs */}
      <div style={styles.mobileTabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'expenses' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('expenses')}
        >
          📋 Expenses
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'add' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('add')}
        >
          ➕ Add
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'categories' ? styles.tabActive : {}) }}
          onClick={() => setActiveTab('categories')}
        >
          📂 Categories
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="expenses-layout">

        {/* Left Panel — Add Expense + Categories */}
        <div style={styles.leftPanel}>

          {/* Add/Edit Expense Form */}
          <div
            className="card"
            style={{
              marginBottom: '20px',
              display: activeTab === 'add' || window.innerWidth > 768 ? 'block' : 'none'
            }}
          >
            <h3 style={styles.sectionTitle}>
              {editId ? '✏️ Edit Expense' : '➕ Add Expense'}
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
              <label style={styles.label}>Amount (₹) *</label>
              <input
                className="form-input"
                type="number"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label style={styles.label}>Date *</label>
              <input
                className="form-input"
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label style={styles.label}>Note</label>
              <input
                className="form-input"
                type="text"
                placeholder="Optional note..."
                value={form.note}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
              />
            </div>

            <button className="btn-primary" onClick={handleSubmit}>
              {editId ? '✅ Update Expense' : '➕ Add Expense'}
            </button>

            {editId && (
              <button
                style={styles.cancelBtn}
                onClick={() => { setEditId(null); setForm({ category: '', amount: '', note: '', date: '' }); }}
              >
                Cancel
              </button>
            )}
          </div>

          {/* Categories */}
          <div
            className="card"
            style={{
              display: activeTab === 'categories' || window.innerWidth > 768 ? 'block' : 'none'
            }}
          >
            <div style={styles.sectionHeader}>
              <h3 style={styles.sectionTitle}>📂 Categories</h3>
              <button
                style={styles.toggleBtn}
                onClick={() => setShowCategoryForm(!showCategoryForm)}
              >
                {showCategoryForm ? '−' : '+'}
              </button>
            </div>

            {showCategoryForm && (
              <div style={styles.categoryForm}>
                <input
                  className="form-input"
                  type="text"
                  placeholder="New category name..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={{ marginBottom: '8px' }}
                />
                <button className="btn-primary" onClick={handleAddCategory}>
                  Add Category
                </button>
              </div>
            )}

            <div style={styles.categoryList}>
              {categories.length === 0 ? (
                <p style={styles.emptyText}>No categories yet</p>
              ) : (
                categories.map((cat) => (
                  <div key={cat.id} style={styles.categoryItem}>
                    <span style={styles.categoryName}>📁 {cat.name}</span>
                    <button
                      style={styles.deleteBtn}
                      onClick={() => handleDeleteCategory(cat.id)}
                    >
                      🗑️
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel — Expenses Table */}
        <div
          style={{
            display: activeTab === 'expenses' || window.innerWidth > 768 ? 'block' : 'none'
          }}
        >
          <div className="card">
            <h3 style={{ ...styles.sectionTitle, marginBottom: '16px' }}>
              📋 All Expenses ({expenses.length})
            </h3>

            {expenses.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>💸</div>
                <p style={styles.emptyText}>No expenses yet!</p>
                <p style={{ color: '#9ca3af', fontSize: '13px' }}>Add your first expense to get started</p>
              </div>
            ) : (
              <div className="expenses-table-wrapper">
                <table className="expenses-table">
                  <thead>
                    <tr style={styles.tableHeader}>
                      <th style={styles.th}>Date</th>
                      <th style={styles.th}>Category</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th} className="hide-mobile">Note</th>
                      <th style={styles.th}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map((exp, index) => (
                      <tr
                        key={exp.id}
                        style={{
                          ...styles.tableRow,
                          background: index % 2 === 0 ? 'white' : '#f9fafb',
                        }}
                      >
                        <td style={styles.td}>{exp.date}</td>
                        <td style={styles.td}>
                          <span style={styles.categoryBadge}>
                            {exp.category_name || exp.category}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <span style={styles.amountText}>₹{exp.amount}</span>
                        </td>
                        <td style={{ ...styles.td, color: '#6b7280' }} className="hide-mobile">
                          {exp.note || '—'}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.actionBtns}>
                            <button
                              style={styles.editBtn}
                              onClick={() => handleEdit(exp)}
                            >
                              ✏️
                            </button>
                            <button
                              style={styles.deleteRowBtn}
                              onClick={() => handleDelete(exp.id)}
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
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
  leftPanel: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0',
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#374151',
    marginBottom: '16px',
  },
  sectionHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '500',
    color: '#374151',
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
  toggleBtn: {
    width: '28px',
    height: '28px',
    border: '1px solid #16a34a',
    borderRadius: '6px',
    background: 'white',
    color: '#16a34a',
    cursor: 'pointer',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryForm: {
    marginBottom: '16px',
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '300px',
    overflowY: 'auto',
  },
  categoryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 12px',
    background: '#f0fdf4',
    borderRadius: '8px',
    border: '1px solid #dcfce7',
  },
  categoryName: {
    fontSize: '14px',
    color: '#374151',
    fontWeight: '500',
  },
  deleteBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
    padding: '2px',
  },
  emptyState: {
    textAlign: 'center',
    padding: '40px 20px',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: '14px',
  },
  tableHeader: {
    background: '#f0fdf4',
  },
  th: {
    padding: '12px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#374151',
    borderBottom: '2px solid #dcfce7',
    whiteSpace: 'nowrap',
  },
  tableRow: {
    transition: 'background 0.1s',
  },
  td: {
    padding: '12px 16px',
    fontSize: '14px',
    color: '#374151',
    borderBottom: '1px solid #f3f4f6',
  },
  categoryBadge: {
    background: '#dcfce7',
    color: '#15803d',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '500',
  },
  amountText: {
    fontWeight: '600',
    color: '#15803d',
  },
  actionBtns: {
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
  deleteRowBtn: {
    background: '#fef2f2',
    border: 'none',
    borderRadius: '6px',
    padding: '4px 8px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};