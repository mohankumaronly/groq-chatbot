import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/app.constants';

export const CTASection = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Ready to Get Started?
        </h2>
        <p className="max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-muted)' }}>
          Join thousands of users who are already experiencing the power of AI-assisted conversations.
        </p>
        <Link
          to={ROUTES.REGISTER}
          className="px-8 py-3 text-white rounded-lg transition-colors text-lg font-semibold inline-block"
          style={{ backgroundColor: 'var(--color-primary)' }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
        >
          Create Free Account
        </Link>
        <p className="text-sm mt-4" style={{ color: 'var(--text-muted)' }}>
          No credit card required • Free forever
        </p>
      </div>
    </section>
  );
};