import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Auth pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Farmer pages (Legacy + 2.0 Extended)
import FarmerHome from './pages/farmer/FarmerHome';
import MarketPlace from './pages/farmer/MarketPlace';
import ProductDetail from './pages/farmer/ProductDetail';
import Cart from './pages/farmer/Cart';
import FarmerAppointments from './pages/farmer/Appointments';
import ExpertDirectory from './pages/farmer/ExpertDirectory';
import FarmerChat from './pages/farmer/Chat';
import Forum from './pages/farmer/Forum';
import ForumPost from './pages/farmer/ForumPost';
import Schemes from './pages/farmer/Schemes';
import OrderHistory from './pages/farmer/OrderHistory';
import AIDiagnosis from './pages/farmer/AIDiagnosis';

// Farm Fusion 2.0 Farmer Intelligence Pages
import FarmerProfile from './pages/farmer/FarmerProfile';
import FarmLifecycle from './pages/farmer/FarmLifecycle';
import CropIntelligence from './pages/farmer/CropIntelligence';
import AICopilot from './pages/farmer/AICopilot';
import ExpenseTracker from './pages/farmer/ExpenseTracker';
import FarmAnalytics from './pages/farmer/FarmAnalytics';
import SustainabilityScore from './pages/farmer/SustainabilityScore';
import EquipmentRental from './pages/farmer/EquipmentRental';
import VeterinaryCare from './pages/farmer/VeterinaryCare';
import TripartiteCases from './pages/farmer/TripartiteCases';
import MarketIntelligence from './pages/farmer/MarketIntelligence';

// Expert pages
import ExpertHome from './pages/expert/ExpertHome';
import AppointmentManager from './pages/expert/AppointmentManager';
import ExpertChat from './pages/expert/ExpertChat';
import ConsultationHistory from './pages/expert/ConsultationHistory';
import VideoCall from './pages/expert/VideoCall';

// Student pages (Student Mode)
import StudentDashboard from './pages/student/StudentDashboard';
import Courses from './pages/student/Courses';
import QuizArena from './pages/student/QuizArena';
import CaseStudyAnalysis from './pages/student/CaseStudyAnalysis';

// Admin pages
import AdminHome from './pages/admin/AdminHome';
import ManageUsers from './pages/admin/ManageUsers';
import ManageProducts from './pages/admin/ManageProducts';
import ManageSchemes from './pages/admin/ManageSchemes';
import ManageAppointments from './pages/admin/ManageAppointments';
import ForumModeration from './pages/admin/ForumModeration';

// Layouts
import FarmerLayout from './components/layouts/FarmerLayout';
import ExpertLayout from './components/layouts/ExpertLayout';
import AdminLayout from './components/layouts/AdminLayout';
import StudentLayout from './components/layouts/StudentLayout';
import LandingPage from './pages/LandingPage';
import Profile from './pages/common/Profile';

const ProtectedRoute = ({ children, roles }) => {
  const { isAuthenticated, user } = useSelector((s) => s.auth);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};

export default function App() {
  const { isAuthenticated, user } = useSelector((s) => s.auth);

  const defaultRedirect = () => {
    if (!isAuthenticated) return '/';
    if (user?.role === 'admin') return '/admin';
    if (user?.role === 'expert') return '/expert';
    if (user?.role === 'student') return '/student';
    return '/farmer';
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={isAuthenticated ? <Navigate to={defaultRedirect()} /> : <Login />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to={defaultRedirect()} /> : <Register />} />

        {/* Farmer */}
        <Route path="/farmer" element={<ProtectedRoute roles={['farmer']}><FarmerLayout /></ProtectedRoute>}>
          <Route index element={<FarmerHome />} />
          <Route path="copilot" element={<AICopilot />} />
          <Route path="profile" element={<FarmerProfile />} />
          <Route path="lifecycle" element={<FarmLifecycle />} />
          <Route path="crops" element={<CropIntelligence />} />
          <Route path="diagnosis" element={<AIDiagnosis />} />
          <Route path="schemes" element={<Schemes />} />
          <Route path="expenses" element={<ExpenseTracker />} />
          <Route path="analytics" element={<FarmAnalytics />} />
          <Route path="sustainability" element={<SustainabilityScore />} />
          <Route path="equipment" element={<EquipmentRental />} />
          <Route path="market-intelligence" element={<MarketIntelligence />} />
          <Route path="veterinary" element={<VeterinaryCare />} />
          <Route path="cases" element={<TripartiteCases />} />
          
          {/* Legacy E-commerce & Consultations */}
          <Route path="marketplace" element={<MarketPlace />} />
          <Route path="marketplace/:id" element={<ProductDetail />} />
          <Route path="cart" element={<Cart />} />
          <Route path="appointments" element={<FarmerAppointments />} />
          <Route path="experts" element={<ExpertDirectory />} />
          <Route path="chat" element={<FarmerChat />} />
          <Route path="chat/:conversationId" element={<FarmerChat />} />
          <Route path="forum" element={<Forum />} />
          <Route path="forum/:id" element={<ForumPost />} />
          <Route path="orders" element={<OrderHistory />} />
        </Route>

        {/* Student Mode */}
        <Route path="/student" element={<ProtectedRoute roles={['student']}><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="courses" element={<Courses />} />
          <Route path="quizzes" element={<QuizArena />} />
          <Route path="cases" element={<CaseStudyAnalysis />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Expert */}
        <Route path="/expert" element={<ProtectedRoute roles={['expert']}><ExpertLayout /></ProtectedRoute>}>
          <Route index element={<ExpertHome />} />
          <Route path="appointments" element={<AppointmentManager />} />
          <Route path="chat" element={<ExpertChat />} />
          <Route path="chat/:conversationId" element={<ExpertChat />} />
          <Route path="history" element={<ConsultationHistory />} />
          <Route path="video/:appointmentId" element={<VideoCall />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<ManageUsers />} />
          <Route path="products" element={<ManageProducts />} />
          <Route path="schemes" element={<ManageSchemes />} />
          <Route path="appointments" element={<ManageAppointments />} />
          <Route path="forum" element={<ForumModeration />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
