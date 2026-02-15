import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Pizza, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const { getCartCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-red-600 to-yellow-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <Pizza className="w-8 h-8 text-white group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-2xl font-bold text-white tracking-tight">
              Pizza<span className="text-yellow-300">Wala</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
            >
              Menu
            </Link>

            {isAuthenticated && (
              <Link
                to="/orders"
                className="text-white hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                My Orders
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="flex items-center space-x-1 text-white hover:text-yellow-300 font-medium transition-colors duration-200"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Admin</span>
              </Link>
            )}

            {/* Cart */}
            <Link
              to="/cart"
              className="relative text-white hover:text-yellow-300 transition-colors duration-200"
            >
              <ShoppingCart className="w-6 h-6" />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-red-600 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-white bg-opacity-20 px-3 py-1.5 rounded-full">
                  <User className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {user?.name}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 bg-white text-red-600 px-4 py-2 rounded-full font-medium hover:bg-yellow-300 hover:text-red-700 transition-all duration-200 shadow-md"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center space-x-1 bg-white text-red-600 px-5 py-2 rounded-full font-medium hover:bg-yellow-300 hover:text-red-700 transition-all duration-200 shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;