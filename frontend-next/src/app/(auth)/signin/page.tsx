"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center py-24 px-6 md:px-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome Back</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your sanctuary dashboard.</p>
        </div>
        
        <div className="rounded-3xl bg-card border border-border p-8 shadow-2xl">
          <form className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">
                Email Address
              </label>
              <input 
                type="email" 
                placeholder="name@example.com"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Password
                </label>
                <Link href="#" className="text-xs text-primary hover:text-primary/80 transition-colors">
                  Forgot?
                </Link>
              </div>
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full rounded-xl border border-input bg-background px-4 py-3 text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
              />
            </div>
            
            <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-sm font-bold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] dark:hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]">
              Sign In <ArrowRight className="h-4 w-4" />
            </button>
          </form>
          
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/auth/member" className="font-bold text-primary hover:text-primary/80 transition-colors">
              Sign up
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
