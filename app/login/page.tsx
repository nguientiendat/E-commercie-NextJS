// export const runtime = "edge";
import { Navbar } from "@/components/navbar";
import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />

      <main className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="w-full max-w-md">
          <LoginForm />

          {/* Trust Indicators */}
          <div className="mt-8 text-center space-y-4 text-sm text-gray-600">
            <p>🔒 Your data is encrypted and secure</p>
            <p>✓ No account? Sign up in 30 seconds</p>
            <p>💬 Questions? Contact our support team</p>
          </div>
        </div>
      </main>
    </div>
  );
}
