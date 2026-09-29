import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';
import {
  FaHome,
  FaStore,
  FaCalendarAlt,
  FaComments,
  FaClipboardList,
  FaFileInvoiceDollar,
  FaUsers,
  FaVirus,
  FaUserCircle,
  FaSeedling,
  FaRobot,
  FaTractor,
  FaHeartbeat,
  FaChartLine,
  FaLeaf,
  FaGraduationCap,
} from 'react-icons/fa';
import { io } from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { addNotification } from '../../store/slices/notificationSlice';

export default function FarmerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user) return;
    const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
    socket.emit('register', user._id);

    socket.on('notification', (data) => {
      dispatch(addNotification(data));
    });

    return () => socket.disconnect();
  }, [user, dispatch]);

  const navItems = [
    {
      category: 'Command Center',
      items: [
        { to: '/farmer', label: 'Dashboard', icon: <FaHome />, end: true },
        { to: '/farmer/copilot', label: 'AI Farmer Copilot', icon: <FaRobot /> },
        { to: '/farmer/profile', label: 'Farmer Profile & Soil', icon: <FaUserCircle /> },
      ],
    },
    {
      category: 'Farm Intelligence & Lifecycle',
      items: [
        { to: '/farmer/lifecycle', label: 'Farm Lifecycle (8 Stages)', icon: <FaSeedling /> },
        { to: '/farmer/crops', label: 'Crop ML & Profitability', icon: <FaSeedling /> },
        { to: '/farmer/diagnosis', label: 'AI Disease Diagnostic', icon: <FaVirus /> },
        { to: '/farmer/schemes', label: 'Personalized Schemes', icon: <FaClipboardList /> },
      ],
    },
    {
      category: 'Finance & Analytics',
      items: [
        { to: '/farmer/expenses', label: 'Expense Tracker', icon: <FaFileInvoiceDollar /> },
        { to: '/farmer/analytics', label: 'Farm ROI Analytics', icon: <FaChartLine /> },
        { to: '/farmer/sustainability', label: 'Sustainability Score', icon: <FaLeaf /> },
      ],
    },
    {
      category: 'Operations & Livestock',
      items: [
        { to: '/farmer/market-intelligence', label: 'Market Intelligence (APMC)', icon: <FaChartLine /> },
        { to: '/farmer/equipment', label: 'Equipment Rental', icon: <FaTractor /> },
        { to: '/farmer/veterinary', label: 'Veterinary & Livestock', icon: <FaHeartbeat /> },
        { to: '/farmer/marketplace', label: 'Agricultural Market', icon: <FaStore /> },
        { to: '/farmer/orders', label: 'My Orders', icon: <FaFileInvoiceDollar /> },
      ],
    },
    {
      category: 'Experts & Community',
      items: [
        { to: '/farmer/cases', label: 'Tripartite Case Studies', icon: <FaGraduationCap /> },
        { to: '/farmer/experts', label: 'Find Expert', icon: <FaUsers /> },
        { to: '/farmer/appointments', label: 'Appointments', icon: <FaCalendarAlt /> },
        { to: '/farmer/chat', label: 'Consultation Chat', icon: <FaComments /> },
        { to: '/farmer/forum', label: 'Farmer Forum', icon: <FaClipboardList /> },
      ],
    },
  ];

  return (
    <div className="dashboard-layout">
      <Topbar sidebarOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <Sidebar navItems={navItems} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
