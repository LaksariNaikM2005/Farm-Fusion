require('express-async-errors');
require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/db');
const { initSocket } = require('./config/socket');
const errorHandler = require('./middlewares/errorHandler');
const { generalLimiter } = require('./middlewares/rateLimiter');

// Route imports
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const appointmentRoutes = require('./routes/appointments');
const chatRoutes = require('./routes/chat');
const forumRoutes = require('./routes/forum');
const schemeRoutes = require('./routes/schemes');
const externalRoutes = require('./routes/external');
const adminRoutes = require('./routes/admin');
const reviewRoutes = require('./routes/reviews');

// Farm Fusion 2.0 Routes
const farmerProfileRoutes = require('./routes/farmerProfile');
const farmRoutes = require('./routes/farms');
const lifecycleRoutes = require('./routes/lifecycle');
const expenseRoutes = require('./routes/expenses');
const analyticsRoutes = require('./routes/analytics');
const cropRoutes = require('./routes/crops');
const sustainabilityRoutes = require('./routes/sustainability');
const equipmentRoutes = require('./routes/equipment');
const veterinaryRoutes = require('./routes/veterinary');
const studentRoutes = require('./routes/student');
const caseRoutes = require('./routes/cases');
const knowledgeRoutes = require('./routes/knowledge');
const aiRoutes = require('./routes/ai');
const diseaseRoutes = require('./routes/disease');

const app = express();
const server = http.createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:5173',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: allowedOrigins, methods: ['GET', 'POST'], credentials: true },
});
initSocket(io);

// Inject io into appointment controller for notifications
const appointmentController = require('./controllers/appointmentController');
appointmentController.setIO(io);

// Middleware
app.use(helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }));
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) callback(null, true);
      else callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(morgan('dev'));
app.use(generalLimiter);

// Stripe webhook needs raw body
app.post('/api/v1/orders/webhook', express.raw({ type: 'application/json' }), require('./controllers/orderController').stripeWebhook);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/v1/health', (req, res) =>
  res.json({
    success: true,
    platform: 'Farm Fusion 2.0 Ecosystem API',
    message: '🌾 Farm Fusion 2.0 API is running smoothly!',
    timestamp: new Date().toISOString(),
  })
);

// API Routes (Legacy + 2.0 Extension)
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/chat', chatRoutes);
app.use('/api/v1/forum', forumRoutes);
app.use('/api/v1/schemes', schemeRoutes);
app.use('/api/v1/external', externalRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/reviews', reviewRoutes);

// Farm Fusion 2.0 Intelligence Endpoints
app.use('/api/v1/farmer-profile', farmerProfileRoutes);
app.use('/api/v1/farms', farmRoutes);
app.use('/api/v1/lifecycle', lifecycleRoutes);
app.use('/api/v1/expenses', expenseRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/crops', cropRoutes);
app.use('/api/v1/sustainability', sustainabilityRoutes);
app.use('/api/v1/equipment', equipmentRoutes);
app.use('/api/v1/veterinary', veterinaryRoutes);
app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/cases', caseRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/disease', diseaseRoutes);

// 404 handler
app.use('*', (req, res) => res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` }));

// Error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Farm Fusion 2.0 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`));
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
