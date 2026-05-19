import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserProfileDropdown from '../common/UserProfileDropdown';
import ThemeToggle from '../common/ThemeToggle';

export default function Navbar() {
  const { user } = useAuth();

  const navLinkClasses = ({ isActive }) => 
    `font-['Inter'] tracking-tight transition-all duration-200 ${
      isActive 
        ? 'text-blue-700 dark:text-blue-400 border-b-2 border-blue-700 dark:border-blue-400 font-semibold' 
        : 'text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg shadow-[0_8px_24px_rgba(25,27,35,0.06)] dark:shadow-[0_8px_24px_rgba(0,0,0,0.2)] transition-colors">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-xl font-bold tracking-tighter text-primary dark:text-blue-400 transition-colors">
          The Urban Sanctuary
        </Link>
        <div className="hidden md:flex items-center space-x-8">
          <NavLink to="/" end className={navLinkClasses}>
            Discover
          </NavLink>
          <NavLink to="/rooms" className={navLinkClasses}>
            Listings
          </NavLink>
          {user?.role === 'user' && (
            <NavLink to="/user/dashboard?tab=bookings" className={navLinkClasses}>
              My Bookings
            </NavLink>
          )}
          {user?.role === 'agent' && (
            <NavLink to="/agent/dashboard" className={navLinkClasses}>
              Agent Portal
            </NavLink>
          )}
          {user?.role === 'agency' && (
            <NavLink to="/agency/dashboard" className={navLinkClasses}>
              Agency Console
            </NavLink>
          )}

        </div>
        <div className="flex items-center space-x-6">
          <ThemeToggle />
          
          {user ? (
            <UserProfileDropdown />
          ) : (
            <>
              <Link to="/login" className="text-slate-500 dark:text-slate-400 hover:text-blue-600 text-sm font-medium">SignIn</Link>
              <Link to="/signup" className="bg-primary dark:bg-blue-600 hover:bg-primary-container dark:hover:bg-blue-700 text-white shadow-primary/20 dark:shadow-blue-600/20 px-5 py-2.5 rounded-xl font-medium active:scale-95 duration-200 transition-all">
                List Property
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
