import { Link } from 'react-router-dom';
import { ThemeToggle } from '../../../shared/components/ui/ThemeToggle';
import { ROUTES } from '../../../constants/app.constants';

export const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b" style={{ backgroundColor: 'var(--bg-sidebar)', borderColor: 'var(--border-color)' }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🤖</span>
            <span className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>Qroq AI</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to={ROUTES.LOGIN}
              className="px-4 py-2 transition-colors"
              style={{ color: 'var(--text-secondary)' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
            >
              Sign In
            </Link>
            <Link
              to={ROUTES.REGISTER}
              className="px-4 py-2 text-white rounded-lg transition-colors"
              style={{ backgroundColor: 'var(--color-primary)' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};