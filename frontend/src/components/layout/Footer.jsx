import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full py-16 px-8 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
        <div className="space-y-4">
          <div className="text-lg font-black text-slate-900 dark:text-white uppercase">The Urban Sanctuary</div>
          <p className="text-slate-500 dark:text-slate-400 text-sm normal-case">Curating premium living experiences across the Kathmandu Valley since 2024.</p>
        </div>
        <div className="space-y-4">
          <div className="font-['Inter'] text-sm uppercase tracking-widest font-bold text-blue-700">Quick Links</div>
          <ul className="space-y-2">
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-500 underline decoration-blue-500/30 underline-offset-4 text-sm uppercase tracking-widest" to="#">Privacy Policy</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-500 underline decoration-blue-500/30 underline-offset-4 text-sm uppercase tracking-widest" to="#">Terms of Service</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-500 underline decoration-blue-500/30 underline-offset-4 text-sm uppercase tracking-widest" to="#">Careers</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <div className="font-['Inter'] text-sm uppercase tracking-widest font-bold text-blue-700">Resources</div>
          <ul className="space-y-2">
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-500 underline decoration-blue-500/30 underline-offset-4 text-sm uppercase tracking-widest" to="#">Neighborhood Guide</Link></li>
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-500 underline decoration-blue-500/30 underline-offset-4 text-sm uppercase tracking-widest" to="#">Property Management</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <div className="font-['Inter'] text-sm uppercase tracking-widest font-bold text-blue-700">Contact</div>
          <ul className="space-y-2">
            <li><Link className="text-slate-500 dark:text-slate-400 hover:text-blue-500 underline decoration-blue-500/30 underline-offset-4 text-sm uppercase tracking-widest" to="#">Contact Us</Link></li>
            <li className="text-slate-500 dark:text-slate-400 text-xs normal-case pt-4">Naxal, Bhagawati Bahal, Kathmandu<br/>+977-1-4XXXXXX</li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-700/40 text-center">
        <p className="text-slate-400 font-['Inter'] text-[10px] uppercase tracking-widest">© 2024 The Urban Sanctuary Kathmandu. All rights reserved.</p>
      </div>
    </footer>
  );
}
