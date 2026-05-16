import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ThemeToggle } from '../ui/ThemeToggle';
import { ROUTES } from '../../../constants/app.constants';

interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen bg-chatgpt-dark">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-chatgpt-sidebar/80 backdrop-blur-sm border-b border-gray-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to={ROUTES.LANDING} className="text-xl font-bold text-chatgpt-text hover:text-chatgpt-green transition-colors">
            Qroq AI
          </Link>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-20">
        <div className="auth-container">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Qroq AI Chatbot. All rights reserved.</p>
      </footer>
    </div>
  );
};