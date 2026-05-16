import { useAuth } from '../../auth/hooks/useAuth';
import { Button } from '../../../shared/components/ui/Button';
import { ROUTES } from '../../../constants/app.constants';
import { useNavigate } from 'react-router-dom';

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  return (
    <div className="min-h-screen bg-chatgpt-dark">
      {/* Header */}
      <header className="bg-chatgpt-sidebar border-b border-gray-700">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-chatgpt-text">Qroq AI Chatbot</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              Welcome, {user?.firstName} {user?.lastName}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-chatgpt-sidebar rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-chatgpt-text mb-4">
              Welcome to Qroq AI Chatbot! 🎉
            </h2>
            <p className="text-gray-300 mb-6">
              Your account has been successfully authenticated.
            </p>
            <div className="bg-chatgpt-dark rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold text-chatgpt-text mb-3">User Information</h3>
              <div className="text-left space-y-2 text-gray-300">
                <p><span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}</p>
                <p><span className="font-medium">Email:</span> {user?.email}</p>
                <p><span className="font-medium">Email Verified:</span> {user?.emailVerified ? 'Yes' : 'No'}</p>
                <p><span className="font-medium">Member Since:</span> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-6">
              <p className="text-gray-400">
                Chat interface coming soon! 🚀
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;