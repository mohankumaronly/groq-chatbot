import { Link } from 'react-router-dom';
import { ROUTES } from '../../../constants/app.constants';

export const HeroSection = () => {
  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "<1s", label: "Response Time" },
    { value: "24/7", label: "Availability" },
    { value: "Free", label: "To Start" }
  ];

  return (
    <section className="pt-32 pb-20 px-4">
      <div className="container mx-auto text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6" style={{ backgroundColor: 'var(--color-primary)/10' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--color-primary)' }}></span>
          <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>Now Available</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
          Your AI-Powered
          <span className="block mt-2" style={{ color: 'var(--color-primary)' }}>Conversation Assistant</span>
        </h1>
        
        <p className="text-xl max-w-2xl mx-auto mb-10" style={{ color: 'var(--text-muted)' }}>
          Experience the future of conversation with Qroq AI. Get instant answers, 
          generate code, and boost your productivity.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={ROUTES.REGISTER}
            className="px-8 py-3 text-white rounded-lg transition-colors text-lg font-semibold"
            style={{ backgroundColor: 'var(--color-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
          >
            Start Chatting Free
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="px-8 py-3 rounded-lg transition-colors text-lg font-semibold"
            style={{ backgroundColor: 'var(--bg-surface)', color: 'var(--text-primary)' }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-surface)'}
          >
            Sign In
          </Link>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 max-w-3xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>{stat.value}</div>
              <div className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};