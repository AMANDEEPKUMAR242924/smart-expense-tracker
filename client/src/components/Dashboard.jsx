import { useEffect, useState } from 'react';
import API from '../api';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Trash2, LogOut, PlusCircle } from 'lucide-react';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'];
const CATEGORIES = ['Food', 'Travel', 'Rent', 'Shopping', 'Bills', 'Salary', 'Freelance', 'Other'];

export default function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [form, setForm] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchTransactions = async () => {
    try {
      const query = filterType ? `?type=${filterType}` : '';
      const { data } = await API.get(`/transactions${query}`);
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [filterType]);

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/transactions', { ...form, amount: Number(form.amount) });
      setForm({ ...form, title: '', amount: '' });
      fetchTransactions();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add transaction');
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const expenseByCategory = Object.values(
    transactions
      .filter((t) => t.type === 'expense')
      .reduce((acc, t) => {
        acc[t.category] = acc[t.category] || { name: t.category, value: 0 };
        acc[t.category].value += t.amount;
        return acc;
      }, {})
  );

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Navbar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Wallet className="w-7 h-7 text-indigo-600" />
          <span className="text-xl font-bold text-slate-800">ExpenseTracker</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-slate-600 hidden sm:inline">Hi, {user.name}</span>
          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-sm bg-slate-100 hover:bg-red-50 hover:text-red-600 px-3 py-1.5 rounded-lg transition cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Balance</p>
              <h3 className="text-2xl font-bold text-slate-800">₹{balance.toLocaleString()}</h3>
            </div>
            <Wallet className="w-10 h-10 text-indigo-500 bg-indigo-50 p-2 rounded-lg" />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Income</p>
              <h3 className="text-2xl font-bold text-emerald-600">₹{totalIncome.toLocaleString()}</h3>
            </div>
            <TrendingUp className="w-10 h-10 text-emerald-500 bg-emerald-50 p-2 rounded-lg" />
          </div>
          <div className="bg-white p-5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Total Expense</p>
              <h3 className="text-2xl font-bold text-rose-600">₹{totalExpense.toLocaleString()}</h3>
            </div>
            <TrendingDown className="w-10 h-10 text-rose-500 bg-rose-50 p-2 rounded-lg" />
          </div>
        </div>

        {/* Form + Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Add Transaction */}
          <form onSubmit={handleAdd} className="bg-white p-6 rounded-xl shadow-sm space-y-4">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-600" /> Add Transaction
            </h2>
            <input
              type="text"
              placeholder="Title (e.g., Lunch, Salary)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                placeholder="Amount (₹)"
                min="1"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition cursor-pointer"
            >
              Add Transaction
            </button>
          </form>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Expense Breakdown</h2>
            {expenseByCategory.length === 0 ? (
              <p className="text-slate-400 text-center py-16">No expense data yet to display chart.</p>
            ) : (
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={expenseByCategory} dataKey="value" nameKey="name" outerRadius={85} label>
                      {expenseByCategory.map((_, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val) => `₹${val}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Transaction List */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800">Recent Transactions</h2>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-1.5 border rounded-lg text-sm"
            >
              <option value="">All Types</option>
              <option value="income">Income Only</option>
              <option value="expense">Expense Only</option>
            </select>
          </div>

          {transactions.length === 0 ? (
            <p className="text-slate-400 text-center py-8">No transactions found.</p>
          ) : (
            <div className="divide-y">
              {transactions.map((t) => (
                <div key={t._id} className="py-3 flex justify-between items-center">
                  <div>
                    <p className="font-medium text-slate-800">{t.title}</p>
                    <p className="text-xs text-slate-500">
                      {t.category} • {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`font-semibold ${
                        t.type === 'income' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDelete(t._id)}
                      className="text-slate-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}