"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { name: "Home", href: "/" },
  { name: "Discover", href: "/discover" },
  { name: "Listings", href: "/listings" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 md:px-10 xl:px-20">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-lg font-bold tracking-tight text-slate-200">
              Urban Sanctuary
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative text-sm font-medium transition-colors hover:text-slate-200",
                    isActive ? "text-slate-200" : "text-slate-400"
                  )}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute -bottom-1 left-0 h-[2px] w-full bg-blue-500"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link
            href="/signin"
            className="text-sm font-medium text-slate-400 transition-colors hover:text-slate-200"
          >
            Sign In
          </Link>
          <Link
            href="/auth/member"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_15px_rgba(37,99,235,0.4)]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </header>
  );
}
