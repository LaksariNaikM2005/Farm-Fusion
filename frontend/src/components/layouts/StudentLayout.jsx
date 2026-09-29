import { Outlet } from 'react-router-dom';
import { useState } from 'react';
import Topbar from '../Topbar';
import Sidebar from '../Sidebar';
import { FaGraduationCap, FaBook, FaClipboardCheck, FaMicroscope, FaUserCircle, FaHome } from 'react-icons/fa';

export default function StudentLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    {
      category: 'Academic Core',
      items: [
        { to: '/student', label: 'Student Dashboard', icon: <FaHome />, end: true },
        { to: '/student/courses', label: 'Curriculum & Courses', icon: <FaBook /> },
        { to: '/student/quizzes', label: 'MCQ & Quiz Arena', icon: <FaClipboardCheck /> },
        { to: '/student/cases', label: 'Field Case Studies', icon: <FaMicroscope /> },
      ],
    },
    {
      category: 'Profile & Settings',
      items: [
        { to: '/student/profile', label: 'Student Profile', icon: <FaUserCircle /> },
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
