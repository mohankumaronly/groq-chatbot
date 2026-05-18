import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🤖</span>
              <span className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>Qroq AI</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Next-generation AI chatbot for coding, writing, and research.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Product</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>Features</Link></li>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>Pricing</Link></li>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>FAQ</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Company</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>About</Link></li>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>Blog</Link></li>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>Legal</h4>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--text-muted)' }}>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>Privacy</Link></li>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>Terms</Link></li>
              <li><Link to="#" className="hover:text-chatgpt-green transition-colors" style={{ color: 'inherit' }}>Security</Link></li>
            </ul>
          </div>
        </div>
        <div className="text-center text-sm pt-8 border-t" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-color)' }}>
          <p>&copy; {new Date().getFullYear()} Qroq AI Chatbot. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};