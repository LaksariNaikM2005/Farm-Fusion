import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { FaChartLine, FaChartPie, FaCoins, FaSeedling, FaArrowUp, FaTractor } from 'react-icons/fa';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

export default function FarmAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/overview');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ['#2d7a3a', '#f0b429', '#1f6feb', '#da3633', '#8b5cf6', '#06b6d4'];

  if (loading) return <div className="spinner-wrap"><div className="spinner"></div></div>;

  return (
    <div className="fade-in max-w-6xl mx-auto">
      <div className="page-header mb-8">
        <h1 className="page-title flex items-center gap-3">
          <FaChartLine className="text-primary-light" /> Farm Performance & Financial Analytics
        </h1>
        <p className="page-subtitle">Interactive visual metrics on cost per acre, revenue streams, net margins, and crop ROI.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-gold/30">
          <span className="text-xs uppercase text-text-muted font-bold">Total Estimated Revenue</span>
          <h3 className="text-3xl font-black text-gold mt-2">₹{data?.summary?.totalRevenue?.toLocaleString()}</h3>
          <p className="text-xs text-text-muted mt-1">₹{data?.summary?.revenuePerAcre?.toLocaleString()}/Acre</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-danger/30">
          <span className="text-xs uppercase text-text-muted font-bold">Total Recorded Cost</span>
          <h3 className="text-3xl font-black text-danger-light mt-2">₹{data?.summary?.totalExpense?.toLocaleString()}</h3>
          <p className="text-xs text-text-muted mt-1">₹{data?.summary?.costPerAcre?.toLocaleString()}/Acre</p>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-primary/40">
          <span className="text-xs uppercase text-text-muted font-bold">Net Operating Profit</span>
          <h3 className="text-3xl font-black text-success-light mt-2">₹{data?.summary?.netProfit?.toLocaleString()}</h3>
          <span className="badge badge-primary !text-xs mt-1 font-bold">Margin: {data?.summary?.profitMarginPercent}%</span>
        </div>
        <div className="card p-6 bg-gradient-to-br from-bg-card to-bg-elevated border-info/30">
          <span className="text-xs uppercase text-text-muted font-bold">Cultivated Land</span>
          <h3 className="text-3xl font-black text-info mt-2">{data?.summary?.totalLandArea} Acres</h3>
          <p className="text-xs text-text-muted mt-1">{data?.summary?.activeCyclesCount} Active Cycles</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Expense Trend */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-primary-light">
            <FaChartLine /> Monthly Expenditure Trajectory (₹)
          </h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.monthlyExpenseData}>
                <defs>
                  <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2d7a3a" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#2d7a3a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <Tooltip contentStyle={{ backgroundColor: '#1c2333', borderColor: '#f0b429' }} />
                <Area type="monotone" dataKey="amount" stroke="#3d9b4d" fillOpacity={1} fill="url(#colorExp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Expense Breakdown */}
        <div className="card p-6">
          <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-gold">
            <FaChartPie /> Input Cost Distribution by Category
          </h3>
          <div className="h-72 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data?.categoryPieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {data?.categoryPieData?.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1c2333', borderColor: '#f0b429' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Crop Performance Matrix */}
      <div className="card p-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-text-primary">
          <FaSeedling className="text-primary-light" /> Crop Economic Performance Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg-surface text-xs uppercase text-text-muted">
                <th className="p-4">Crop Enterprise</th>
                <th className="p-4">Area (Acres)</th>
                <th className="p-4">Total Cost</th>
                <th className="p-4">Gross Revenue</th>
                <th className="p-4">Net Profit</th>
                <th className="p-4 text-center">Return on Investment</th>
              </tr>
            </thead>
            <tbody>
              {data?.cropPerformance?.map((c, i) => (
                <tr key={i} className="border-b border-border hover:bg-bg-elevated transition">
                  <td className="p-4 font-bold text-sm text-gold">{c.crop}</td>
                  <td className="p-4 text-xs">{c.allocatedArea}</td>
                  <td className="p-4 text-xs text-danger-light">₹{c.expense?.toLocaleString()}</td>
                  <td className="p-4 text-xs text-gold font-bold">₹{c.revenue?.toLocaleString()}</td>
                  <td className="p-4 text-xs text-success-light font-bold">₹{c.profit?.toLocaleString()}</td>
                  <td className="p-4 text-center">
                    <span className="badge badge-primary !text-xs font-bold">{c.roi}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
