import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-12 max-w-4xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-3xl font-bold text-text mb-4">NexusPay Implementation</h1>
          <p className="text-text-secondary">
            Based on the provided design mockups
          </p>
        </header>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="nexus-card shadow-card">
            <h2 className="text-xl font-bold mb-6 text-text border-b border-border pb-4">Authentication Flow</h2>
            <div className="space-y-4">
              <div className="rounded-md border border-border p-5 hover:shadow-card transition-all">
                <h3 className="font-medium mb-2">Splash Screen</h3>
                <p className="text-sm text-text-secondary mb-3">Introduction to the app with slider</p>
                <Link 
                  href="/" 
                  className="inline-block btn-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-dark transition-colors"
                >
                  View Screen
                </Link>
              </div>

              <div className="rounded-md border border-border p-5 hover:shadow-card transition-all">
                <h3 className="font-medium mb-2">Login</h3>
                <p className="text-sm text-text-secondary mb-3">User authentication</p>
                <Link 
                  href="/auth/login" 
                  className="inline-block btn-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-dark transition-colors"
                >
                  View Screen
                </Link>
              </div>

              <div className="rounded-md border border-border p-5 hover:shadow-card transition-all">
                <h3 className="font-medium mb-2">Sign Up</h3>
                <p className="text-sm text-text-secondary mb-3">New user registration</p>
                <Link 
                  href="/auth/signup" 
                  className="inline-block btn-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-dark transition-colors"
                >
                  View Screen
                </Link>
              </div>

              <div className="rounded-md border border-border p-5 hover:shadow-card transition-all">
                <h3 className="font-medium mb-2">Verification</h3>
                <p className="text-sm text-text-secondary mb-3">OTP verification</p>
                <Link 
                  href="/auth/verify" 
                  className="inline-block btn-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-dark transition-colors"
                >
                  View Screen
                </Link>
              </div>
            </div>
          </div>

          <div className="nexus-card shadow-card">
            <h2 className="text-xl font-bold mb-6 text-text border-b border-border pb-4">Main App Screens</h2>
            <div className="space-y-4">
              <div className="rounded-md border border-border p-5 hover:shadow-card transition-all">
                <h3 className="font-medium mb-2">Dashboard</h3>
                <p className="text-sm text-text-secondary mb-3">Main user dashboard</p>
                <Link 
                  href="/dashboard" 
                  className="inline-block btn-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-accent-dark transition-colors"
                >
                  View Screen
                </Link>
              </div>

              <div className="rounded-md border border-border p-5 hover:shadow-card transition-all">
                <h3 className="font-medium mb-2">Send Money</h3>
                <p className="text-sm text-text-secondary mb-3">Transfer funds flow</p>
                <div
                  className="inline-block bg-background-secondary text-text-muted px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed border border-border"
                >
                  Coming Soon
                </div>
              </div>

              <div className="rounded-md border border-border p-5 hover:shadow-card transition-all">
                <h3 className="font-medium mb-2">Receive Money</h3>
                <p className="text-sm text-text-secondary mb-3">Receive payment flow</p>
                <div
                  className="inline-block bg-background-secondary text-text-muted px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed border border-border"
                >
                  Coming Soon
                </div>
              </div>

              <div className="rounded-md border border-border p-5 hover:shadow-card transition-all">
                <h3 className="font-medium mb-2">Pay Bills</h3>
                <p className="text-sm text-text-secondary mb-3">Bill payment flow</p>
                <div
                  className="inline-block bg-background-secondary text-text-muted px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed border border-border"
                >
                  Coming Soon
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-lg bg-primary text-text-inverse nexus-card shadow-card">
          <h2 className="text-xl font-bold mb-4">Implementation Progress</h2>
          <ul className="space-y-2 pl-5 list-disc marker:text-accent">
            <li className="text-text-inverse">Implemented base UI components</li>
            <li className="text-text-inverse">Authentication flow screens</li>
            <li className="text-text-inverse">Dashboard layout</li>
            <li className="text-text-inverse">Dark/light mode support</li>
            <li className="text-text-inverse">PWA configuration</li>
            <li className="text-text-inverse">Mobile-responsive layouts</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 