import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-md">
                <span className="text-text-inverse text-sm font-bold">N</span>
              </div>
              <span className="font-bold text-lg text-text">NexusPay</span>
            </div>
            <p className="text-sm text-text-secondary">
              A secure and efficient payment platform for all your financial needs.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-text-secondary hover:text-text" aria-label="Twitter">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                </svg>
              </a>
              <a href="#" className="text-text-secondary hover:text-text" aria-label="Instagram">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
              </a>
              <a href="#" className="text-text-secondary hover:text-text" aria-label="LinkedIn">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect width="4" height="12" x="2" y="9" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
            </div>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text">Products</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/features" className="text-text-secondary hover:text-text transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/security" className="text-text-secondary hover:text-text transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="text-text-secondary hover:text-text transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text">Resources</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/help" className="text-text-secondary hover:text-text transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/developers" className="text-text-secondary hover:text-text transition-colors">
                  Developers
                </Link>
              </li>
              <li>
                <Link href="/documentation" className="text-text-secondary hover:text-text transition-colors">
                  Documentation
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-text">Company</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/about" className="text-text-secondary hover:text-text transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-text-secondary hover:text-text transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-text transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-border pt-8 flex flex-col-reverse gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-text-secondary">
            &copy; {new Date().getFullYear()} NexusPay. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-text-secondary">
            <Link href="/terms" className="hover:text-text transition-colors">
              Terms of Service
            </Link>
            <Link href="/privacy" className="hover:text-text transition-colors">
              Privacy Policy
            </Link>
            <Link href="/cookies" className="hover:text-text transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 