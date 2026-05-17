import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './shared/components/layout/ThemeProvider';
import { PrivateRoute } from './routes/PrivateRoute';
import { PublicRoute } from './routes/PublicRoute';
import { ROUTE_PATHS } from './routes/routePaths';

// Auth Pages
import { LoginPage } from './features/auth/pages/LoginPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { VerifyEmailPage } from './features/auth/pages/VerifyEmailPage';
import { ForgotPasswordPage } from './features/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from './features/auth/pages/ResetPasswordPage';

// Dashboard Pages
import { DashboardPage } from './features/dashboard/pages/DashboardPage';

// Chat Pages
import { ChatPage } from './features/chat/pages/ChatPage';

// Landing Page
const LandingPage = () => {
  return (
    <div className="min-h-screen bg-chatgpt-dark flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-chatgpt-text mb-4">Qroq AI Chatbot</h1>
        <p className="text-gray-400 mb-8">Your AI-powered conversation assistant</p>
        <div className="space-x-4">
          <a href="/login" className="inline-block px-6 py-3 bg-chatgpt-green text-white rounded-lg hover:bg-[#0e8f6f] transition-colors">
            Sign In
          </a>
          <a href="/register" className="inline-block px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors">
            Create Account
          </a>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicRoute />}>
            <Route path={ROUTE_PATHS.LANDING} element={<LandingPage />} />
            <Route path={ROUTE_PATHS.LOGIN} element={<LoginPage />} />
            <Route path={ROUTE_PATHS.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTE_PATHS.VERIFY_EMAIL} element={<VerifyEmailPage />} />
            <Route path={ROUTE_PATHS.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route path={ROUTE_PATHS.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>

          {/* Protected Routes (Require Authentication) */}
          <Route element={<PrivateRoute />}>
            <Route path={ROUTE_PATHS.DASHBOARD} element={<DashboardPage />} />
            <Route path={ROUTE_PATHS.CHAT} element={<ChatPage />} />
            <Route path={ROUTE_PATHS.CHAT_CONVERSATION} element={<ChatPage />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;