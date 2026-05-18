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
import { LandingPage } from './features/landing/pages/LandingPage';

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