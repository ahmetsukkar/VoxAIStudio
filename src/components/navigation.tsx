import Link from "next/link";
import { AudioWaveform, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200/60 bg-slate-50/95 backdrop-blur supports-[backdrop-filter]:bg-slate-50/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-indigo-500 to-cyan-500 shadow-lg">
              <AudioWaveform className="h-5 w-5 text-white" />
            </div>
            <Link href="/">
              <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-xl font-bold text-transparent">
                Vox AI Studio
              </span>
            </Link>
          </div>
          
          <div className="hidden items-center space-x-8 md:flex">
            <Link href="/#features" className="text-slate-600 transition-colors hover:text-indigo-600">
              Features
            </Link>
            <Link href="/#pricing" className="text-slate-600 transition-colors hover:text-indigo-600">
              Pricing
            </Link>
            <Link href="/#testimonials" className="text-slate-600 transition-colors hover:text-indigo-600">
              Reviews
            </Link>
            <Link href="/blog" className="text-slate-600 transition-colors hover:text-indigo-600">
              Blog
            </Link>
            <Link href="/legal/about" className="text-slate-600 transition-colors hover:text-indigo-600">
              About
            </Link>
          </div>
          
          <div className="flex items-center gap-3">
            <Link href="/auth/sign-in">
              <Button variant="ghost" size="sm" className="cursor-pointer">
                Sign In
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="sm" className="cursor-pointer gap-2">
                Try Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
