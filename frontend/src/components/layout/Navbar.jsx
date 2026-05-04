import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import UserProfileDropdown from '../common/UserProfileDropdown';

export default function Navbar() {
  const { user } = useAuth();

  const navLinkClasses = ({ isActive }) => 
    `font-['Inter'] tracking-tight transition-all duration-200 ${
      isActive 
        ? 'text-blue-700 border-b-2 border-blue-700 font-semibold' 
        : 'text-slate-500 hover:text-blue-600'
    }`;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg shadow-[0_8px_24px_rgba(25,27,35,0.06)]">
      <div className="flex justify-between items-center px-8 py-4 max-w-screen-2xl mx-auto">
        <Link to="/" className="text-xl font-bold tracking-tighter text-blue-900">
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
            <NavLink to="/admin/agency" className={navLinkClasses}>
              Agency Console
            </NavLink>
          )}
          {user?.role === 'superadmin' && (
            <NavLink to="/admin/super" className={navLinkClasses}>
              System Admin
            </NavLink>
          )}
        </div>
        <div className="flex items-center space-x-6">
          {user ? (
            <UserProfileDropdown />
          ) : (
            <>
              <Link to="/login" className="text-slate-500 hover:text-blue-600 text-sm font-medium">SignIn</Link>
              <Link to="/signup" className="bg-[#0040A1] text-white px-5 py-2.5 rounded-xl font-medium active:scale-95 duration-200">
                List Property
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
