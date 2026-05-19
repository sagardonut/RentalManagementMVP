import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12 md:py-16">
      <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-20">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="text-xl font-bold tracking-tight text-slate-200">
              Urban Sanctuary
            </Link>
            <p className="mt-4 max-w-xs text-sm text-slate-400 leading-relaxed">
              Elevating the standard of premium real estate living in Nepal. Discover your next sanctuary with confidence.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Platform</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/discover" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Discover</Link></li>
              <li><Link href="/listings" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">All Listings</Link></li>
              <li><Link href="/auth/agent" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">For Agents</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Contact</Link></li>
              <li><Link href="/careers" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Careers</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-200">Legal</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/privacy" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-slate-400 hover:text-blue-400 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Urban Sanctuary. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Social Icons would go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
