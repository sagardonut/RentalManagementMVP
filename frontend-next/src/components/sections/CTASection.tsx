import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CTASection() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute inset-0 bg-blue-600/10" />
      <div className="absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/20 blur-[120px] rounded-full" />
      
      <div className="mx-auto max-w-7xl px-6 md:px-10 xl:px-20 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-100 mb-6">
          Ready to find your sanctuary?
        </h2>
        <p className="text-xl text-slate-400 mb-10 max-w-2xl mx-auto">
          Join thousands of satisfied residents and discover the most exclusive properties in Kathmandu today.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/listings"
            className="flex items-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white transition-all hover:bg-blue-500 hover:shadow-[0_0_20px_rgba(37,99,235,0.4)]"
          >
            Explore Listings <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            href="/auth/agent"
            className="rounded-full bg-slate-900 border border-slate-700 px-8 py-4 text-base font-bold text-slate-200 transition-colors hover:bg-slate-800"
          >
            Become an Agent
          </Link>
        </div>
      </div>
    </section>
  );
}
