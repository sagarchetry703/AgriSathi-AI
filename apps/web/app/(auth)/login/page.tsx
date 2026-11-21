export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-bold text-brand-800">
            Welcome to AgriSathi AI
          </h1>
          <p className="mt-2 text-gray-600">
            Enter your mobile number to get started
          </p>
        </div>

        <div className="rounded-2xl border bg-white p-8 shadow-sm">
          <form className="space-y-6">
            <div>
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <div className="mt-1 flex rounded-lg border border-gray-300 overflow-hidden focus-within:ring-2 focus-within:ring-brand-500 focus-within:border-transparent">
                <span className="inline-flex items-center bg-gray-50 px-3 text-gray-500 text-sm border-r">
                  +91
                </span>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9]{10}"
                  maxLength={10}
                  required
                  placeholder="Enter 10-digit number"
                  className="flex-1 px-3 py-2.5 text-sm outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-600 transition-colors"
            >
              Send OTP
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
}
