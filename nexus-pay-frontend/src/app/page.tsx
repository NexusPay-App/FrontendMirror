'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/api';

// Splash screen content
const splashScreens = [
  {
    id: 1,
    title: "Welcome to NexusPay",
    description: "Pay bills with crypto instantly using M-Pesa integration",
    icon: "/assets/splash-wallet.svg",
  },
  {
    id: 2,
    title: "Fast & Secure Payments",
    description: "Convert USDC to KES and pay paybills or till numbers directly",
    icon: "/assets/splash-security.svg",
  },
  {
    id: 3,
    title: "Crypto Made Simple",
    description: "No complex blockchain knowledge needed - just simple payments",
    icon: "/assets/splash-chart.svg",
  },
];

export default function SplashScreen() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check if user is already authenticated
  useEffect(() => {
    if (api.isAuthenticated()) {
      router.push('/dashboard');
    } else {
      setIsCheckingAuth(false);
    }
  }, [router]);

  // Auto-advance the slides
  useEffect(() => {
    if (isCheckingAuth) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === splashScreens.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [isCheckingAuth]);

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="h-[72px] w-[72px] bg-[#1E2329] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-[28px] font-bold">N</span>
          </div>
          <div className="h-6 w-6 border-2 border-[#F0B90B] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Splash screens */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 pt-20 pb-10">
          {/* Logo */}
          <div className="mb-14">
            <div className="h-[72px] w-[72px] bg-[#1E2329] rounded-2xl flex items-center justify-center">
              <span className="text-white text-[28px] font-bold">N</span>
            </div>
          </div>
          
          {/* Images for splash screens */}
          <div className="relative w-full max-w-[280px] h-[280px] mb-14">
            {splashScreens.map((screen, index) => (
              <div 
                key={screen.id}
                className={`absolute inset-0 flex items-center justify-center transition-opacity duration-700 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="w-[260px] h-[260px] bg-[#F8F9FA] rounded-full flex items-center justify-center">
                    <Image
                      src={screen.icon}
                      alt={screen.title}
                      width={120}
                      height={120}
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Text content */}
          <div className="text-center mb-12 max-w-[320px]">
            <h1 className="text-2xl font-bold mb-4 text-[#1E2329]">
              {splashScreens[currentSlide].title}
            </h1>
            <p className="text-[#707A8A] text-base leading-relaxed">
              {splashScreens[currentSlide].description}
            </p>
          </div>
          
          {/* Dots indicator */}
          <div className="flex items-center gap-2 mb-8">
            {splashScreens.map((_, index) => (
              <button
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide 
                    ? 'w-10 bg-[#F0B90B]' 
                    : 'w-2 bg-[#EAECEF]'
                }`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
        
        {/* Bottom buttons */}
        <div className="px-6 pb-12 space-y-4">
          <Button asChild fullWidth size="xl" className="rounded-lg font-semibold">
            <Link href="/auth/signup">Get Started</Link>
          </Button>
          
          <Button 
            asChild 
            variant="outline" 
            fullWidth 
            size="xl" 
            className="rounded-lg font-semibold border-[#EAECEF] text-[#1E2329]"
          >
            <Link href="/auth/login">I Already Have an Account</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
