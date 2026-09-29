import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import { FaCoins, FaPlus, FaTrash, FaFilter, FaFileInvoiceDollar, FaCalendarAlt } from 'react-icons/fa';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [summary, setSummary] = useState({ totalExpenses: 0, categorySummary: {} });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Fertilizers & Nutrients',
    cropName: 'Tomato',
    season: 'Kharif 2026',
    notes: '',
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const { data } = await api.get('/expenses');
      if (data.success) {
        setExpenses(data.expenses);
        setSummary({ totalExpenses: data.totalExpenses, categorySummary: data.categorySummary });
      }
    } catch (err) {
      console.error('Failed to fetch expenses', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.amount) {
      toast.error('Please provide title and amount');
      return;
    }
    try {
      const { data } = await api.post('/expenses', formData);
      if (data.success) {
        toast.success('Expense recorded successfully!');
        setShowModal(false);
        setFormData({ title: '', amount: '', category: 'Fertilizers & Nutrients', cropName: 'Tomato', season: 'Kharif 2026', notes: '' });
        fetchExpenses();
      }
    } catch (err) {
      toast.error('Failed to record expense');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this expense record?')) return;
    try {
      await api.delete(`/expenses/${id}`);
      toast.success('Expense removed');
      fetchExpenses();
    } catch (err) {
      toast.error('Failed to delete expense');
    }
  };

  const categories = [
    'Seeds & Seedlings',
    'Fertilizers & Nutrients',
    'Pesticides & Crop Protection',
    'Labor & Wages',
    'Irrigation & Water Charges',
    'Machinery & Equipment Rental',
    'Fuel & Electricity',
    'Transportation & Logistics',
    'Storage & Packaging',
    'Other Inputs',
  ];

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header flex justify-between items-start mb-8">
        <div>
          <h1 className="page-title flex items-center gap-3">
            <FaFileInvoiceDollar className="text-gold" /> Farm Expense & Input Tracker
          </h1>
          <p className="page-subtitle">Track input expenditures, compute per-acre costs, and evaluate farm economics.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary flex items-center gap-2">
          <FaPlus /> Record New Expense
        </button>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-gold/40">
          <span className="text-xs uppercase text-text-muted font-bold">Total Farm Expenditure</span>
          <h3 className="text-3xl font-black text-gold mt-2">₹{summary.totalExpenses?.toLocaleString()}</h3>
          <p className="text-xs text-text-muted mt-1">{expenses.length} input records logged</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-primary/40">
          <span className="text-xs uppercase text-text-muted font-bold">Cost Per Acre (2.5 Acres)</span>
          <h3 className="text-3xl font-black text-primary-light mt-2">
            ₹{Math.round(summary.totalExpenses / 2.5).toLocaleString()}
          </h3>
          <p className="text-xs text-text-muted mt-1">Within standard ICAR budget benchmark</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-info/40">
          <span className="text-xs uppercase text-text-muted font-bold">Top Expense Category</span>
          <h3 className="text-xl font-bold text-info mt-2">
            {Object.keys(summary.categorySummary).sort((a, b) => summary.categorySummary[b] - summary.categorySummary[a])[0] || 'Fertilizers'}
          </h3>
          <p className="text-xs text-text-muted mt-1">₹{Math.max(...Object.values(summary.categorySummary || { 0: 0 })).toLocaleString()}</p>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b border-border flex justify-between items-center">
          <h3 className="text-lg font-bold">Expense Ledger (Kharif 2026)</h3>
          <span className="badge badge-gold">Active Crop: Tomato</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-surface text-xs uppercase text-text-muted">
                <th className="p-4">Date</th>
                <th className="p-4">Title / Item Description</th>
                <th className="p-4">Category</th>
                <th className="p-4">Crop</th>
                <th className="p-4 text-right">Amount (₹)</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((e) => (
                <tr key={e._id} className="border-b border-border hover:bg-bg-elevated transition">
                  <td className="p-4 text-xs text-text-muted">{new Date(e.date).toLocaleDateString()}</td>
                  <td className="p-4 font-bold text-sm">{e.title}</td>
                  <td className="p-4"><span className="badge badge-primary !text-xs">{e.category}</span></td>
                  <td className="p-4 text-xs">{e.cropName}</td>
                  <td className="p-4 text-right font-black text-gold">₹{e.amount?.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <button onClick={() => handleDelete(e._id)} className="text-danger-light hover:text-danger p-2">
                      <FaTrash size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="card max-w-lg w-full p-8 bg-bg-card border border-primary/30 relative">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary-light">
              <FaPlus /> Record Farm Input Expense
            </h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="form-label">Expense Title / Item</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. 19:19:19 Fertigation Soluble Bag (25kg)"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Amount (₹)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    placeholder="2500"
                    required
                  />
                </div>
                <div>
                  <label className="form-label">Category</label>
                  <select
                    className="form-input"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Crop Associated</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.cropName}
                    onChange={(e) => setFormData({ ...formData, cropName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Season</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.season}
                    onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
